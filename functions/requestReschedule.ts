import { RescheduleRequest, RescheduleResponse } from "../types/tutoring";
import { isAtLeastTwoHoursFromNow, isSameSlot } from "../lib/time";
import { upcomingSessions } from "../lib/mockData";

export async function requestReschedule(
  request: RescheduleRequest
): Promise<RescheduleResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const { sessionId, currentDatetime, requestedDatetime, reason } = request;

  // 1. Session ID exists
  const session = upcomingSessions.find(s => s.id === sessionId);
  if (!session) {
    return { success: false, error: "Session not found." };
  }

  // 2. Requested datetime exists & 3. can be parsed
  if (!requestedDatetime) {
    return { success: false, error: "A valid new date and time must be provided." };
  }

  const requestedDateObj = new Date(requestedDatetime);
  if (isNaN(requestedDateObj.getTime())) {
    return { success: false, error: "Invalid date format." };
  }

  // 4. Requested time is not in the past
  if (requestedDateObj.getTime() <= Date.now()) {
    return { success: false, error: "The requested session time must be in the future." };
  }

  // 5. Requested time is at least 2 hours from now
  // Tutoring requests require at least two hours of lead time.
  // The frontend disables these slots for better UX, while the
  // backend/function validates the same rule because client-side
  // validation cannot be trusted as the final enforcement layer.
  if (!isAtLeastTwoHoursFromNow(requestedDatetime)) {
    return { success: false, error: "This session must be scheduled at least 2 hours from now." };
  }

  // 6. Requested time differs from the current session time
  if (isSameSlot(currentDatetime, requestedDatetime)) {
    return { success: false, error: "The new time must be different from the current session time." };
  }

  // 7. Reason is valid
  const validReasons = ["Conflict", "Illness", "Time zone", "Other"];
  if (!validReasons.includes(reason)) {
    return { success: false, error: "Please select a valid reason." };
  }

  return { success: true };
}
