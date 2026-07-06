"use client";

import Link from "next/link";

const news = [
  {
    id: 1,
    title: "SARAI Launches AI-Powered Crop Monitoring",
    excerpt: "Satellite-linked crop monitoring stations are now active across key municipalities in Ilocos Region.",
    tag: "Technology",
    date: "June 28, 2025",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=700&fit=crop&auto=format",
  },
  {
    id: 2,
    title: "DOST Region 1 Wins Best Regional Office Award",
    excerpt: "The regional office was recognized for excellence in technology commercialization and community engagement.",
    tag: "Award",
    date: "June 24, 2025",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=700&fit=crop&auto=format",
  },
  {
    id: 3,
    title: "240 Farmers Complete Weather Advisory Training",
    excerpt: "Locally trained beneficiaries can now interpret digital climate warnings and plan their farms better.",
    tag: "Training",
    date: "June 18, 2025",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&h=700&fit=crop&auto=format",
  },
];

const events = [
  { id: 1, title: "National Science Month Opening", date: "Jul 1, 2025", location: "Regional Center" },
  { id: 2, title: "SARAI Q3 Progress Review", date: "Jul 3, 2025", location: "DOST Region 1 HQ" },
  { id: 3, title: "Farmer Advisory Workshop", date: "Jul 12, 2025", location: "Municipal Hall" },
];

export default function AnnouncementsPage() {
  return (
    <div className="min-h-screen bg-muted/10 py-12" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Announcements & News</h1>
            <p className="text-sm text-muted-foreground">Latest news and upcoming events from the SARAI ecosystem.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/?view=landing" className="text-sm text-foreground/80 hover:text-foreground">← Back to home</Link>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="grid gap-6 sm:grid-cols-2">
              {news.map((item) => (
                <article key={item.id} className="overflow-hidden rounded-lg border border-border bg-white">
                  <div className="h-48 overflow-hidden bg-muted">
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{item.tag}</span>
                      <span className="text-xs text-muted-foreground">{item.date}</span>
                    </div>
                    <h3 className="mb-2 text-sm font-bold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-lg border border-border bg-white p-4">
              <h3 className="font-semibold text-foreground">Upcoming Events</h3>
              <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
                {events.map((ev) => (
                  <li key={ev.id} className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-foreground">{ev.title}</div>
                      <div className="text-xs">{ev.location}</div>
                    </div>
                    <div className="text-xs font-mono text-muted-foreground">{ev.date}</div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-border bg-white p-4">
              <h3 className="font-semibold text-foreground">Subscribe</h3>
              <p className="mt-2 text-sm text-muted-foreground">Get notified about major announcements and events.</p>
              <form className="mt-3 flex gap-2">
                <input type="email" placeholder="you@dost.gov.ph" className="flex-1 rounded-lg border border-border px-3 py-2 text-sm" />
                <button className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white">Subscribe</button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
