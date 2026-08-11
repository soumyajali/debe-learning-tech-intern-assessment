"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { ArrowUpRight, CalendarDays, Clock3, GraduationCap } from "lucide-react";
import RescheduleModal from "@/components/RescheduleModal";
import { formatLocalDisplay } from "@/lib/timeUtils";
import type { Session } from "@/types/session";

const Scene = dynamic(() => import("@/components/3d/Scene"), { ssr: false });

const initialSessions: Session[] = [
  { id: "session-physics", subject: "Physics · Mechanics", teacherName: "Dr. Maya Patel", datetime: "2026-08-13T10:00:00.000Z", status: "Scheduled" },
  { id: "session-math", subject: "Mathematics · Calculus", teacherName: "Alex Morgan", datetime: "2026-08-15T14:30:00.000Z", status: "Scheduled" },
  { id: "session-writing", subject: "English · Essay workshop", teacherName: "Sofia Chen", datetime: "2026-08-18T09:00:00.000Z", status: "Scheduled" },
];

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  function handleSuccess(sessionId: string): void {
    setSessions((current) => current.map((session) => session.id === sessionId ? { ...session, status: "Reschedule Pending" } : session));
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07131f] px-4 py-10 text-white sm:px-6 lg:px-8">
      <Scene modalOpen={selectedSession !== null} />
      <div className="relative z-10 mx-auto max-w-5xl">
        <header className="flex flex-col justify-between gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-end">
          <div><div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-200/10 px-3 py-1 text-xs font-semibold tracking-wide text-cyan-100"><GraduationCap size={15} /> PARENT PORTAL</div><h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Your learning schedule</h1><p className="mt-3 max-w-xl text-slate-300">Review upcoming sessions and request a time that works better for your family.</p></div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-slate-200 backdrop-blur-md"><span className="text-cyan-200">3</span> upcoming sessions</div>
        </header>

        <section aria-label="Upcoming tutoring sessions" className="mt-8 grid gap-4 lg:grid-cols-3">
          {sessions.map((session, index) => <article key={session.id} className="group rounded-3xl border border-white/15 bg-slate-900/50 p-5 shadow-xl shadow-slate-950/20 backdrop-blur-xl transition hover:border-cyan-200/40 sm:p-6"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-4"><div className="rounded-2xl bg-cyan-300/15 p-3 text-cyan-200"><CalendarDays size={22} /></div><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200/80">Session 0{index + 1}</p><h2 className="mt-1 text-xl font-semibold">{session.subject}</h2><p className="mt-1 text-sm text-slate-300">with {session.teacherName}</p><div className="mt-3 flex items-center gap-2 text-sm text-slate-200"><Clock3 size={16} className="text-cyan-200" />{formatLocalDisplay(session.datetime)}</div></div></div><div className="flex items-center gap-3 sm:flex-col sm:items-end"><span className="rounded-full border border-cyan-200/15 bg-cyan-200/10 px-3 py-1 text-xs font-semibold text-cyan-100">{session.status}</span><button type="button" onClick={() => setSelectedSession(session)} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100">Reschedule <ArrowUpRight size={16} /></button></div></div></article>)}
        </section>
      </div>
      {selectedSession && <RescheduleModal key={selectedSession.id} session={selectedSession} onClose={() => setSelectedSession(null)} onSuccess={handleSuccess} />}
    </main>
  );
}
