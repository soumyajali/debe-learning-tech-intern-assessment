"use client";

import { useState } from "react";
import { mockSessions } from "../lib/mockData";
import { TutoringSession } from "../types/session";
import RescheduleModal from "./RescheduleModal";

export default function SessionRescheduleWidget() {
  const [selectedSession, setSelectedSession] = useState<TutoringSession | null>(null);

  return (
    <section className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Upcoming Sessions
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Your student&apos;s next tutoring sessions
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {mockSessions.map((session) => (
          <article key={session.id} className="rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-slate-900">{session.subject}</p>
                <p className="mt-1 text-sm text-slate-600">with {session.teacherName}</p>
                <p className="mt-3 text-sm text-slate-700">
                  {new Date(session.datetime).toLocaleString()}
                </p>
              </div>

              <div className="flex flex-col items-end gap-3">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
                  {session.status}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedSession(session)}
                  className="rounded-xl border border-sky-600 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
                >
                  Request Reschedule
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <RescheduleModal
        session={selectedSession}
        isOpen={selectedSession !== null}
        onClose={() => setSelectedSession(null)}
      />
    </section>
  );
}
