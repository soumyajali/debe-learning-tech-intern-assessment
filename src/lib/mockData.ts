import { TutoringSession } from "../types/session";

export const INITIAL_SESSIONS: TutoringSession[] = [
  {
    id: "sess-101",
    subject: "AP Physics C",
    teacherName: "Dr. Aris Thorne",
    datetime: "2026-08-11T16:00:00.000Z",
    status: "scheduled",
  },
  {
    id: "sess-102",
    subject: "Linear Algebra",
    teacherName: "Prof. Maya Lin",
    datetime: "2026-08-12T18:30:00.000Z",
    status: "scheduled",
  },
  {
    id: "sess-103",
    subject: "Organic Chemistry",
    teacherName: "Elena Rostova",
    datetime: "2026-08-14T14:00:00.000Z",
    status: "scheduled",
  },
];

export const mockSessions = INITIAL_SESSIONS;