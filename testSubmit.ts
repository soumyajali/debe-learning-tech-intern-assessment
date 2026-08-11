import { requestReschedule } from "./functions/requestReschedule";

async function run() {
  const res = await requestReschedule({
    sessionId: "session-001",
    currentDatetime: "2026-08-18T10:30:00.000Z",
    requestedDatetime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    reason: "Conflict"
  });
  console.log(res);
}

run();
