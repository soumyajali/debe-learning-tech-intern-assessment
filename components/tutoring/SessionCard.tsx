"use client";

import React from "react";
import { TutoringSession } from "../../types/tutoring";
import { CalendarClock, User } from "lucide-react";

interface SessionCardProps {
  session: TutoringSession;
  onRequestReschedule: (session: TutoringSession) => void;
}

export default function SessionCard({ session, onRequestReschedule }: SessionCardProps) {
  // Convert UTC datetime to local representation for display
  const dateObj = new Date(session.datetime);
  const formattedDate = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(dateObj);
  const formattedTime = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(dateObj);

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4 relative overflow-hidden group">
      
      {/* Top row: Subject & Status */}
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg text-[#172033]">{session.subject}</h3>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
          session.status === "confirmed" ? "bg-[#22A06B]/10 text-[#22A06B]" : 
          session.status === "pending" ? "bg-orange-100 text-orange-700" :
          "bg-[#5B5FEF]/10 text-[#5B5FEF]"
        }`}>
          {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
        </span>
      </div>

      {/* Middle info */}
      <div className="flex flex-col gap-2 text-sm text-[#6B7280]">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-[#7C83FD]" />
          <span>{session.teacherName}</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarClock className="w-4 h-4 text-[#7C83FD]" />
          <span>{formattedDate} &middot; {formattedTime}</span>
        </div>
      </div>

      {/* Action */}
      <div className="mt-2 flex justify-end">
        <button 
          onClick={() => onRequestReschedule(session)}
          className="text-sm font-medium text-[#5B5FEF] hover:text-[#7C83FD] transition-colors py-2 px-4 rounded-lg hover:bg-[#5B5FEF]/5"
        >
          Request Reschedule
        </button>
      </div>

      {/* Subtle hover accent line */}
      <div className="absolute left-0 bottom-0 w-0 h-1 bg-gradient-to-r from-[#5B5FEF] to-[#55C2A5] group-hover:w-full transition-all duration-300" />
    </div>
  );
}
