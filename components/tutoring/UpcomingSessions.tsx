"use client";

import React, { useState } from "react";
import { upcomingSessions } from "../../lib/mockData";
import { TutoringSession } from "../../types/tutoring";
import SessionCard from "./SessionCard";

export default function UpcomingSessions() {
  const [sessions, setSessions] = useState<TutoringSession[]>(upcomingSessions);
  const [selectedSession, setSelectedSession] = useState<TutoringSession | null>(null);

  const handleRequestReschedule = (session: TutoringSession) => {
    setSelectedSession(session);
    // Modal state would be managed here or via a context/portal
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 p-6 min-h-[400px]">
      <div className="flex flex-col gap-4">
        {sessions.map((session) => (
          <SessionCard 
            key={session.id} 
            session={session} 
            onRequestReschedule={handleRequestReschedule} 
          />
        ))}
      </div>
      
      {/* 
        This is a placeholder for the modal. We will replace this 
        with the actual RescheduleModal component later in the plan.
      */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-xl">
            <p>Modal Placeholder for {selectedSession.subject}</p>
            <button onClick={() => setSelectedSession(null)} className="mt-4 px-4 py-2 bg-gray-100 rounded">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
