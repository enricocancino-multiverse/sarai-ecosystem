"use strict";
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Types corresponding to your new target dashboard modules
type Tab = "projects" | "maps" | "calendars";

export default function ModulesPage() {
    const [active, setActive] = useState<Tab | null>(null);

    useEffect(() => {
        const readHash = () => {
            const hash = typeof window !== "undefined" ? window.location.hash.replace("#", "") : "";
            if (hash === "projects" || hash === "maps" || hash === "calendars") {
                setActive(hash as Tab);
            } else {
                setActive(null);
            }
        };

        readHash();
        window.addEventListener("hashchange", readHash);
        return () => window.removeEventListener("hashchange", readHash);
    }, []);

    return (
        <div className="min-h-screen bg-muted/10 p-8" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
            <div className="mx-auto max-w-6xl">
                
                {/* Header Row */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Sarai Modules</h1>
                        <p className="text-sm text-muted-foreground">Manage personnel, projects, and accomplishment reports.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/?view=landing" className="text-sm text-foreground/80 hover:text-foreground">← Back to home</Link>
                    </div>
                </div>

                <section>
                    {/* Fallback View */}
                    {active === null && (
                        <div className="rounded-lg border border-border bg-white p-6 text-center">
                            <h3 className="font-semibold text-foreground">No module selected</h3>
                            <p className="mt-2 text-sm text-muted-foreground">Please return to the home page and choose an active component from the dashboard.</p>
                            <div className="mt-4">
                                <Link href="/?view=landing" className="inline-flex items-center gap-2 rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary">Return to landing</Link>
                            </div>
                        </div>
                    )}
     
                    {/* MODULE 1: MISSION & STRATEGIC FRAMEWORKS (Kept per your layout) */}
                    {active === "projects" && (
                        <div id="projects" className="space-y-8">
                            <div>
                                <h2 className="text-xl font-bold text-foreground">Strategic Frameworks</h2>
                                <p className="text-sm text-muted-foreground">Institutional guidelines, mission profiles, and mandates.</p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1">Project SARAI Focus</h3>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="rounded-lg border border-border bg-white p-5 space-y-2 shadow-sm">
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-600">SARAI Mission</h4>
                                        <p className="text-sm text-foreground leading-relaxed">
                                         To equip farming communities with science-based tools that help them fight climate change and improve crop planning.
                                        </p>
                                    </div>
                                    <div className="rounded-lg border border-border bg-white p-5 space-y-2 shadow-sm">
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-600">SARAI Vision</h4>
                                        <p className="text-sm text-foreground leading-relaxed">
                                          To build smart, climate-resilient farming communities that use real-time data to protect their crops and increase food production.
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-border bg-white p-5 space-y-2 shadow-sm">
                                    <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-600">Core Framework &amp; Technologies</h4>
                                    <p className="text-sm text-foreground leading-relaxed">
                                        Project SARAI achieves its mission through an integrated network of scientists, researchers, and local government units (LGUs). The program utilizes tools such as satellite data, crop models, and localized weather monitoring system channels.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1">DOST Region I</h3>
                                <div className="grid gap-6 md:grid-cols-3">
                                    <div className="rounded-lg border border-border bg-white p-5 space-y-2 shadow-sm">
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-sky-700">DOST I Mission</h4>
                                        <p className="text-sm text-foreground leading-relaxed">
                                           To direct, lead and coordinate the country’s scientific, technological, and innovative efforts geared towards maximum economic and social benefits for the people.
                                        </p>
                                    </div>
                                    <div className="rounded-lg border border-border bg-white p-5 space-y-2 shadow-sm">
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-sky-700">DOST I Vision</h4>
                                        <p className="text-sm text-foreground leading-relaxed">
                                           DOST I as the Champion of Science, Technology and Innovation towards an inclusive, smart, resilient and sustainable Region I.
                                        </p>
                                    </div>
                                    <div className="rounded-lg border border-border bg-white p-5 space-y-2 shadow-sm">
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-sky-700">DOST I Mandate</h4>
                                        <p className="text-sm text-foreground leading-relaxed">
                                            Executive Order No. 128 mandates the Department to “provide central direction, leadership and coordination of scientific and technological efforts and ensure that the results therefrom are geared and utilized in areas of maximum economic and social benefits for the people”.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="rounded-lg border border-border bg-white p-5 space-y-2 shadow-sm">
                                    <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-600">Privacy Policy</h4>
                                    <p className="text-sm text-foreground leading-relaxed">
                                        SARAI uses this portal to manage personnel records, project coordination, and accomplishment reporting. Personal information is collected only when needed for authorized access and administrative workflows, and it is protected through role-based permissions and secure system practices.
                                    </p>
                                </div>
                                <div className="rounded-lg border border-border bg-white p-5 space-y-2 shadow-sm">
                                    <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-600">Terms of Use</h4>
                                    <p className="text-sm text-foreground leading-relaxed">
                                        Access to the SARAI portal is intended for authorized staff, partners, and approved stakeholders. Users are expected to keep their credentials confidential, use information responsibly, and avoid sharing sensitive records outside approved project channels.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* NEW MODULE 2: CROP SUITABILITY MAPS DATA SYSTEM */}
                    {active === "maps" && (
                        <div id="maps" className="space-y-6">
                            <div>
                                <h2 className="text-xl font-bold text-foreground">Crop Suitability Maps</h2>
                                <p className="text-sm text-muted-foreground">Interactive agro-ecological models matching terrain characteristics with priority crop choices.</p>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="rounded-lg border border-border bg-white p-5 space-y-2 shadow-sm">
                                    <div className="text-xl">🏔️</div>
                                    <h4 className="text-sm font-bold text-slate-800">Terrain & Soil Indexing</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Processes regional soil texture data, soil acidity balances, and elevation slopes to identify optimal growth fields.
                                    </p>
                                </div>
                                <div className="rounded-lg border border-border bg-white p-5 space-y-2 shadow-sm">
                                    <div className="text-xl">📡</div>
                                    <h4 className="text-sm font-bold text-slate-800">Agro-Ecological Classification</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Integrates historical CHIRPS weather trends to define where specific high-value targets (like Cacao or Coffee) yield optimal results.
                                    </p>
                                </div>
                                <div className="rounded-lg border border-border bg-white p-5 space-y-2 shadow-sm">
                                    <div className="text-xl">🗺️</div>
                                    <h4 className="text-sm font-bold text-slate-800">GIS Overlay Layers</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Enables interactive data visualizations for municipalities to trace water catchment margins and avoid planting in severe runoff zones.
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-lg border border-border bg-slate-50 p-6">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3">Fact Web: Suitability Parameters by Priority Crops</h3>
                                <div className="overflow-x-auto text-xs">
                                    <table className="w-full text-left border-collapse bg-white rounded-lg overflow-hidden border border-slate-200">
                                        <thead>
                                            <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-semibold">
                                                <th className="p-3">Priority Crop Group</th>
                                                <th className="p-3">Optimal Elevation</th>
                                                <th className="p-3">Critical Soil Condition</th>
                                                <th className="p-3">Water Dynamic Target</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-slate-600">
                                            <tr>
                                                <td className="p-3 font-medium text-slate-900">Lowland Rice</td>
                                                <td className="p-3">0 - 500m</td>
                                                <td className="p-3">Heavy alluvial clay / slow drainage</td>
                                                <td className="p-3">High capacity retention fields</td>
                                            </tr>
                                            <tr>
                                                <td className="p-3 font-medium text-slate-900">Upland Corn</td>
                                                <td className="p-3">100 - 1200m</td>
                                                <td className="p-3">Well-drained loamy sands</td>
                                                <td className="p-3">Highly vulnerable to waterlogging</td>
                                            </tr>
                                            <tr>
                                                <td className="p-3 font-medium text-slate-900">Highland Coffee</td>
                                                <td className="p-3">600 - 1800m</td>
                                                <td className="p-3">Deep volcanic, rich organic soil</td>
                                                <td className="p-3">Requires high humidity + strict drainage</td>
                                            </tr>
                                            <tr>
                                                <td className="p-3 font-medium text-slate-900">Priority Legumes (Soybean)</td>
                                                <td className="p-3">0 - 900m</td>
                                                <td className="p-3">Neutral pH (6.0 - 6.5) sandy clay</td>
                                                <td className="p-3">Moderate moisture for nodulation</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* NEW MODULE 3: SEASONAL PLANTING CALENDARS DATA SYSTEM */}
                    {active === "calendars" && (
                        <div id="calendars" className="space-y-6">
                            <div>
                                <h2 className="text-xl font-bold text-foreground">Seasonal Planting Calendars</h2>
                                <p className="text-sm text-muted-foreground">Dynamic, weather-driven schedules calculated straight from real-time El Niño and macro climate anomalies.</p>
                            </div>

                            <div className="bg-white border border-border rounded-xl p-5 shadow-sm space-y-4">
                                <div className="border-l-4 border-blue-500 bg-blue-50/40 p-4 rounded-r-lg">
                                    <h4 className="text-sm font-bold text-blue-900 flex items-center gap-1.5">☀️ The El Niño Adjustment Vector</h4>
                                    <p className="text-xs text-blue-800 leading-relaxed mt-1">
                                        During identified warming cycles, planting timelines are systematically shifted 15-30 days ahead of typical historic models. This allows vegetative development windows to mature before the worst dryness strikes groundwater tables.
                                    </p>
                                </div>

                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pt-2">Operational Schedule Matrix</h3>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="p-4 border border-slate-200 rounded-lg">
                                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide block mb-1">Optimal Tactical Window</span>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Leverage wet seasons starting June-September for raw rainfed areas, or early dry phases (October-December) if municipal irrigation systems are robust.
                                        </p>
                                    </div>
                                    <div className="p-4 border border-slate-200 rounded-lg bg-amber-50/20">
                                        <span className="text-xs font-bold text-amber-700 uppercase tracking-wide block mb-1">Hazard Block Windows</span>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Avoid peak solar trends from March-May if independent localized water retention frameworks are offline to protect seed sets from early heat shock mortality.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 text-xs space-y-2">
                                    <span className="font-bold text-slate-700 block">System Verification Status</span>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Timelines dynamically synchronize with monthly CHIRPS updates. Regional monitoring tracks parameters locally to prevent widespread crop seed loss.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}