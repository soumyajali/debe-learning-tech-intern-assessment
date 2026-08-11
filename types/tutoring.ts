export type SessionStatus = "upcoming" | "confirmed" | "pending";

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
  currentDatetime: string;
  requestedDatetime: string;
  reason: RescheduleReason;
}

export interface RescheduleResponse {
  success: boolean;
  error?: string;
}
