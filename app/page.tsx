import Scene from "../components/Scene";
import SessionRescheduleWidget from "../src/components/SessionRescheduleWidget";

export default function Home() {
  return (
    <>
      <Scene />
      <main id="main-scroll-container" className="relative min-h-[300vh] text-slate-900">
        {/* Section 1: Hero */}
        <section className="flex h-screen flex-col items-center justify-center text-center px-4">
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-blue-600 drop-shadow-sm mb-6">
            Welcome to Debe Learning
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-2xl font-medium">
            Scroll down to explore this bright, interactive school-themed experience.
          </p>
        </section>

        {/* Section 2: Features */}
        <section className="flex h-screen flex-col items-start justify-center px-10 md:px-32">
          <div className="rounded-2xl bg-white/60 p-8 backdrop-blur-xl border border-white/40 shadow-xl max-w-xl">
            <h2 className="text-4xl font-bold mb-4 text-amber-500">
              Interactive Learning
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed font-medium">
              Notice how the classic school supplies float and rotate as you scroll.
              The environment uses a warm, welcoming light palette.
            </p>
          </div>
        </section>

        {/* Section 3: Assessment Widget */}
        <section className="flex min-h-screen flex-col items-center justify-center px-4 pb-20">
          <div className="w-full max-w-5xl rounded-3xl bg-white/70 p-8 backdrop-blur-2xl border border-slate-200/50 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
            <h2 className="text-3xl font-bold mb-8 text-center text-slate-800">
              Session Reschedule Assessment
            </h2>
            <SessionRescheduleWidget />
          </div>
        </section>
      </main>
    </>
  );
}
