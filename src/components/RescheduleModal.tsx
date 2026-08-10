'use client';

import React, { useState } from 'react';
import { TutoringSession, RescheduleReason } from '@/types/session';

interface RescheduleModalProps {
  session?: TutoringSession | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (newDatetimeUTC: string, reason: RescheduleReason) => Promise<void>;
  isSubmitting?: boolean;
  errorMessage?: string;
}

const REASONS: RescheduleReason[] = ['Conflict', 'Illness', 'Time zone', 'Other'];
const MIN_LEAD_HOURS = 2;

/**
 * Formats a Date into a string compatible with `<input type="datetime-local" />` (YYYY-MM-DDTHH:mm).
 * Computes min date in local time representing Current Time + 2 Hours.
 */
function getMinLocalDatetimeString(): string {
  const minDate = new Date(Date.now() + MIN_LEAD_HOURS * 60 * 60 * 1000);
  const pad = (num: number) => String(num).padStart(2, '0');

  const year = minDate.getFullYear();
  const month = pad(minDate.getMonth() + 1);
  const day = pad(minDate.getDate());
  const hours = pad(minDate.getHours());
  const minutes = pad(minDate.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function RescheduleModal({
  session,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  errorMessage,
}: RescheduleModalProps) {
  const minLocalTimeStr = getMinLocalDatetimeString();
  const [localDatetime, setLocalDatetime] = useState<string>(minLocalTimeStr);
  const [reason, setReason] = useState<RescheduleReason>('Conflict');
  const [clientError, setClientError] = useState<string | null>(null);

  if (!isOpen || !session) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientError(null);

    if (!localDatetime) {
      setClientError('Please select a valid date and time.');
      return;
    }

    /*
     * TIME ZONE & LEAD-TIME REASONING:
     * 1. `<input type="datetime-local" />` returns string without time zone context (e.g. "2026-08-12T14:30").
     * 2. `new Date(localDatetime)` interprets this value using the parent's browser local time zone.
     * 3. We re-validate the 2-hour constraint in the client before attempting backend calls.
     * 4. `selectedDate.toISOString()` converts local time to standardized ISO UTC format (e.g. "2026-08-12T18:30:00.000Z").
     */
    const selectedDate = new Date(localDatetime);
    const now = new Date();
    const minLeadMs = MIN_LEAD_HOURS * 60 * 60 * 1000;

    if (selectedDate.getTime() - now.getTime() < minLeadMs) {
      setClientError(`Reschedule requests require at least ${MIN_LEAD_HOURS} hours advance notice.`);
      return;
    }

    const utcIsoString = selectedDate.toISOString();

    if (onSubmit) {
      await onSubmit(utcIsoString, reason);
    }
  };

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
        <h3 className="text-lg font-bold text-slate-900">Request Reschedule</h3>
        <p className="mt-1 text-xs text-slate-500">
          Rescheduling session for <span className="font-semibold text-slate-700">{session.subject}</span> with{' '}
          {session.teacherName}.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold tracking-wider text-slate-700 uppercase">
              New Date & Time ({userTimeZone})
            </label>
            <input
              type="datetime-local"
              min={minLocalTimeStr}
              value={localDatetime}
              onChange={(e) => setLocalDatetime(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 p-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Policy constraint: Slots within 2 hours of current time are disabled.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wider text-slate-700 uppercase">
              Reason for Reschedule
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as RescheduleReason)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 p-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {(clientError || errorMessage) && (
            <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-700 border border-red-200">
              {clientError || errorMessage}
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
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
              {isSubmitting ? 'Submitting...' : 'Confirm Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}