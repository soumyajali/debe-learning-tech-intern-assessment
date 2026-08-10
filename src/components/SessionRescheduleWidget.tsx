"use client";

import { useState } from "react";
import { mockSessions } from "../lib/mockData";
import { requestReschedule } from "../functions/requestReschedule";
import { RescheduleReason, Session } from "../types/session";
import { formatUtcForLocalDisplay } from "../utils/datetime";
import RescheduleModal from "./RescheduleModal";

export default function SessionRescheduleWidget() {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleRescheduleSubmit = async (
    newDatetimeUtc: string,
    reason: RescheduleReason
  ): Promise<void> => {
    if (!selectedSession) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await requestReschedule({
        sessionId: selectedSession.id,
        newDatetimeUtc,
        reason,
      });

      if (!response.success) {
        setErrorMessage(response.error ?? "Unable to request reschedule");
        return;
      }

      setSuccessMessage(`Request submitted for ${selectedSession.subject}.`);
      setSelectedSession(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Upcoming Sessions
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Your student&apos;s next tutoring sessions
          </p>
        </div>
        <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-sky-800">
          Parent Portal
        </span>
      </div>

      <div className="space-y-4">
        {mockSessions.slice(0, 3).map((session) => (
          <article key={session.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-sky-300 hover:shadow-md">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-slate-900">{session.subject}</p>
                <p className="mt-1 text-sm text-slate-600">with {session.teacherName}</p>
                <div className="mt-3 space-y-1 text-sm text-slate-700">
                  <p>
                    <span className="font-semibold">Date:</span>{" "}
                    {formatUtcForLocalDisplay(session.datetime)}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    {session.status}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
                  {session.status}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedSession(session)}
                  className="rounded-xl border border-sky-600 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-50 hover:text-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-300"
                >
                  Request Reschedule
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {successMessage && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {errorMessage}
        </div>
      )}

      <RescheduleModal
        session={selectedSession}
        isOpen={selectedSession !== null}
        onClose={() => {
          setSelectedSession(null);
          setErrorMessage(null);
        }}
        onSubmit={handleRescheduleSubmit}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage ?? undefined}
      />
    </section>
  );
}
