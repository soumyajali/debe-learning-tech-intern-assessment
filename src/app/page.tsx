import SessionRescheduleWidget from "../components/SessionRescheduleWidget";

export default function AppHostPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <SessionRescheduleWidget />
      </div>
    </main>
  );
}
