"use client";

import { Trophy } from "lucide-react";

const achievements = [
  {
    title: "Best Regional Office 2025",
    org: "DOST Central Office",
    date: "June 2025",
    icon: "🏆",
    color: "#f6ad55",
  },
  {
    title: "SARAI Champion Implementer",
    org: "PhilRice",
    date: "May 2025",
    icon: "🌾",
    color: "#68d391",
  },
  {
    title: "Top Technology Commercializer",
    org: "DOST Region 1",
    date: "April 2025",
    icon: "💡",
    color: "#63b3ed",
  },
];

export default function AchievementsRoutePage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Achievements</h2>
        <p className="text-sm text-muted-foreground">Latest updates, recognitions, and milestones for the SARAI ecosystem.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((item) => (
          <div key={item.title} className="flex items-start gap-4 rounded-xl border border-border bg-white p-5 transition-shadow hover:shadow-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl" style={{ backgroundColor: `${item.color}22` }}>
              {item.icon}
            </div>
            <div>
              <h3 className="mb-1 text-sm font-bold text-foreground">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.org}</p>
              <p className="mt-1 font-mono text-xs text-primary">{item.date}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-linear-to-r from-primary to-emerald-600 p-8 text-center text-white">
        <div className="mb-4 flex justify-center text-5xl">
          <Trophy size={40} />
        </div>
        <h3 className="mb-2 text-2xl font-extrabold">Best Regional Office 2025</h3>
        <p className="mx-auto max-w-md text-sm text-white/80">
          DOST Region 1 recognized as the Best Regional Office for outstanding performance in technology transfer, community engagement, and innovation in public service.
        </p>
      </div>
    </div>
  );
}
