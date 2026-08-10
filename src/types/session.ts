export type SessionStatus = "Confirmed" | "Reschedule Requested" | "Completed" | "Cancelled";

export type RescheduleReason = "Conflict" | "Illness" | "Time zone" | "Other";

export interface Session {
  id: string;
  subject: string;
  teacherName: string;
  datetime: string;
  status: SessionStatus;
}

export interface RescheduleRequest {
  sessionId: string;
  newDatetimeUtc: string;
  reason: RescheduleReason;
}

export interface RescheduleResponse {
  success: boolean;
  error?: string;
}
