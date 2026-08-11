"use client";

import { useState, type FormEvent } from "react";
import { CalendarClock, Check, LoaderCircle, X } from "lucide-react";
import { requestReschedule } from "@/lib/firebaseFunctionStub";
import {
  formatLocalDisplay,
  getMinLocalDatetime,
  isSlotWithinTwoHours,
  localDateTimeToUtcIso,
} from "@/lib/timeUtils";
import type { RescheduleReason, Session } from "@/types/session";

interface RescheduleModalProps {
  session: Session;
  onClose: () => void;
  onSuccess: (sessionId: string) => void;
}

const reasons: RescheduleReason[] = ["Conflict", "Illness", "Time zone", "Other"];

export default function RescheduleModal({ session, onClose, onSuccess }: RescheduleModalProps) {
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [reason, setReason] = useState<RescheduleReason>("Conflict");
  const [minLocalTime] = useState(getMinLocalDatetime);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const minDate = minLocalTime.slice(0, 10);
  const minTime = newDate === minDate ? minLocalTime.slice(11) : undefined;
  const localSelection = newDate && newTime ? `${newDate}T${newTime}` : "";
  const violatesLeadTime = localSelection.length > 0 && isSlotWithinTwoHours(localSelection);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError("");
    if (!localSelection || violatesLeadTime) {
      setError("Please choose a slot at least two hours from now.");
      return;
    }

    setIsSubmitting(true);
    try {
      const newDatetimeUtc = localDateTimeToUtcIso(newDate, newTime);
      const response = await requestReschedule({
        sessionId: session.id,
        currentDatetime: session.datetime,
        newDatetime: newDatetimeUtc,
        reason,
      });
      if (!response.success) {
        setError(response.error ?? "We could not submit this request.");
        return;
      }
      onSuccess(session.id);
      setIsSubmitted(true);
    } catch (submissionError: unknown) {
      setError(submissionError instanceof Error ? submissionError.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="reschedule-title">
      <div className="w-full max-w-lg animate-[modal-in_300ms_ease-out] rounded-3xl border border-white/20 bg-slate-900/85 p-6 text-slate-100 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl sm:p-8">
        {isSubmitted ? (
          <div className="py-7 text-center">
            <div className="mx-auto flex h-14 w-14 animate-pulse items-center justify-center rounded-full bg-emerald-300 text-slate-950"><Check size={30} strokeWidth={3} /></div>
            <h2 id="reschedule-title" className="mt-5 text-2xl font-semibold">Reschedule request sent</h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-300">Your request for {session.subject} has been submitted. This demo updates the session status locally; no appointment has been changed yet.</p>
            <button type="button" onClick={onClose} className="mt-7 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100">Done</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex items-start justify-between gap-4">
              <div><div className="mb-3 inline-flex rounded-xl bg-cyan-400/15 p-2 text-cyan-200"><CalendarClock size={22} /></div><h2 id="reschedule-title" className="text-2xl font-semibold">Reschedule {session.subject}</h2></div>
              <button type="button" onClick={onClose} disabled={isSubmitting} aria-label="Close reschedule dialog" className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"><X size={20} /></button>
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm"><p className="font-semibold text-white">{session.teacherName}</p><p className="mt-2 text-cyan-100">Current time: {formatLocalDisplay(session.datetime)}</p></div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium">New date<input required type="date" value={newDate} min={minDate} onChange={(event) => setNewDate(event.target.value)} className="mt-2 w-full rounded-xl border border-white/15 bg-slate-950/60 px-3 py-3 text-white outline-none transition focus:border-cyan-300" /></label>
              <label className="block text-sm font-medium">New time<input required type="time" value={newTime} min={minTime} onChange={(event) => setNewTime(event.target.value)} className="mt-2 w-full rounded-xl border border-white/15 bg-slate-950/60 px-3 py-3 text-white outline-none transition focus:border-cyan-300" /></label>
            </div>
            <label className="mt-4 block text-sm font-medium">Reason<select value={reason} onChange={(event) => setReason(event.target.value as RescheduleReason)} className="mt-2 w-full rounded-xl border border-white/15 bg-slate-950/60 px-3 py-3 text-white outline-none transition focus:border-cyan-300">{reasons.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
            {violatesLeadTime && <p className="mt-3 text-sm text-amber-300">Please choose a slot at least two hours from now.</p>}
            {error && <p role="alert" className="mt-3 animate-[shake_0.35s_ease-in-out] rounded-xl bg-rose-400/10 px-3 py-2 text-sm text-rose-200">{error}</p>}
            <div className="mt-7 flex justify-end gap-3"><button type="button" onClick={onClose} disabled={isSubmitting} className="rounded-xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10 disabled:opacity-50">Cancel</button><button type="submit" disabled={isSubmitting || !localSelection || violatesLeadTime} className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02] hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50">{isSubmitting && <LoaderCircle className="animate-spin" size={16} />}{isSubmitting ? "Submitting…" : "Submit request"}</button></div>
          </form>
        )}
      </div>
    </div>
  );
}
