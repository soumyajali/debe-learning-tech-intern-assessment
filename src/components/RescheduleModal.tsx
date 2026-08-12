"use client";

import React, { useEffect, useState } from "react";
import { RescheduleReason, Session } from "../types/session";
import { combineLocalDateAndTime, formatDateInputValue, formatTimeInputValue } from "../utils/datetime";

interface RescheduleModalProps {
  session?: Session | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (newDatetimeUtc: string, reason: RescheduleReason) => Promise<void>;
  isSubmitting?: boolean;
  errorMessage?: string;
}

const REASONS: RescheduleReason[] = ["Conflict", "Illness", "Time zone", "Other"];
const MIN_LEAD_HOURS = 2;

export default function RescheduleModal({
  session,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  errorMessage,
}: RescheduleModalProps) {
  const [newDate, setNewDate] = useState<string>("");
  const [newTime, setNewTime] = useState<string>("");
  const [reason, setReason] = useState<RescheduleReason>("Conflict");
  const [clientError, setClientError] = useState<string | null>(null);
  const [successState, setSuccessState] = useState(false);
  const [minimumDateTime, setMinimumDateTime] = useState<Date | null>(null);

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  useEffect(() => {
    if (isOpen && session) {
      const timer = window.setTimeout(() => {
        const minimum = new Date(Date.now() + MIN_LEAD_HOURS * 60 * 60 * 1000);
        setMinimumDateTime(minimum);
        setNewDate(formatDateInputValue(minimum));
        setNewTime(formatTimeInputValue(minimum));
        setReason("Conflict");
        setClientError(null);
        setSuccessState(false);
      }, 0);

      return () => window.clearTimeout(timer);
    }
  }, [isOpen, session]);

  if (!isOpen || !session) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setClientError(null);

    if (!newDate || !newTime) {
      setClientError("Please select both a date and a time.");
      return;
    }

    // The date/time input represents the parent's local browser time.
    // We intentionally convert it to an ISO UTC timestamp before sending
    // it to the backend so the backend has one unambiguous representation
    // regardless of the parent's timezone or daylight-saving rules.
    const selectedLocalDate = combineLocalDateAndTime(newDate, newTime);

    if (!selectedLocalDate || Number.isNaN(selectedLocalDate.getTime())) {
      setClientError("Please select a valid local date and time.");
      return;
    }

    const now = new Date();

    // Business rule:
    // Parents must request a new tutoring slot at least 2 hours
    // from the current moment. The UI prevents obviously invalid
    // selections, while the Cloud Function validates again so the
    // rule cannot be bypassed by directly calling the function.
    const minimumAllowed = new Date(now.getTime() + MIN_LEAD_HOURS * 60 * 60 * 1000);

    if (selectedLocalDate.getTime() < minimumAllowed.getTime()) {
      setClientError("The new session time must be at least 2 hours from now.");
      return;
    }

    if (selectedLocalDate.getTime() <= now.getTime()) {
      setClientError("The new session time must be in the future.");
      return;
    }

    if (selectedLocalDate.getTime() === new Date(session.datetime).getTime()) {
      setClientError("The new session time must be different from the current session time.");
      return;
    }

    const utcString = selectedLocalDate.toISOString();

    try {
      if (onSubmit) {
        await onSubmit(utcString, reason);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error";
      setClientError(message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Request Reschedule</h3>
            <p className="mt-1 text-xs text-slate-500">
              Rescheduling session for <span className="font-semibold text-slate-700">{session.subject}</span> with {session.teacherName}.
            </p>
          </div>
          <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
            {session.id}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="reschedule-date" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              New date
            </label>
            <input
              id="reschedule-date"
              name="newDate"
              type="date"
              value={newDate}
              min={minimumDateTime ? formatDateInputValue(minimumDateTime) : undefined}
              onChange={(event) => setNewDate(event.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 p-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="reschedule-time" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              New time ({userTimeZone})
            </label>
            <input
              id="reschedule-time"
              name="newTime"
              type="time"
              value={newTime}
              min={minimumDateTime ? formatTimeInputValue(minimumDateTime) : undefined}
              onChange={(event) => setNewTime(event.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 p-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="reschedule-reason" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Reason
            </label>
            <select
              id="reschedule-reason"
              name="reason"
              value={reason}
              onChange={(event) => setReason(event.target.value as RescheduleReason)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 p-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {REASONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {(clientError || errorMessage) && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
              {clientError || errorMessage}
            </div>
          )}

          {successState && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-700">
              Reschedule request submitted.
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setClientError(null);
                setSuccessState(false);
                onClose();
              }}
              disabled={isSubmitting ?? false}
              className="rounded-lg px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting ?? false}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
