import { Session } from "../types/session";

// Store these values as UTC ISO strings so the browser can convert them into the user's local timezone when rendering.
export const upcomingSessions: Session[] = [
  {
    id: "session-001",
    subject: "Mathematics",
    teacherName: "Sarah Johnson",
    datetime: "2026-08-12T13:30:00.000Z",
    status: "Scheduled",
  },
  {
    id: "session-002",
    subject: "Physics",
    teacherName: "David Wilson",
    datetime: "2026-08-14T11:30:00.000Z",
    status: "Scheduled",
  },
  {
    id: "session-003",
    subject: "Computer Science",
    teacherName: "Emily Carter",
    datetime: "2026-08-16T14:00:00.000Z",
    status: "Scheduled",
  },
];
