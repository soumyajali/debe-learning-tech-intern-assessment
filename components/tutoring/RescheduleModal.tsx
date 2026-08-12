"use client";

import React, { useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TutoringSession, RescheduleReason } from "../../types/tutoring";
import { requestReschedule } from "../../functions/requestReschedule";
import { getBrowserTimeZone } from "../../lib/time";
import DateTimePicker from "./DateTimePicker";
import { AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";

interface RescheduleModalProps {
  session: TutoringSession | null;
  onClose: () => void;
  onSuccess: (session: TutoringSession) => void;
}

function subscribeToTimeZone() {
  return () => undefined;
}

function getTimeZoneSnapshot() {
  return getBrowserTimeZone();
}

export default function RescheduleModal({ session, onClose, onSuccess }: RescheduleModalProps) {
  const [requestedDatetime, setRequestedDatetime] = useState<string>("");
  const [reason, setReason] = useState<RescheduleReason | "">("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const localTimeZone = useSyncExternalStore(subscribeToTimeZone, getTimeZoneSnapshot, () => "");

  const handleSubmit = async () => {
    if (!session) return;
    if (!requestedDatetime) {
      setError("Please select a new date and time.");
      return;
    }
    if (!reason) {
      setError("Please select a reason.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await requestReschedule({
        sessionId: session.id,
        currentDatetime: session.datetime,
        requestedDatetime,
        reason: reason as RescheduleReason,
      });

      if (response.success) {
        setSuccess(true);
      } else {
        setError(response.error || "An unknown error occurred.");
      }
    } catch (err: unknown) {
      console.error(err);
      setError("Something went wrong while submitting your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formattedCurrentDate = session
    ? new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        month: "long",
        day: "numeric",
      }).format(new Date(session.datetime))
    : "";

  const formattedCurrentTime = session
    ? new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date(session.datetime))
    : "";

  const formattedNewDate = requestedDatetime
    ? new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        month: "long",
        day: "numeric",
      }).format(new Date(requestedDatetime))
    : "";

  const formattedNewTime = requestedDatetime
    ? new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date(requestedDatetime))
    : "";

  return (
    <AnimatePresence>
      {session && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#172033]/40 backdrop-blur-sm"
            onClick={loading ? undefined : onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-full"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-[#172033]">Request a reschedule</h2>
              <button
                onClick={onClose}
                disabled={loading}
                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center text-center py-6"
                >
                  <div className="w-16 h-16 bg-[#22A06B]/10 text-[#22A06B] rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#172033] mb-2">Reschedule request sent</h3>
                  <p className="text-[#6B7280] mb-6">
                    Your request for <span className="font-medium text-[#172033]">{session.subject}</span> with{" "}
                    <span className="font-medium text-[#172033]">{session.teacherName}</span> has been submitted.
                  </p>
                  
                  <div className="bg-gray-50 rounded-xl p-4 w-full text-left mb-6 border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Requested Time</p>
                    <p className="text-[#172033] font-medium">{formattedNewDate} &middot; {formattedNewTime}</p>
                    <p className="text-xs text-gray-500 mt-1">Local time &middot; {localTimeZone}</p>
                  </div>

                  <button
                    onClick={() => onSuccess(session)}
                    className="w-full bg-[#5B5FEF] text-white py-2.5 rounded-lg font-medium hover:bg-[#4a4ed1] transition-colors"
                  >
                    Done
                  </button>
                </motion.div>
              ) : (
                <div className="flex flex-col gap-6">
                  {/* Current Session Info */}
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-medium text-[#172033]">
                      {session.subject} <span className="text-gray-400 font-normal">with {session.teacherName}</span>
                    </h3>
                    <div className="text-sm text-[#6B7280] bg-gray-50 p-3 rounded-lg border border-gray-100 mt-2">
                      <span className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Current</span>
                      {formattedCurrentDate}
                      <br />
                      {formattedCurrentTime} local time
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  {/* Date/Time Picker */}
                  <DateTimePicker
                    onDateTimeSelect={setRequestedDatetime}
                    disabled={loading}
                  />

                  {/* Reason */}
                  <div>
                    <label className="block text-sm font-medium text-[#172033] mb-1">
                      Reason
                    </label>
                    <select
                      value={reason}
                      onChange={(e) => setReason(e.target.value as RescheduleReason)}
                      disabled={loading}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B5FEF] text-[#172033] bg-white disabled:opacity-50"
                    >
                      <option value="" disabled>Select a reason...</option>
                      <option value="Conflict">Conflict</option>
                      <option value="Illness">Illness</option>
                      <option value="Time zone">Time zone</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Notice */}
                  <div className="text-xs text-gray-500 text-center flex flex-col gap-1">
                    <span>Times are shown in your local timezone ({localTimeZone}).</span>
                    <span>The submitted time is stored securely in UTC.</span>
                  </div>

                  {/* Error State */}
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: "auto" }}
                      className="bg-[#D64545]/10 border border-[#D64545]/20 text-[#D64545] p-3 rounded-lg flex items-start gap-2 text-sm"
                    >
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <p>{error}</p>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {!success && (
              <div className="p-6 border-t border-gray-100 flex gap-3 justify-end bg-gray-50/50">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-5 py-2 rounded-lg font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || !requestedDatetime || !reason}
                  className="px-5 py-2 rounded-lg font-medium bg-[#5B5FEF] text-white hover:bg-[#4a4ed1] transition-colors disabled:opacity-50 disabled:bg-[#5B5FEF]/50 flex items-center justify-center min-w-[140px]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Requesting...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
