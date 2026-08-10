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

  return {
    success: true,
  };
}
