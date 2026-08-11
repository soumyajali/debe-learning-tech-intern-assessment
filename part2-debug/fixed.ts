import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

interface BookingRequest {
  studentId: string;
  teacherId: string;
  slot: string;
  subject: string;
}
// Fix 1 (Security): The original function did not verify authentication.
// Why it matters: Without this check, an unauthenticated client or malicious actor 
// could submit a request and potentially create bookings on behalf of any studentId.
export const bookSession = functions.https.onCall(
  async (data: BookingRequest, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Authentication is required."
      );
    }

    const booking = {
      studentId: data.studentId,
      teacherId: data.teacherId,
      slot: data.slot,
      subject: data.subject,
      status: "confirmed",
      // Best practice: use serverTimestamp rather than client-provided Date
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const teacherRef = db.collection("teachers").doc(data.teacherId);

    // Fix 2 (Typing): Firestore get() returns a Promise. The original code tried
    // to access existing.docs.length before awaiting the query snapshot.
    // Why it matters: Property 'docs' does not exist on type 'Promise<QuerySnapshot>'. 
    // This causes a runtime crash and fails TS compilation, meaning the conflict check never runs.
    const existing = await teacherRef
      .collection("bookings")
      .where("slot", "==", data.slot)
      .get();

    if (!existing.empty) {
      return {
        success: false,
        message: "Slot already booked",
      };
    }

    // Fix 3 (Logic): The original code checked for conflicts in the teacher's subcollection 
    // (`teachers/{id}/bookings`) but wrote the new booking to the root `db.collection("bookings")`.
    // Why it matters: The conflict check would never find the root bookings, meaning the same 
    // teacher slot could be double-booked indefinitely. We must write to the same subcollection we query.
    //
    // Fix 4 (Async/Await): The original write was not awaited (and the callback was not async).
    // Why it matters: Cloud Functions terminate once a result is returned. If the write isn't awaited, 
    // the function might shut down before Firestore finishes saving the document, leading to data loss.
    await teacherRef.collection("bookings").add(booking);

    return {
      success: true,
    };
  }
);