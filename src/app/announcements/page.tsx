"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusCircle, Trash2 } from "lucide-react";

type NewsItem = {
  id: number;
  title: string;
  excerpt: string;
  tag: string;
  date: string;
  image: string;
};

type EventItem = {
  id: number;
  title: string;
  date: string;
  location: string;
};

const defaultNews: NewsItem[] = [
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

const defaultEvents: EventItem[] = [
  { id: 1, title: "National Science Month Opening", date: "Jul 1, 2025", location: "Regional Center" },
  { id: 2, title: "SARAI Q3 Progress Review", date: "Jul 3, 2025", location: "DOST Region 1 HQ" },
  { id: 3, title: "Farmer Advisory Workshop", date: "Jul 12, 2025", location: "Municipal Hall" },
];

type AnnouncementsPageProps = {
  news?: NewsItem[];
  events?: EventItem[];
  isSuperadmin?: boolean;
  onAddNews?: (item: Omit<NewsItem, "id" | "date">) => void;
  onRemoveNews?: (id: number) => void;
  onAddEvent?: (item: Omit<EventItem, "id">) => void;
  onRemoveEvent?: (id: number) => void;
  onBack?: () => void;
};

export default function AnnouncementsPage({
  news,
  events,
  isSuperadmin = false,
  onAddNews,
  onRemoveNews,
  onAddEvent,
  onRemoveEvent,
  onBack,
}: AnnouncementsPageProps) {
  const visibleNews = news ?? defaultNews;
  const visibleEvents = events ?? defaultEvents;
  const canManage = isSuperadmin || Boolean(onAddNews || onRemoveNews || onAddEvent || onRemoveEvent);
  const [newsTitle, setNewsTitle] = useState("");
  const [newsExcerpt, setNewsExcerpt] = useState("");
  const [newsTag, setNewsTag] = useState("Technology");
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");

  const submitNews = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newsTitle.trim() || !newsExcerpt.trim() || !onAddNews) return;
    onAddNews({ title: newsTitle.trim(), excerpt: newsExcerpt.trim(), tag: newsTag, image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=700&fit=crop&auto=format" });
    setNewsTitle("");
    setNewsExcerpt("");
    setNewsTag("Technology");
  };

  const submitEvent = (event: React.FormEvent) => {
    event.preventDefault();
    if (!eventTitle.trim() || !eventDate.trim() || !eventLocation.trim() || !onAddEvent) return;
    onAddEvent({ title: eventTitle.trim(), date: eventDate.trim(), location: eventLocation.trim() });
    setEventTitle("");
    setEventDate("");
    setEventLocation("");
  };

  return (
    <div className="min-h-screen bg-muted/10 py-12" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Announcements & News</h1>
            <p className="text-sm text-muted-foreground">Latest news and upcoming events from the SARAI ecosystem.</p>
          </div>
          <div className="flex items-center gap-3">
            {onBack ? (
              <button type="button" onClick={onBack} className="text-sm text-foreground/80 hover:text-foreground">
                ← Back to dashboard
              </button>
            ) : (
              <Link href="/?view=landing" className="text-sm text-foreground/80 hover:text-foreground">← Back to home</Link>
            )}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {canManage ? (
              <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <PlusCircle size={16} className="text-primary" /> Publish a new announcement
                </h3>
                <form onSubmit={submitNews} className="space-y-3">
                  <input value={newsTitle} onChange={(event) => setNewsTitle(event.target.value)} type="text" placeholder="Announcement title" className="w-full rounded-lg border border-border px-3 py-2 text-sm" required />
                  <textarea value={newsExcerpt} onChange={(event) => setNewsExcerpt(event.target.value)} placeholder="Announcement summary" className="h-24 w-full resize-none rounded-lg border border-border px-3 py-2 text-sm" required />
                  <div className="flex gap-3">
                    <select value={newsTag} onChange={(event) => setNewsTag(event.target.value)} className="rounded-lg border border-border bg-white px-3 py-2 text-sm">
                      <option value="Technology">Technology</option>
                      <option value="Award">Award</option>
                      <option value="Training">Training</option>
                    </select>
                    <button type="submit" className="flex-1 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white">Publish</button>
                  </div>
                </form>
              </div>
            ) : null}

            <div className="grid gap-6 sm:grid-cols-2">
              {visibleNews.map((item) => (
                <article key={item.id} className="overflow-hidden rounded-lg border border-border bg-white">
                  <div className="h-48 overflow-hidden bg-muted">
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-4">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{item.tag}</span>
                      <span className="text-xs text-muted-foreground">{item.date}</span>
                    </div>
                    <h3 className="mb-2 text-sm font-bold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.excerpt}</p>
                  </div>
                  {isSuperadmin && onRemoveNews ? (
                    <div className="border-t border-border bg-slate-50 p-3">
                      <button type="button" onClick={() => onRemoveNews(item.id)} className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700">
                        <Trash2 size={13} /> Remove post
                      </button>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            {canManage ? (
              <div className="rounded-lg border border-border bg-white p-4">
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                  <PlusCircle size={15} className="text-primary" /> Add event
                </h3>
                <form onSubmit={submitEvent} className="space-y-2">
                  <input value={eventTitle} onChange={(event) => setEventTitle(event.target.value)} type="text" placeholder="Event title" className="w-full rounded-lg border border-border px-3 py-2 text-sm" required />
                  <input value={eventDate} onChange={(event) => setEventDate(event.target.value)} type="text" placeholder="Date" className="w-full rounded-lg border border-border px-3 py-2 text-sm" required />
                  <input value={eventLocation} onChange={(event) => setEventLocation(event.target.value)} type="text" placeholder="Location" className="w-full rounded-lg border border-border px-3 py-2 text-sm" required />
                  <button type="submit" className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white">Add to calendar</button>
                </form>
              </div>
            ) : null}

            <div className="rounded-lg border border-border bg-white p-4">
              <h3 className="mb-3 font-semibold text-foreground">Upcoming Events</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {visibleEvents.map((ev) => (
                  <li key={ev.id} className="flex items-start justify-between gap-2 border-b border-dashed border-border pb-2 last:border-0 last:pb-0">
                    <div>
                      <div className="font-semibold text-foreground">{ev.title}</div>
                      <div className="text-xs">{ev.location}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1 text-xs font-mono text-muted-foreground">
                      <span>{ev.date}</span>
                      {isSuperadmin && onRemoveEvent ? (
                        <button type="button" onClick={() => onRemoveEvent(ev.id)} className="text-red-500 hover:text-red-700" title="Remove event">
                          <Trash2 size={12} />
                        </button>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
