import SessionRescheduleWidget from "../src/components/SessionRescheduleWidget";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <SessionRescheduleWidget />
      </div>
    </main>
  );
}
