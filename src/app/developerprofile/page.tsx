'use client';

import { useRouter } from "next/navigation";
import { Terminal, ShieldAlert, Sparkles, Heart, Cpu, Paintbrush, Code2, CloudSun, User } from "lucide-react";

type DeveloperProfileProps = {
  developerName?: string;
  assistantName?: string;
  onClose: () => void;
};

export default function DeveloperProfile({ 
  developerName = "Enrico Louis G. Cancino", // Defaults to your name
  assistantName = "Gemini AI",      // Your AI design assistant
  onClose 
}: DeveloperProfileProps) {
  const router = useRouter();
  
  const stats = [
    { label: "Environment", value: "Next.js 14 / Tailwind CSS" },
    { label: "Access Level", value: "Root Superadmin" },
    { label: "Ecosystem Hub", value: "Sarai Console v2.0" },
    { label: "Bugs Squashed", value: "404" }
  ];

  return (
    <div 
      className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 py-12"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      {/* Background ambient glowing effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl w-full relative z-10 space-y-6">
        
        {/* Header Ribbon */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              try {
                router.push('/');
              } catch {
                if (typeof window !== 'undefined') window.history.back();
              }
            }}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors group"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            Return
          </button>
          
          <div className="flex items-center gap-1.5 rounded-full bg-blue-950/50 border border-blue-500/20 px-3 py-1 text-[10px] font-mono text-blue-400 tracking-wider uppercase">
            <ShieldAlert size={12} className="animate-pulse" /> NICE, YOU FOUND AN EASTER EGG!
          </div>
        </div>

        {/* Main Interface Console */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md overflow-hidden shadow-2xl">
          
          {/* Terminal Window Header */}
          <div className="border-b border-slate-800 bg-slate-900 px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal size={15} className="text-emerald-400" />
              <span className="font-mono text-xs text-slate-400">system_credits.sh</span>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            {/* Holographic Intro */}
            <div className="text-center space-y-2">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
                <Sparkles size={24} className="animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <h1 className="text-xl font-extrabold tracking-tight text-white md:text-2xl">System Architects</h1>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                "Jesus Christ helped me build this console, and I give Him all the glory for it. he gave me strength, wisdom, and guidance to create this system for the DOST SARAI Ecosystem."
              </p>
            </div>

            {/* Slideable Creators Carousel */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Swipe or Scroll to view crew &rarr;</span>
              </div>
              
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-track-slate-950 scrollbar-thumb-slate-800 snap-x snap-mandatory">
                
                {/* Card 1: Lead Architect (You) */}
                <div className="snap-center shrink-0 w-72 group relative rounded-xl border border-slate-800 bg-slate-950/60 p-5 transition-all hover:border-slate-700 hover:bg-slate-950/90 flex flex-col justify-between">
                  <div className="absolute top-3 right-3 text-emerald-400/50 group-hover:text-emerald-400 transition-colors">
                    <Cpu size={16} />
                  </div>
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                      Lead Architect
                    </span>
                    <div>
                      <h3 className="font-bold text-white text-base">{developerName}</h3>
                      <p className="text-xs text-slate-400">Full-Stack System Engineering</p>
                    </div>
                    <p className="text-[11px] text-slate-500 italic border-t border-slate-800/80 pt-3">
                      Crafted permissions, layout state logic, and administrative ecosystem schemas.
                    </p>
                  </div>
                </div>

                {/* Card 2: UI Design Assistant (Gemini AI) */}
                <div className="snap-center shrink-0 w-72 group relative rounded-xl border border-slate-800 bg-slate-950/60 p-5 transition-all hover:border-slate-700 hover:bg-slate-950/90 flex flex-col justify-between">
                  <div className="absolute top-3 right-3 text-amber-500/50 group-hover:text-amber-500 transition-colors">
                    <Paintbrush size={16} />
                  </div>
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-500">
                      Design Collaborator
                    </span>
                    <div>
                      <h3 className="font-bold text-white text-base">{assistantName}</h3>
                      <p className="text-xs text-slate-400">UI / UX Design Assistant</p>
                    </div>
                    <p className="text-[11px] text-slate-500 italic border-t border-slate-800/80 pt-3">
                      Polished spacing systems, custom console layouts, and dynamic aesthetic assets.
                    </p>
                  </div>
                </div>

                {/* Card 3: Code Copilot (GitHub Copilot) */}
                <div className="snap-center shrink-0 w-72 group relative rounded-xl border border-slate-800 bg-slate-950/60 p-5 transition-all hover:border-slate-700 hover:bg-slate-950/90 flex flex-col justify-between">
                  <div className="absolute top-3 right-3 text-sky-400/50 group-hover:text-sky-400 transition-colors">
                    <Code2 size={16} />
                  </div>
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-400">
                      AI Copilot
                    </span>
                    <div>
                      <h3 className="font-bold text-white text-base">GitHub Copilot</h3>
                      <p className="text-xs text-slate-400">Code Autocompletion & Logic</p>
                    </div>
                    <p className="text-[11px] text-slate-500 italic border-t border-slate-800/80 pt-3">
                      Provided syntax streamlining, repetitive pattern generation, and code scaffolding.
                    </p>
                  </div>
                </div>

                {/* Card 4: Graphic Design Assistant */}
                <div className="snap-center shrink-0 w-72 group relative rounded-xl border border-slate-800 bg-slate-950/60 p-5 transition-all hover:border-slate-700 hover:bg-slate-950/90 flex flex-col justify-between">
                  <div className="absolute top-3 right-3 text-purple-400/50 group-hover:text-purple-400 transition-colors">
                    <User size={16} />
                  </div>
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400">
                      Graphic Assistant
                    </span>
                    <div>
                      <h3 className="font-bold text-white text-base">Lyka B. Galvez</h3>
                      <p className="text-xs text-slate-400">Visual Assets & Branding</p>
                    </div>
                    <p className="text-[11px] text-slate-500 italic border-t border-slate-800/80 pt-3">
                      Rendered high-fidelity custom visual components and aligned systemic branding guides.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Diagnostic Console Stats */}
            <div className="rounded-xl bg-slate-950 p-4 border border-slate-800/60">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="space-y-1">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">
                      {stat.label}
                    </span>
                    <span className="text-xs font-semibold text-slate-200 font-mono">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dedication Banner: All for the glory of God */}
            <div className="relative overflow-hidden rounded-xl border border-emerald-500/20 bg-linear-to-r from-emerald-950/30 via-slate-950 to-emerald-950/30 p-4 text-center">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center gap-1">
                <CloudSun size={18} className="text-emerald-400/80 mb-1" />
                <span className="text-xs font-semibold tracking-widest text-emerald-400 uppercase font-mono">
                  Soli Deo Gloria
                </span>
                <p className="text-sm font-bold text-slate-100 tracking-wide">
                  "All for the glory of God"
                </p>
              </div>
            </div>

            {/* Footer Heart Note */}
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-mono">
              Made for the DOST SARAI Ecosystem.
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}