export type SessionStatus =
  | "scheduled"
  | "reschedule_requested"
  | "completed"
  | "cancelled";

export type RescheduleReason = "Conflict" | "Illness" | "Time zone" | "Other";

export interface TutoringSession {
  id: string;
  subject: string;
  teacherName: string;
  datetime: string;
  status: SessionStatus;
}

export interface RescheduleRequest {
  sessionId: string;
  newDatetimeUTC: string;
  reason: RescheduleReason;
}

export interface RescheduleResponse {
  success: boolean;
  error?: string;
}
