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
// Fix: The original callback was not async, so it could not await
// Firestore operations. Returning before those operations complete
// can produce incorrect success responses.
export const bookSession = functions.https.onCall(
  async (data: BookingRequest, context) => {
    // Fix: The original function did not verify authentication.
    // Without this check, an unauthenticated client could submit a
    // studentId and potentially create a booking on behalf of another user.
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Authentication is required."
      );
    }

    // Fix: The original function used await inside a non-async callback.
    // The callable handler must be async so asynchronous Firestore
    // operations can be awaited before the function returns.
    
    const booking = {
      studentId: data.studentId,
      teacherId: data.teacherId,
      slot: data.slot,
      subject: data.subject,
      status: "confirmed",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const teacherRef = db.collection("teachers").doc(data.teacherId);

    // Fix: Firestore get() returns a Promise. The original code tried
    // to access existing.docs before the query had completed, so the
    // slot availability check could not work correctly.
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

    // Fix: The original write was not awaited. The function could return
    // success before Firestore had finished saving the booking, causing
    // clients to receive a false success response if the write failed.
    await db.collection("bookings").add(booking);

    return {
      success: true,
    };
  }
);