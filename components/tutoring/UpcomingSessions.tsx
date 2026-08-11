"use client";

import React, { useState } from "react";
import { upcomingSessions } from "../../lib/mockData";
import { TutoringSession } from "../../types/tutoring";
import SessionCard from "./SessionCard";
import RescheduleModal from "./RescheduleModal";

export default function UpcomingSessions() {
  const [sessions, setSessions] = useState<TutoringSession[]>(upcomingSessions);
  const [selectedSession, setSelectedSession] = useState<TutoringSession | null>(null);

  const handleRequestReschedule = (session: TutoringSession) => {
    setSelectedSession(session);
  };

  const handleModalClose = () => {
    setSelectedSession(null);
  };

  const handleModalSuccess = (session: TutoringSession) => {
    // Optimistically update the session status to "pending"
    setSessions(prev => 
      prev.map(s => s.id === session.id ? { ...s, status: "pending" } : s)
    );
    // Modal can stay open to show success state, user will close it via 'Done' button
    // which maps to onClose in the modal or they trigger onSuccess then we close.
    // Actually, in our modal design, the success state is shown INSIDE the modal.
    // The "Done" button calls `onSuccess`, so we close the modal here.
    setSelectedSession(null);
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
      
      <RescheduleModal
        session={selectedSession}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
