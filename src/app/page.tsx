'use client';

import React, { useState, useEffect } from 'react';
import DocTrack from './DocTrack/page';
import TimeTrack from './TimeTrack/page';

export interface DocumentData {
  id: string;
  title: string;
  origin: string;
  status: 'DRAFT' | 'PENDING REVIEW' | 'APPROVED' | 'ARCHIVED';
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'home' | 'dts' | 'ets'>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [pstTime, setPstTime] = useState('00:00:00 AM');
  const [qrId, setQrId] = useState('DOST1-2026-X11');
  const [qrAuthStatus, setQrAuthStatus] = useState(false);

  // Initial Document State shared with tracking nodes
  const [documents, setDocuments] = useState<DocumentData[]>([
    { id: 'DOST1-2026-X11', title: 'Agriculture Telemetry Calibration Checklist', origin: 'PSTC - Ilocos Norte', status: 'PENDING REVIEW' },
    { id: 'DOST1-2026-F42', title: 'Crop Modeling Infographics Guidelines v3', origin: 'R&D Office', status: 'APPROVED' },
    { id: 'DOST1-2026-G09', title: 'Personnel Field Operations Mobilization Log', origin: 'Administration', status: 'ARCHIVED' }
  ]);

  useEffect(() => {
    const updatePstTime = () => {
      const now = new Date();
      setPstTime(now.toLocaleTimeString('en-US', { hour12: true }));
    };
    const timer = setInterval(updatePstTime, 1000);
    updatePstTime();
    return () => clearInterval(timer);
  }, []);

  const triggerScanningFeedback = () => {
    setQrAuthStatus(true);
    setTimeout(() => setQrAuthStatus(false), 1500);
  };

  return (
    <div className="bg-[#0b0f19] text-slate-100 font-sans min-h-screen overflow-x-hidden relative selection:bg-emerald-500 selection:text-white flex flex-col">
      
      {/* BACKGROUND GRADIENTS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-150 h-150 bg-linear-to-tr from-blue-600/30 to-indigo-800/20 rounded-full blur-[140px] animate-[spin_25s_infinite_linear]"></div>
        <div className="absolute top-[20%] -right-40 w-175 h-175 bg-linear-to-br from-emerald-600/20 to-teal-900/30 rounded-full blur-[160px] animate-[spin_30s_infinite_linear]"></div>
        <div className="absolute -bottom-20 left-[20%] w-200 h-150 bg-linear-to-tr from-[#f97316]/15 via-rose-500/10 to-transparent rounded-full blur-[150px] animate-[spin_25s_infinite_linear]"></div>
      </div>

      {/* HEADER */}
      <header className="w-full bg-[#0d1424]/60 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden md:flex p-2 hover:bg-white/5 rounded-lg border border-white/10 text-slate-400 hover:text-white transition-all mr-1" title="Toggle Navigation Panel">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>

            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
              <svg className="w-6 h-6 text-blue-400" viewBox="0 0 100 100" fill="currentColor">
                <circle cx="28" cy="28" r="20" fill="#3b82f6"/>
                <circle cx="72" cy="28" r="20" fill="#10b981"/>
                <circle cx="28" cy="72" r="20" fill="#f59e0b"/>
                <circle cx="72" cy="72" r="20" fill="#ffffff"/>
                <rect x="42" y="42" width="16" height="16" transform="rotate(45 50 50)" fill="#6366f1"/>
              </svg>
              <div className="h-4 w-px bg-white/20 mx-1"></div>
              <svg className="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L15 8L22 9L17 14L18 21L12 17L6 21L7 14L2 9L9 8L12 2Z" fill="currentColor"/>
              </svg>
            </div>

            <div className="h-6 w-px bg-white/10 hidden md:block"></div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-extrabold tracking-widest text-emerald-400">SARAI</span>
                <span className="text-xs font-bold text-white tracking-tight">ILOCOS</span>
              </div>
              <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase hidden sm:block">DOST REGION I PORTAL</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden lg:block border-r border-white/10 pr-4">
              <p className="text-[10px] font-medium text-slate-400 tracking-wider">PHILIPPINE STANDARD TIME</p>
              <p className="text-xs font-mono font-bold text-white tracking-widest mt-0.5">{pstTime}</p>
            </div>
            <div className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full pl-2 pr-3 py-1 cursor-pointer transition-all">
              <div className="w-6 h-6 rounded-full bg-linear-to-tr from-emerald-500 to-blue-600 flex items-center justify-center text-[10px] font-extrabold text-white">AD</div>
              <span className="text-[11px] font-semibold text-slate-300 hidden sm:inline">Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <div className="md:hidden w-full bg-[#0d1424]/90 border-b border-white/5 flex justify-around p-2 z-40 relative">
        <button onClick={() => setActiveTab('home')} className={`text-[11px] font-bold px-3 py-1 rounded ${activeTab === 'home' ? 'text-emerald-400 bg-white/5' : 'text-slate-400'}`}>Home</button>
        <button onClick={() => setActiveTab('dts')} className={`text-[11px] font-bold px-3 py-1 rounded ${activeTab === 'dts' ? 'text-emerald-400 bg-white/5' : 'text-slate-400'}`}>DTS Tracker</button>
        <button onClick={() => setActiveTab('ets')} className={`text-[11px] font-bold px-3 py-1 rounded ${activeTab === 'ets' ? 'text-emerald-400 bg-white/5' : 'text-slate-400'}`}>Personnel ETS</button>
      </div>

      {/* MAIN CONTAINER */}
      <div className="flex flex-1 relative min-h-[calc(100vh-3.5rem)]">
        
        {/* ASIDE SIDEBAR */}
        <aside className={`hidden md:flex shrink-0 ${isSidebarOpen ? 'w-64 border-r border-white/5 bg-[#0d1424]/40' : 'w-0 border-none bg-transparent pointer-events-none'} backdrop-blur-md flex-row sticky top-14 h-[calc(100vh-3.5rem)] z-30 transition-all duration-300 overflow-hidden`}>

          {isSidebarOpen && (
            <div className="flex-1 flex flex-col justify-between p-4 transition-all duration-300">
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">Current Workspace</p>
                  <h3 className="text-xs font-bold text-white mt-1">Ilocos Operations Hub</h3>
                </div>

                <div className="space-y-1.5">
                  <button onClick={() => setActiveTab('home')} className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all duration-200 ${activeTab === 'home' ? 'font-bold text-emerald-400 bg-white/5 border border-emerald-500/10' : 'font-medium text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}`}>
                    <span className="flex items-center gap-2.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'home' ? 'bg-emerald-400' : 'bg-transparent border border-slate-500'}`}></span>
                      Home Hub Overview
                    </span>
                    <span className="font-mono text-[9px] text-emerald-500">01</span>
                  </button>
                  <button onClick={() => setActiveTab('dts')} className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all duration-200 ${activeTab === 'dts' ? 'font-bold text-emerald-400 bg-white/5 border border-emerald-500/10' : 'font-medium text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}`}>
                    <span className="flex items-center gap-2.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'dts' ? 'bg-emerald-400' : 'bg-transparent border border-slate-500'}`}></span>
                      Document DTS
                    </span>
                    <span className="font-mono text-[9px] text-slate-500">02</span>
                  </button>
                  <button onClick={() => setActiveTab('ets')} className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all duration-200 ${activeTab === 'ets' ? 'font-bold text-emerald-400 bg-white/5 border border-emerald-500/10' : 'font-medium text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}`}>
                    <span className="flex items-center gap-2.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'ets' ? 'bg-emerald-400' : 'bg-transparent border border-slate-500'}`}></span>
                      Personnel ETS
                    </span>
                    <span className="font-mono text-[9px] text-slate-500">03</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-950/40 p-3.5 rounded-2xl border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-[9px] font-mono">
                  <span className="text-slate-500">NODE STATUS:</span>
                  <span className="text-emerald-400 font-bold">ONLINE</span>
                </div>
                <div className="flex items-center justify-between text-[9px] font-mono">
                  <span className="text-slate-500">UPLINK SPEED:</span>
                  <span className="text-slate-300">984 Mbps</span>
                </div>
                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                  <div className="bg-linear-to-r from-blue-500 to-emerald-500 h-full w-4/5 animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]"></div>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* MAIN SPLIT VIEW */}
        <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 z-10 transition-all duration-300">
          <section className="lg:col-span-8 flex flex-col gap-6">
            
            {activeTab === 'home' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-white/10 via-white/5 to-transparent p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                  <div className="absolute -right-24 -bottom-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 uppercase mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Smarter Agriculture Platform
                  </span>
                  <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-none">
                    SARAI <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-teal-300 to-blue-400">Ilocos</span>
                  </h1>
                  <p className="text-sm sm:text-base text-slate-300 max-w-xl mt-4 leading-relaxed font-light">
                    Reinvigorating local agriculture in the Ilocos Region through state-of-the-art telemetry integration, real-time tracking structures, and smart crop modeling protocols.
                  </p>
                  <div className="flex flex-wrap gap-3 mt-6">
                    <button onClick={() => setActiveTab('dts')} className="px-5 py-2.5 rounded-xl bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2">
                      Launch DTS Workspace
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </button>
                    <button onClick={() => setActiveTab('ets')} className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs transition-all">
                      Registry Dashboard
                    </button>
                  </div>
                </div>

                {/* Micro Metrics Area */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl">
                    <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">ACTIVE DTS FILE VOLUME</p>
                    <p className="text-3xl font-mono font-extrabold text-emerald-400 mt-2">1,842</p>
                    <p className="text-[9px] text-slate-500 mt-1">▲ 12% increase this quarter</p>
                  </div>
                  <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl">
                    <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">TELEMETRY SENSOR POSTS</p>
                    <p className="text-3xl font-mono font-extrabold text-blue-400 mt-2">84</p>
                    <p className="text-[9px] text-emerald-400 mt-1">● 100% online status</p>
                  </div>
                  <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl">
                    <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">ACTIVE FIELD STAFF</p>
                    <p className="text-3xl font-mono font-extrabold text-amber-400 mt-2">29</p>
                    <p className="text-[9px] text-slate-500 mt-1">Deployed in Region I</p>
                  </div>
                  <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl">
                    <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">REGIONAL ADVISORIES</p>
                    <p className="text-3xl font-mono font-extrabold text-rose-400 mt-2">08</p>
                    <p className="text-[9px] text-rose-400 mt-1">Pending approval release</p>
                  </div>
                </div>

                {/* Regional Deployments Grid Split */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-900/40 border border-white/10 rounded-3xl p-5 flex flex-col relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-white tracking-wide uppercase">Regional Deployments</h3>
                      <span className="text-[10px] font-mono bg-white/5 border border-white/10 rounded px-2 py-0.5 text-slate-400">ILOCOS REGION</span>
                    </div>
                    <div className="flex-1 min-h-55 rounded-2xl bg-slate-950/50 border border-white/5 p-4 flex items-center justify-center relative">
                      <svg className="h-48 w-auto text-emerald-600/30" viewBox="0 0 100 200" fill="currentColor">
                        <path d="M40,10 C45,20 50,30 45,45 C40,60 30,70 35,90 C40,110 55,120 45,140 C35,160 20,170 30,190" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none" />
                      </svg>
                      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 cursor-pointer group">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute"></div>
                        <div className="w-3 h-3 bg-red-600 rounded-full border border-white relative z-10"></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900/40 border border-white/10 rounded-3xl p-5 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-wide uppercase mb-3">Crop Priority Advisory</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white/5 border border-white/5 p-2.5 rounded-xl hover:bg-white/10 transition-colors">
                          <span className="text-lg">🌾</span>
                          <p className="text-xs font-bold text-white mt-1">Rice / Corn</p>
                          <p className="text-[9px] text-emerald-400">High Yield Phase</p>
                        </div>
                        <div className="bg-white/5 border border-white/5 p-2.5 rounded-xl hover:bg-white/10 transition-colors">
                          <span className="text-lg">🍌</span>
                          <p className="text-xs font-bold text-white mt-1">Musa (Banana)</p>
                          <p className="text-[9px] text-amber-400">Soil Saturated</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <p className="text-[10px] text-slate-400 leading-relaxed font-mono">All metrics sync live under Joint Resolution of UPLB, DOST-PCAARRD & Region I field operations.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'dts' && <DocTrack documents={documents} setDocuments={setDocuments} onSelectRow={(id) => setQrId(id)} />}
            {activeTab === 'ets' && <TimeTrack />}

          </section>

          {/* RIGHT FLOATING MODULES */}
          <section className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-5 relative overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Live Telemetry Status</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-[9px] font-mono text-emerald-400 font-bold">LIVE</span>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center py-6 bg-slate-950/40 rounded-2xl border border-white/5 mb-4">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-t-2 border-r-2 border-emerald-400 rounded-full animate-[spin_12s_infinite_linear]"></div>
                  <span className="text-lg">🌿</span>
                </div>
                <p className="text-xs font-bold text-white mt-3">Telemetry Synchronizer Active</p>
              </div>
              <div className="space-y-2 max-h-35 overflow-y-auto pr-1">
                <div className="text-[10px] font-mono text-slate-300 bg-white/5 p-2 rounded-lg border border-white/5">
                  <span className="text-blue-400 font-bold">[SYS]</span> DTS state engine initialized.
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-5 relative overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Document QR Generator</h3>
              </div>
              <div className="relative h-44 rounded-2xl bg-slate-950/80 border border-white/10 flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute left-0 w-full h-1 bg-linear-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_rgba(16,185,129,1)] scan-line pointer-events-none z-10"></div>
                <div className="w-24 h-24 bg-white p-2.5 rounded-xl flex flex-col justify-between shadow-2xl relative z-0">
                  <div className="flex justify-between">
                    <div className="w-6 h-6 border-4 border-slate-950"></div>
                    <div className="w-6 h-6 border-4 border-slate-950"></div>
                  </div>
                  <div className="self-center w-3 h-3 bg-emerald-500 rounded-sm"></div>
                  <div className="flex justify-between">
                    <div className="w-6 h-6 border-4 border-slate-950"></div>
                    <div className="w-6 h-6 flex flex-wrap gap-0.5 p-0.5">
                      <div className="w-1.5 h-1.5 bg-slate-950"></div>
                    </div>
                  </div>
                </div>
                <p className={`text-[10px] font-mono font-bold tracking-widest mt-3 ${qrAuthStatus ? 'text-emerald-400' : 'text-slate-300'}`}>
                  {qrAuthStatus ? 'AUTHENTICATED √' : qrId}
                </p>
              </div>
              <button onClick={triggerScanningFeedback} className="w-full mt-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs py-2.5 rounded-xl transition-all">
                Simulate Scan Link Check
              </button>
            </div>
          </section>
        </main>
      </div>

      <footer className="w-full bg-[#070b13]/80 border-t border-white/5 py-4 z-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-slate-500">
          <p className="text-center sm:text-left">
            © 2026 Project SARAI CeNTRO — Ilocos Region. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}