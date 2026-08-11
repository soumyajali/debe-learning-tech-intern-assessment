import type { ReschedulePayload, RescheduleResponse } from "@/types/session";
import { upcomingSessions } from "@/data/sessions";

const TWO_HOURS_IN_MS = 2 * 60 * 60 * 1000;
const allowedReasons = new Set(["Conflict", "Illness", "Time zone", "Other"]);

/** Local stand-in for the protected Firebase callable function used in production. */
export async function requestReschedule(
  payload: ReschedulePayload,
): Promise<RescheduleResponse> {
  await new Promise<void>((resolve) => setTimeout(resolve, 800));

  const requestedTime = new Date(payload.newDatetime).getTime();
  const currentTime = new Date(payload.currentDatetime).getTime();

  if (!upcomingSessions.some((session) => session.id === payload.sessionId)) {
    return { success: false, error: "This session could not be found." };
  }

  if (!allowedReasons.has(payload.reason)) {
    return { success: false, error: "Please choose a valid reason for rescheduling." };
  }

  if (Number.isNaN(requestedTime) || Number.isNaN(currentTime)) {
    return { success: false, error: "The requested time is invalid." };
  }

  if (requestedTime <= Date.now()) {
    return { success: false, error: "Please choose a future time." };
  }

  if (requestedTime === currentTime) {
    return { success: false, error: "Choose a time different from the current session." };
  }

  // Business rule:
  // Parents must request a new tutoring slot at least two hours before the
  // requested session time. The UI prevents invalid selections for a better
  // experience, but the function validates the rule again because frontend
  // validation can be bypassed.
  if (requestedTime < Date.now() + TWO_HOURS_IN_MS) {
    return { success: false, error: "Reschedules require at least two hours' notice." };
  }

  return { success: true };
}
