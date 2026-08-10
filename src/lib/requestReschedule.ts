import { INITIAL_SESSIONS, mockSessions } from "./mockData";
import { RescheduleRequest, RescheduleResponse } from "../types/session";

export async function requestReschedule(
  request: RescheduleRequest
): Promise<RescheduleResponse> {
  if (!request.sessionId || !request.newDatetimeUTC || !request.reason) {
    return {
      success: false,
      error: "Missing required reschedule information",
    };
  }

  const requestedTime = new Date(request.newDatetimeUTC);

  if (Number.isNaN(requestedTime.getTime())) {
    return {
      success: false,
      error: "Invalid requested UTC datetime",
    };
  }

  const now = new Date();

  if (requestedTime.getTime() <= now.getTime()) {
    return {
      success: false,
      error: "Requested slot cannot be in the past.",
    };
  }

  const target = mockSessions.find((session) => session.id === request.sessionId);

  if (!target) {
    return {
      success: false,
      error: "Unable to find session to reschedule.",
    };
  }

  const existingSlot = new Date(target.datetime);

  if (requestedTime.getTime() === existingSlot.getTime()) {
    return {
      success: false,
      error: "The new reschedule slot is identical to the current session slot.",
    };
  }

  return {
    success: true,
  };
}
