"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
    
type Tab = "personnel" | "projects" | "reports";

export default function ModulesPage() {
    const [active, setActive] = useState<Tab | null>(null);

    // Read the initial hash on load and respond to hash changes triggered
    // by navigation (e.g. clicking the module card). We still don't expose
    // in-page controls to switch modules; the hashchange listener only
    // reacts to external navigation to /modules#<name>.
    useEffect(() => {
        const readHash = () => {
            const hash = typeof window !== "undefined" ? window.location.hash.replace("#", "") : "";
            if (hash === "projects" || hash === "reports" || hash === "personnel") setActive(hash as Tab);
            else setActive(null);
        };

        readHash();
        window.addEventListener("hashchange", readHash);
        return () => window.removeEventListener("hashchange", readHash);
    }, []);

    return (
        <div className="min-h-screen bg-muted/10 p-8" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
            <div className="mx-auto max-w-6xl">
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
                    {active === null && (
                        <div className="rounded-lg border border-border bg-white p-6 text-center">
                            <h3 className="font-semibold text-foreground">No module selected</h3>
                            <p className="mt-2 text-sm text-muted-foreground">Please return to the home page and choose a module from the cards. Use the button below to go back.</p>
                            <div className="mt-4">
                                <Link href="/?view=landing" className="inline-flex items-center gap-2 rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary">Return to landing</Link>
                            </div>
                        </div>
                    )}

                    {active === "personnel" && (
                        <div id="personnel" className="space-y-4">
                            <h2 className="text-lg font-bold text-foreground">Sarai Personnel</h2>
                            <p className="text-sm text-muted-foreground">Directory and records for all SARAI staff. Search, filter, and export personnel lists.</p>

                            <div className="grid gap-4 md:grid-cols-3 mt-4">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="rounded-lg border border-border bg-white p-4">
                                        <div className="mb-2 flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-foreground font-semibold">R</div>
                                            <div>
                                                <div className="font-semibold">Reina Santos</div>
                                                <div className="text-xs text-muted-foreground">Agronomy Specialist</div>
                                            </div>
                                        </div>
                                        <div className="text-xs text-muted-foreground">Email: reina.santos@dost.gov.ph</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {active === "projects" && (
                        <div id="projects" className="space-y-8">
                            <div>
                                <h2 className="text-xl font-bold text-foreground">Strategic Frameworks</h2>
                                <p className="text-sm text-muted-foreground">Institutional guidelines, mission profiles, and mandates.</p>
                            </div>

                            {/* Section 1: Project SARAI */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1">Project SARAI</h3>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="rounded-lg border border-border bg-white p-5 space-y-2 shadow-sm">
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-600">SARAI Mission</h4>
                                        <p className="text-sm text-foreground leading-relaxed">
                                            To deploy science-based crop technologies, forecasting systems, and protocols to farming communities. It aims to strengthen climate-informed decision-making by delivering timely data, improving local resource planning, and enhancing farmers' abilities to adapt to changing environmental conditions.
                                        </p>
                                    </div>
                                    <div className="rounded-lg border border-border bg-white p-5 space-y-2 shadow-sm">
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-600">SARAI Vision</h4>
                                        <p className="text-sm text-foreground leading-relaxed">
                                            A smart, resilient, and highly sustainable agricultural sector in the Philippines where farmers and local governments are empowered by modern, data-driven technologies. It envisions a future where localized agricultural monitoring safeguards food security despite erratic weather.
                                        </p>
                                    </div>
                                </div>
                                <div className="rounded-lg border border-border bg-white p-5 space-y-2 shadow-sm">
                                    <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-600">Core Framework & Technologies</h4>
                                    <p className="text-sm text-foreground leading-relaxed">
                                        Project SARAI achieves its mission through an integrated network of scientists, researchers, and local government units (LGUs). The program utilizes tools such as satellite data, crop models, and localized weather monitoring system channels.
                                    </p>
                                </div>
                            </div>

                            {/* Section 2: DOST Region I */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1">DOST Region I</h3>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="rounded-lg border border-border bg-white p-5 space-y-2 shadow-sm">
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-blue-600">DOST I Mission</h4>
                                        <p className="text-sm text-foreground leading-relaxed">
                                            To lead, direct, and coordinate scientific and technological efforts to bring about maximum economic and social benefits for the people of the region.
                                        </p>
                                    </div>
                                    <div className="rounded-lg border border-border bg-white p-5 space-y-2 shadow-sm">
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-blue-600">DOST I Vision</h4>
                                        <p className="text-sm text-foreground leading-relaxed">
                                            "DOST I as the Champion of Science, Technology and Innovation towards an inclusive, smart, resilient and sustainable Region I."
                                        </p>
                                    </div>
                                </div>
                                <div className="rounded-lg border border-border bg-white p-5 space-y-2 shadow-sm">
                                    <h4 className="text-sm font-bold uppercase tracking-wider text-blue-600">DOST I Mandate</h4>
                                    <p className="text-sm text-foreground leading-relaxed">
                                        Guided by Executive Order No. 128, the agency provides leadership in local S&T development, focusing on research, technology transfer, and implementing grants-in-aid.
                                    </p>
                                </div>
                            </div>

                            {/* Section 3: Privacy Policy */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1">Privacy Policy</h3>
                                <div className="rounded-lg border border-border bg-white p-5 space-y-2 shadow-sm">
                                    <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-600">How information is handled</h4>
                                    <p className="text-sm text-foreground leading-relaxed">
                                        SARAI uses this portal to manage personnel records, project coordination, and accomplishment reporting. Personal information is collected only when needed for authorized access and administrative workflows, and it is protected through role-based permissions and secure system practices.
                                    </p>
                                </div>
                            </div>

                            {/* Section 4: Terms of Use */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1">Terms of Use</h3>
                                <div className="rounded-lg border border-border bg-white p-5 space-y-2 shadow-sm">
                                    <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-600">Portal usage expectations</h4>
                                    <p className="text-sm text-foreground leading-relaxed">
                                        Access to the SARAI portal is intended for authorized staff, partners, and approved stakeholders. Users are expected to keep their credentials confidential, use information responsibly, and avoid sharing sensitive records outside approved project channels.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {active === "reports" && (
                        <div id="reports" className="space-y-4">
                            <h2 className="text-lg font-bold text-foreground">Accomplishment Reports</h2>
                            <p className="text-sm text-muted-foreground">Summary of achievements, downloadable PDF exports, and submission status.</p>

                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                                {[{
                                    title: "Q2 2025 Accomplishment",
                                    summary: "Regional milestones and KPIs",
                                }, {
                                    title: "Technology Commercialization Report",
                                    summary: "Highlights and outcomes",
                                }].map((r, idx) => (
                                    <div key={idx} className="rounded-lg border border-border bg-white p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-semibold">{r.title}</div>
                                                <div className="text-xs text-muted-foreground">{r.summary}</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <a href="#" className="text-sm font-semibold text-primary">View</a>
                                                <a href="#" className="text-sm font-semibold text-foreground/70">Download</a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}