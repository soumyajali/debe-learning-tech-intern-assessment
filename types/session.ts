export type SessionStatus =
  | "confirmed"
  | "pending"
  | "cancelled"
  | "scheduled"
  | "reschedule_requested"
  | "completed";

export interface Session {
  id: string;
  subject: string;
  teacherName: string;
  datetime: string;
  status: SessionStatus;
}

export interface TutoringSession extends Session {}

export type RescheduleReason = "Conflict" | "Illness" | "Time zone" | "Other";

export interface RescheduleRequest {
  sessionId: string;
  newDatetimeUTC: string;
  reason: RescheduleReason;
}

export interface RescheduleResponse {
  success: boolean;
  error?: string;
}