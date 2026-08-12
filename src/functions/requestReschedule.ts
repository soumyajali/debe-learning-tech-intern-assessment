import { mockSessions } from "../lib/mockData";
import { RescheduleReason, RescheduleRequest, RescheduleResponse } from "../types/session";

// This local Cloud Function-shaped API mirrors a Firebase callable function.
// In a real system it would be deployed to Firebase Functions, but the
// assessment calls for a local mock/stub only.
export async function requestReschedule(
  request: RescheduleRequest
): Promise<RescheduleResponse> {
  if (!request.sessionId) {
    return {
      success: false,
      error: "A session is required for the reschedule request.",
    };
  }

  if (!request.newDatetimeUtc) {
    return {
      success: false,
      error: "A proposed session date/time is required.",
    };
  }

  if (!isValidReason(request.reason)) {
    return {
      success: false,
      error: "The reschedule reason is invalid.",
    };
  }

  const requestedDate = new Date(request.newDatetimeUtc);

  if (Number.isNaN(requestedDate.getTime())) {
    return {
      success: false,
      error: "The proposed session time is not a valid date/time.",
    };
  }

  const now = new Date();

  // Business rule:
  // Parents must request a new tutoring slot at least 2 hours
  // from the current moment. The UI prevents obviously invalid
  // selections, while the Cloud Function validates again so the
  // rule cannot be bypassed by directly calling the function.
  const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  if (requestedDate.getTime() < twoHoursFromNow.getTime()) {
    return {
      success: false,
      error: "The new session time must be at least 2 hours from now.",
    };
  }

  if (requestedDate.getTime() <= now.getTime()) {
    return {
      success: false,
      error: "The new session time must be in the future.",
    };
  }

  const session = mockSessions.find((candidate) => candidate.id === request.sessionId);

  if (!session) {
    return {
      success: false,
      error: "The requested session could not be found.",
    };
  }

  const existingSlot = new Date(session.datetime);

  if (requestedDate.getTime() === existingSlot.getTime()) {
    return {
      success: false,
      error: "The new session time must be different from the current session time.",
    };
  }

  return {
    success: true,
  };
}

function isValidReason(value: string): value is RescheduleReason {
  return ["Conflict", "Illness", "Time zone", "Other"].includes(value);
}
