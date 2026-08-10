import { Session } from "../types/session";

export const INITIAL_SESSIONS: Session[] = [
  {
    id: "session-1",
    subject: "Mathematics",
    teacherName: "Sarah Johnson",
    datetime: "2026-08-11T15:00:00.000Z",
    status: "Confirmed",
  },
  {
    id: "session-2",
    subject: "Physics",
    teacherName: "Michael Lee",
    datetime: "2026-08-12T17:30:00.000Z",
    status: "Confirmed",
  },
  {
    id: "session-3",
    subject: "Computer Science",
    teacherName: "Emily Davis",
    datetime: "2026-08-14T13:00:00.000Z",
    status: "Confirmed",
  },
];

export const mockSessions = INITIAL_SESSIONS;