"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("../components/3d/Scene"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Scene />
      </div>

      <div id="scroll-container" className="relative z-10 pointer-events-none">
        <section className="pointer-events-auto flex h-screen items-center justify-center px-6">
          <div className="w-full max-w-4xl rounded-[2rem] border border-white/20 bg-white/10 p-10 backdrop-blur-xl shadow-2xl shadow-cyan-950/30">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-cyan-300/30 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-cyan-100">
                Intelligence OS
              </span>
              <h1 className="mt-8 text-5xl font-black leading-none tracking-[-0.08em] md:text-7xl">
                Transform learning into momentum.
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
                Adaptive sessions, AI-guided learning maps, and expert coaching for the next generation of builders.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a className="rounded-full bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-slate-950" href="#">
                  Explore programs
                </a>
                <a className="rounded-full border border-white/30 px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-white" href="#">
                  Watch overview
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="pointer-events-auto flex h-screen items-center justify-center px-6">
          <div className="grid w-full max-w-6xl gap-6 md:grid-cols-3">
            <article className="rounded-[2rem] border border-white/20 bg-white/12 p-8 backdrop-blur-xl">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-cyan-100">Skill intelligence</span>
              <h2 className="mt-6 text-3xl font-black tracking-[-0.04em] text-white">Personal learning orbit</h2>
              <p className="mt-6 text-sm leading-7 text-slate-300">
                Turn goals, skill gaps, and sessions into an action plan your team can actually follow.
              </p>
            </article>

            <article className="rounded-[2rem] border border-white/20 bg-white/12 p-8 backdrop-blur-xl">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-cyan-100">Live mentorship</span>
              <h2 className="mt-6 text-3xl font-black tracking-[-0.04em] text-white">Expert accelerator</h2>
              <p className="mt-6 text-sm leading-7 text-slate-300">
                Work through code, product strategy, and technical confidence inside a guided learning path.
              </p>
            </article>

            <article className="rounded-[2rem] border border-white/20 bg-white/12 p-8 backdrop-blur-xl">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-cyan-100">Progress cloud</span>
              <h2 className="mt-6 text-3xl font-black tracking-[-0.04em] text-white">Team momentum</h2>
              <p className="mt-6 text-sm leading-7 text-slate-300">
                See learning velocity, coaching activity, and upcoming outcomes in one connected workspace.
              </p>
            </article>
          </div>
        </section>

        <section className="pointer-events-auto flex h-screen items-center justify-center px-6">
          <div className="w-full max-w-4xl rounded-[2rem] border border-white/20 bg-white/10 p-10 backdrop-blur-xl">
            <div className="flex items-end justify-between gap-8">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.22em] text-cyan-100">Technical specifications</span>
                <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] text-white">Adaptive infrastructure</h2>
              </div>
              <span className="rounded-full border border-emerald-300/40 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-emerald-100">
                Online
              </span>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
                <div className="text-sm font-black uppercase tracking-[0.24em] text-slate-400">Signal model</div>
                <div className="mt-4 text-2xl font-black text-white">Vector intelligence</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
                <div className="text-sm font-black uppercase tracking-[0.24em] text-slate-400">Delivery system</div>
                <div className="mt-4 text-2xl font-black text-white">Scroll engine</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
