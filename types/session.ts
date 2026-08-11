/** A tutoring appointment; datetime is always a UTC ISO-8601 string. */
export interface Session {
  id: string;
  subject: string;
  teacherName: string;
  datetime: string;
  status: "Scheduled" | "Reschedule Pending" | "Completed" | "Cancelled";
}

export type RescheduleReason = "Conflict" | "Illness" | "Time zone" | "Other";

export interface ReschedulePayload {
  sessionId: string;
  currentDatetime: string;
  newDatetime: string;
  reason: RescheduleReason;
}

export interface RescheduleResponse {
  success: boolean;
  error?: string;
}
