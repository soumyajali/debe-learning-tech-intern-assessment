import React from "react";
import UpcomingSessions from "../../../components/tutoring/UpcomingSessions";

export default function SessionsPage() {
  return (
    <main className="min-h-screen bg-[#F5F7FF] text-[#172033] p-6 lg:p-12 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row gap-12">
        
        {/* Left/Top Content: Title & Widget */}
        <div className="flex-1">
          <header className="mb-10">
            <h1 className="text-3xl font-bold text-[#172033] mb-2">Debe&apos;s Portal</h1>
            <h2 className="text-xl font-medium text-[#5B5FEF] mb-1">Your student&apos;s upcoming sessions</h2>
            <p className="text-[#6B7280]">Keep track of what&apos;s coming next.</p>
          </header>
          
          <UpcomingSessions />
        </div>

        {/* Right/Bottom Content: 3D Scene */}
        <div className="flex-1 relative min-h-[400px] lg:min-h-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#5B5FEF]/5 to-[#55C2A5]/10 border border-white/50 shadow-inner">
          <div className="absolute inset-0 flex items-center justify-center text-[#5B5FEF]/50">
            {/* 3D Scene will go here */}
            <p>3D Scene Space</p>
          </div>
        </div>

      </div>
    </main>
  );
}
