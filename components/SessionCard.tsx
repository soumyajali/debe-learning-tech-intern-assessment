import { Session } from "../types/session";

interface SessionCardProps {
  session: Session;
}

export default function SessionCard({ session }: SessionCardProps) {
  // The source datetime is a UTC ISO string; browser-local timezone is applied when converting for display.
  const localDateTime = new Date(session.datetime).toLocaleString();

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{session.subject}</h3>
          <p className="mt-1 text-sm text-slate-600">with {session.teacherName}</p>
          <p className="mt-4 text-sm text-slate-700">{localDateTime}</p>
        </div>

        <div className="flex flex-col items-end gap-3">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            {session.status}
          </span>
          <button
            type="button"
            disabled
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-500 opacity-75"
          >
            Request Reschedule
          </button>
        </div>
      </div>
    </article>
  );
}
