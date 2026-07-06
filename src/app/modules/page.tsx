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
						<div id="projects" className="space-y-4">
							<h2 className="text-lg font-bold text-foreground">Projects & Missions</h2>
							<p className="text-sm text-muted-foreground">Active initiatives, milestones, and assigned teams.</p>

							<div className="mt-4 space-y-3">
								{[{
									title: "AI Crop Monitoring",
									status: "Active",
									progress: 72,
								}, {
									title: "Community Training",
									status: "Planning",
									progress: 18,
								}, {
									title: "Technology Vouchers",
									status: "Completed",
									progress: 100,
								}].map((p, idx) => (
									<div key={idx} className="rounded-lg border border-border bg-white p-4">
										<div className="flex items-center justify-between">
											<div>
												<div className="font-semibold">{p.title}</div>
												<div className="text-xs text-muted-foreground">Status: {p.status}</div>
											</div>
											<div className="w-40">
												<div className="h-2 w-full rounded-full bg-muted">
													<div className="h-2 rounded-full bg-emerald-500" style={{ width: `${p.progress}%` }} />
												</div>
												<div className="mt-1 text-xs text-muted-foreground">{p.progress}%</div>
											</div>
										</div>
									</div>
								))}
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