"use client";

import { Suspense, useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Bell,
  Calendar,
  Camera,
  Check,
  CheckCircle,
  ChevronRight,
  Clock,
  Download,
  Eye,
  EyeOff,
  FileText,
  FolderOpen,
  Globe,
  Home,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Trophy,
  TrendingUp,
  User,
  Users,
  X,
} from "lucide-react";

type Page = "home" | "login" | "user-dashboard" | "admin-dashboard" | "dts" | "attendance" | "trophies";
type UserRole = "user" | "admin" | null;

type NavItem = { label: string; page: Page; icon: ReactNode };

type NewsItem = {
  id: number;
  title: string;
  excerpt: string;
  tag: string;
  date: string;
  image: string;
  isLive: boolean;
  isLatest: boolean;
};

const userNav: NavItem[] = [
  { label: "Dashboard", page: "user-dashboard", icon: <Home size={18} /> },
  { label: "DTS", page: "dts", icon: <FileText size={18} /> },
  { label: "Attendance", page: "attendance", icon: <Clock size={18} /> },
  { label: "News & Trophies", page: "trophies", icon: <Trophy size={18} /> },
];

const adminNav: NavItem[] = [
  { label: "Dashboard", page: "admin-dashboard", icon: <Home size={18} /> },
  { label: "DTS", page: "dts", icon: <FileText size={18} /> },
  { label: "Attendance", page: "attendance", icon: <Clock size={18} /> },
  { label: "News & Trophies", page: "trophies", icon: <Trophy size={18} /> },
];

const documents = [
  { id: "DTS-2025-001", subject: "Budget Proposal FY2025", from: "Finance", to: "Director", date: "2025-06-28", status: "In Transit", priority: "High" },
  { id: "DTS-2025-002", subject: "Project SARAI Phase 2 MOU", from: "DOST R1", to: "Legal", date: "2025-06-27", status: "Received", priority: "High" },
  { id: "DTS-2025-003", subject: "Quarterly Activity Report Q2", from: "Admin", to: "Planning", date: "2025-06-26", status: "Approved", priority: "Normal" },
  { id: "DTS-2025-004", subject: "Livelihood Technology Vouchers", from: "CEST", to: "Finance", date: "2025-06-25", status: "For Signature", priority: "Normal" },
];

const initialNews: NewsItem[] = [
  {
    id: 1,
    title: "SARAI Launches AI-Powered Crop Monitoring",
    excerpt: "Satellite-linked crop monitoring stations are now active across key municipalities in Ilocos Region.",
    tag: "Technology",
    date: "June 28, 2025",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=500&fit=crop&auto=format",
    isLive: true,
    isLatest: true,
  },
  {
    id: 2,
    title: "DOST Region 1 Wins Best Regional Office Award",
    excerpt: "The regional office was recognized for excellence in technology commercialization and community engagement.",
    tag: "Award",
    date: "June 24, 2025",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop&auto=format",
    isLive: true,
    isLatest: false,
  },
  {
    id: 3,
    title: "240 Farmers Complete Weather Advisory Training",
    excerpt: "Locally trained beneficiaries can now interpret digital climate warnings and plan their farms better.",
    tag: "Training",
    date: "June 18, 2025",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=500&fit=crop&auto=format",
    isLive: false,
    isLatest: false,
  },
];

const trophies = [
  { id: 1, title: "Best Regional Office 2025", org: "DOST Central Office", date: "June 2025", icon: "🏆", color: "#f6ad55" },
  { id: 2, title: "SARAI Champion Implementer", org: "PhilRice", date: "May 2025", icon: "🌾", color: "#68d391" },
  { id: 3, title: "Top Technology Commercializer", org: "DOST Region 1", date: "April 2025", icon: "💡", color: "#63b3ed" },
];

const attendanceLogs = [
  { name: "Reina Santos", amIn: "7:58 AM", amOut: "12:02 PM", pmIn: "1:01 PM", pmOut: "5:00 PM", status: "Complete" },
  { name: "Marco Dela Cruz", amIn: "8:15 AM", amOut: "12:00 PM", pmIn: "1:05 PM", pmOut: "5:00 PM", status: "Complete" },
  { name: "Liza Ventura", amIn: "7:45 AM", amOut: "12:00 PM", pmIn: "", pmOut: "", status: "Pending" },
  { name: "Jose Ramos", amIn: "", amOut: "", pmIn: "", pmOut: "", status: "Absent" },
];

const statusColor: Record<string, string> = {
  "In Transit": "bg-blue-50 text-blue-700 border-blue-200",
  Received: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Approved: "bg-green-50 text-green-700 border-green-200",
  "For Signature": "bg-amber-50 text-amber-700 border-amber-200",
  Delivered: "bg-gray-50 text-gray-600 border-gray-200",
};

const priorityDot: Record<string, string> = {
  High: "bg-red-400",
  Normal: "bg-amber-400",
  Low: "bg-gray-300",
};

type DocumentItem = (typeof documents)[number];

function Sidebar({ role, current, onNav, onLogout, open, onClose }: { role: UserRole; current: Page; onNav: (page: Page) => void; onLogout: () => void; open: boolean; onClose: () => void }) {
  const nav = role === "admin" ? adminNav : userNav;

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-border bg-[#0f1f14] text-[#e8f5ed] transition-transform duration-300 lg:static lg:z-auto ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-sm font-bold text-emerald-300">S</div>
            <div>
              <div className="text-sm font-semibold">Sarai Ecosystem</div>
              <div className="text-xs text-white/60">DOST Region 1</div>
            </div>
          </div>
        </div>

        <div className="border-b border-white/10 px-6 py-3 text-xs text-white/70">
          {role === "admin" ? <div className="flex items-center gap-2"><Shield size={14} className="text-amber-400" /> Admin Access</div> : <div className="flex items-center gap-2"><User size={14} /> Staff Portal</div>}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {nav.map((item) => (
            <button
              key={item.page}
              onClick={() => {
                onNav(item.page);
                onClose();
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${current === item.page ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-white/10 px-3 py-4">
          <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/70 transition-all hover:bg-red-900/30 hover:text-red-400">
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

function TopBar({ onMenuToggle, userName, role }: { onMenuToggle: () => void; userName: string; role: UserRole }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b border-border bg-white px-4">
      <button onClick={onMenuToggle} className="rounded-md p-1.5 hover:bg-muted lg:hidden">
        <Menu size={20} className="text-foreground" />
      </button>
      <div className="flex-1">
        <p className="text-xs font-mono text-muted-foreground">{dateStr}</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative rounded-md p-1.5 hover:bg-muted">
          <Bell size={18} className="text-muted-foreground" />
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>
        <div className="flex items-center gap-2 border-l border-border pl-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{userName[0]}</div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-foreground">{userName}</p>
            <p className="text-xs capitalize text-muted-foreground">{role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

function LandingPage({ onLogin, newsItems }: { onLogin: () => void; newsItems: NewsItem[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const featuredNews = [...newsItems].filter((item) => item.isLive).sort((a, b) => Number(b.isLatest) - Number(a.isLatest) || b.id - a.id).slice(0, 3);

  const featureHighlights = [
    { title: "WHO WE ARE", description: "Coordinate documents, attendance, and announcements from one calm, consistent workspace." },
    { title: "WHERE WE ARE", description: "Staff and admins each get a tailored portal experience with secure, focused actions." },
    { title: "WHAT WE DO", description: "Share awards, achievements, and project updates through a built-in public news experience." },
  ];

  const workflowSteps = [
    { title: "Explore the portal", detail: "Browse the public landing experience and see what SARAI offers." },
    { title: "Sign in securely", detail: "Choose staff or admin access and move into your personalized workspace." },
    { title: "Track and report", detail: "Monitor documents, attendance, and updates without switching tools." },
  ];

  const moduleCards = [
    { title: "Document Tracker", description: "Route records, approvals, and secure updates with a clean DTS experience.", href: "#", icon: <FileText size={18} /> },
    { title: "Attendance Hub", description: "Log time entries and review daily summaries in a simple, intuitive flow.", href: "#", icon: <Clock size={18} /> },
    { title: "News & Rewards", description: "Keep the community informed with latest announcements, recognitions, and highlights.", href: "#", icon: <Trophy size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(30,107,60,0.16),transparent_35%),linear-gradient(180deg,#fcfdfc_0%,#f6fbf7_100%)]" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <nav className="sticky top-0 z-50 border-b border-border/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-25 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-15 w-15 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm">
              <img src="/BagongPilipinas.png" alt="Bagong Pilipinas logo" className="h-full w-full object-cover" />
            </div>
            <div className="flex h-15 w-15 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm">
              <img src="DOST LOGO GLOBAL.png" alt="DOST Region logo" className="h-full w-full object-cover" />
            </div>
            <div className="flex h-15 w-15 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm">
              <img src="Sarai-IlocosRegion.png" alt="Sarai Ilocos logo" className="h-full w-full object-cover" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">SARAI</div>
              <div className="text-xs text-muted-foreground">Sama-sama sa Agrikultura para sa Reporma At Inobasyon</div>
            </div>
          </div>
          <div className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            {['Home','About', 'Modules', 'News', 'Contact'].map((item) => (
              <a key={item} href={ item === 'Home' ? '#home' : item === 'Modules' ? '#modules' : item === 'About' ? '#about' : item === 'News' ? '#news' : '#contact'} className="transition-colors hover:text-primary">{item}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onLogin} className="rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-white">Sign In</button>
            <button onClick={() => setMenuOpen((v) => !v)} className="rounded-md p-1.5 md:hidden">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="border-t border-border bg-white px-4 pb-4 pt-2 md:hidden">
            {['Home','About', 'Modules', 'News', 'Contact'].map((item) => (
              <a key={item} href={item === 'Modules' ? '#modules' : item === 'About' ? '#about' : item === 'News' ? '#news' : '#contact'} className="block py-2 text-sm text-muted-foreground hover:text-primary">{item}</a>
            ))}
          </div>
        )}
      </nav>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/10 via-white to-emerald-50/80" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-primary shadow-sm">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                DOST Region 1 — Portal
              </div>    
              <h1 className="mb-6 text-4xl font-extrabold leading-[1.1] text-foreground sm:text-5xl lg:text-6xl">
                Sarai Ilocos<br />
                <span className="text-primary">Ecosystem</span>
              </h1>
              <p className="mb-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
                A modern workplace for SARAI Region 1 that brings documents, attendance, and public updates into one polished digital home.
              </p>
              <div className="flex flex-wrap gap-3">
                <button onClick={onLogin} className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-all hover:bg-primary/90">
                  Access Portal <ArrowRight size={16} />
                </button>
                <a href="#about" className="flex items-center gap-2 rounded-lg border border-border bg-white/80 px-6 py-3 font-semibold text-foreground transition-all hover:bg-muted">Learn More</a>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-emerald-100 bg-white/80 p-5 shadow-[0_20px_60px_-20px_rgba(30,107,60,0.25)] backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Portal snapshot</p>
                  <h2 className="mt-1 text-lg font-semibold text-foreground">Today at SARAI</h2>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700">Live</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-primary/10 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary"><Calendar size={16} /> Active activities</div>
                  <div className="mt-3 text-3xl font-bold text-foreground">24</div>
                  <p className="text-xs text-muted-foreground">Projects and initiatives in motion</p>
                </div>
                <div className="rounded-2xl border border-border bg-muted/60 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground"><TrendingUp size={16} /> Engagement</div>
                  <div className="mt-3 text-3xl font-bold text-foreground">98%</div>
                  <p className="text-xs text-muted-foreground">Staff adoption across the ecosystem</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-border bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">Workflow preview</p>
                  <span className="text-xs text-muted-foreground">3 simple steps</span>
                </div>
                <div className="space-y-2">
                  {workflowSteps.map((step, index) => (
                    <div key={step.title} className="flex items-start gap-3 rounded-xl bg-muted/50 px-3 py-2.5">
                      <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">{index + 1}</div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">{step.title}</div>
                        <div className="text-xs leading-5 text-muted-foreground">{step.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4">
          {[
            { label: "Active Staff", value: "120+", icon: <Users size={20} /> },
            { label: "Municipalities Served", value: "148", icon: <MapPin size={20} /> },
            { label: "Documents Processed", value: "3,400+", icon: <FileText size={20} /> },
            { label: "Projects Running", value: "24", icon: <TrendingUp size={20} /> },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <div className="text-white/70">{stat.icon}</div>
              <div>
                <div className="text-2xl font-extrabold text-white">{stat.value}</div>
                <div className="text-xs text-white/70">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">Why SARAI works</div>
            <h2 className="text-3xl font-bold text-foreground">A calmer way to manage public-facing operations</h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {featureHighlights.map((item) => (
            <article key={item.title} className="rounded-[1.35rem] border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">

              <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="modules" className="bg-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">Portal modules</div>
              <h2 className="text-3xl font-bold text-foreground">Everything visitors and staff need in one place</h2>
            </div>
            <button onClick={onLogin} className="hidden items-center gap-2 text-sm font-semibold text-primary hover:underline sm:flex">Open portal <ArrowRight size={14} /></button>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {moduleCards.map((card) => (
              <article key={card.title} className="rounded-[1.4rem] border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">{card.icon}</div>
                <h3 className="text-lg font-semibold text-foreground">{card.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{card.description}</p>
                <button onClick={onLogin} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Go to module <ChevronRight size={14} /></button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="news" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">Latest updates</div>
            <h2 className="text-3xl font-bold text-foreground">News & announcements</h2>
          </div>
          <button onClick={onLogin} className="hidden items-center gap-2 text-sm font-semibold text-primary hover:underline sm:flex">View all <ArrowRight size={14} /></button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredNews.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-[1.25rem] border border-border bg-white transition-shadow hover:shadow-md">
              <div className="h-44 overflow-hidden bg-muted">
                <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
              </div>
              <div className="p-5">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{item.tag}</span>
                  {item.isLatest && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700">Latest</span>}
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                </div>
                <h3 className="mb-2 text-sm font-bold leading-snug text-foreground">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary">Get in touch</div>
            <h2 className="mb-6 text-3xl font-bold text-foreground">DOST Region 1 offices</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-3"><MapPin size={16} className="mt-0.5 text-primary" /> DOST Complex, Sevilla, City of San Fernando, La Union</div>
              <div className="flex items-start gap-3"><Phone size={16} className="mt-0.5 text-primary" /> (072) 700-0014 / (072) 607-7834</div>
              <div className="flex items-start gap-3"><Mail size={16} className="mt-0.5 text-primary" /> ro1@dost.gov.ph</div>
              <div className="flex items-start gap-3"><Globe size={16} className="mt-0.5 text-primary" /> region1.dost.gov.ph</div>
            </div>
          </div>
          <div className="rounded-3xl bg-primary p-8 text-white">
            <h3 className="mb-2 text-xl font-bold">Ready to access the portal?</h3>
            <p className="mb-6 text-sm text-white/80">Sign in with your DOST credentials to access your workspace and track your team&apos;s activities.</p>
            <button onClick={onLogin} className="w-full rounded-lg bg-white px-4 py-3 font-semibold text-primary transition-all hover:bg-gray-50">Sign In to Portal</button>
          </div>
        </div>
      </section>

      <footer className="bg-foreground py-8 text-white/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-xs sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">Sarai Ecosystem © 2025 · DOST Region 1 · Republic of the Philippines</div>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-white">Privacy Policy</a>
            <a href="#" className="transition-colors hover:text-white">Terms of Use</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LoginPage({ onBack, onLoginUser, onLoginAdmin }: { onBack: () => void; onLoginUser: (name: string) => void; onLoginAdmin: (name: string) => void }) {
  const [mode, setMode] = useState<"user" | "admin">("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const name = email.split("@")[0].replace(".", " ").replace(/\b\w/g, (c) => c.toUpperCase());
      if (mode === "admin") onLoginAdmin(name);
      else onLoginUser(name);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/30" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <div className="bg-primary px-6 py-4">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-white/80 transition-colors hover:text-white">← Back to Home</button>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-lg">
            <div className="border-b border-border p-8 pb-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-extrabold text-white">S</div>
                <div>
                  <div className="font-bold text-foreground">Sarai Ecosystem</div>
                  <div className="text-xs text-muted-foreground">DOST Region 1 Portal</div>
                </div>
              </div>
              <div className="flex gap-1 rounded-lg bg-muted p-1">
                <button onClick={() => setMode("user")} className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-semibold transition-all ${mode === "user" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}><User size={15} /> Staff Login</button>
                <button onClick={() => setMode("admin")} className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-semibold transition-all ${mode === "admin" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}><Shield size={15} /> Admin Login</button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 p-8">
              {mode === "admin" && <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700"><AlertCircle size={14} /> Admin access is restricted to authorized DOST personnel.</div>}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">{mode === "admin" ? "Admin Email" : "DOST Email Address"}</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={mode === "admin" ? "admin@dost.gov.ph" : "yourname@dost.gov.ph"} className="w-full rounded-lg border border-border bg-input-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">Password</label>
                <div className="relative">
                  <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-lg border border-border bg-input-background px-3 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground">{showPw ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                </div>
              </div>
              {error && <div className="flex items-center gap-2 text-xs text-red-600"><AlertCircle size={13} /> {error}</div>}
              <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-white transition-all hover:bg-primary/90 disabled:opacity-60">
                {loading ? <><RefreshCw size={16} className="animate-spin" /> Signing in...</> : mode === "admin" ? <><Shield size={16} /> Sign in as Admin</> : <><User size={16} /> Sign In</>}
              </button>
            </form>
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">Protected by DOST Region 1 Security Policy · 2025</p>
        </div>
      </div>
    </div>
  );
}

function UserDashboard({ userName, newsItems, onNewsItemsChange }: { userName: string; newsItems: NewsItem[]; onNewsItemsChange: (items: NewsItem[]) => void }) {
  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";
  const liveNews = [...newsItems].filter((item) => item.isLive).sort((a, b) => Number(b.isLatest) - Number(a.isLatest) || b.id - a.id).slice(0, 3);

  const toggleLive = (id: number) => {
    onNewsItemsChange(newsItems.map((entry) => entry.id === id ? { ...entry, isLive: !entry.isLive } : entry));
  };

  const toggleLatest = (id: number) => {
    onNewsItemsChange(newsItems.map((entry) => ({ ...entry, isLatest: entry.id === id })));
  };

  return (
    <div className="space-y-6 p-6">
      <div className="rounded-xl bg-linear-to-r from-primary to-emerald-600 p-6 text-white">
        <p className="text-sm text-white/80">{greeting},</p>
        <h2 className="mb-1 text-2xl font-bold">{userName} 👋</h2>
        <p className="text-xs text-white/70">You have 3 pending documents and your attendance is complete for today.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Documents Pending", value: "3", icon: <FileText size={18} />, color: "text-amber-600 bg-amber-50" },
          { label: "Today's Attendance", value: "AM ✓", icon: <Clock size={18} />, color: "text-emerald-600 bg-emerald-50" },
          { label: "My Filed Docs", value: "12", icon: <FolderOpen size={18} />, color: "text-blue-600 bg-blue-50" },
          { label: "Announcements", value: "4", icon: <Bell size={18} />, color: "text-purple-600 bg-purple-50" },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-border bg-white p-4">
            <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${item.color}`}>{item.icon}</div>
            <div className="text-xl font-bold text-foreground">{item.value}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">{item.label}</div>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="overflow-hidden rounded-xl border border-border bg-white lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold text-foreground">Recent Documents</h3>
            <span className="text-xs font-semibold text-primary">View DTS →</span>
          </div>
          <div className="divide-y divide-border">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/30">
                <div className={`h-1.5 w-1.5 shrink-0 rounded-full ${priorityDot[doc.priority]}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-foreground">{doc.subject}</p>
                  <p className="font-mono text-xs text-muted-foreground">{doc.id} · {doc.date}</p>
                </div>
                <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusColor[doc.status]}`}>{doc.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Live News Controls</h3>
                <p className="text-xs text-muted-foreground">Keep the latest updates visible to staff.</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700">Live</span>
            </div>
            <div className="space-y-2">
              {liveNews.map((item) => (
                <div key={item.id} className="rounded-lg border border-border bg-muted/40 p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="text-[11px] text-muted-foreground">{item.date}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => toggleLive(item.id)} className={`rounded-full px-2 py-1 text-[10px] font-semibold ${item.isLive ? "bg-emerald-600 text-white" : "bg-white text-muted-foreground"}`}>
                        {item.isLive ? "Live" : "Draft"}
                      </button>
                      <button onClick={() => toggleLatest(item.id)} className={`rounded-full px-2 py-1 text-[10px] font-semibold ${item.isLatest ? "bg-primary text-white" : "bg-white text-muted-foreground"}`}>
                        {item.isLatest ? "Latest" : "Pin"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-white p-5">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: "Log Attendance", icon: <Clock size={15} /> },
                { label: "New Document", icon: <Plus size={15} /> },
                { label: "View Announcements", icon: <Bell size={15} /> },
                { label: "Download Reports", icon: <Download size={15} /> },
              ].map((action) => (
                <button key={action.label} className="flex w-full items-center gap-2.5 rounded-lg border border-border px-3 py-2.5 text-sm text-foreground transition-all hover:border-primary hover:bg-primary hover:text-white group">
                  <span className="text-primary transition-colors group-hover:text-white">{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-xl bg-primary p-5 text-white">
            <div className="mb-3 flex items-center gap-2"><Calendar size={16} /> <span className="text-sm font-semibold">Upcoming</span></div>
            <div className="space-y-2 text-xs text-white/80">
              <div className="flex items-start gap-2"><span className="rounded bg-white/10 px-1.5 py-0.5 font-mono">Jul 1</span><span>National Science Month Opening</span></div>
              <div className="flex items-start gap-2"><span className="rounded bg-white/10 px-1.5 py-0.5 font-mono">Jul 3</span><span>SARAI Q3 Progress Review</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard({ userName, newsItems, onNewsItemsChange }: { userName: string; newsItems: NewsItem[]; onNewsItemsChange: (items: NewsItem[]) => void }) {
  const liveNews = [...newsItems].filter((item) => item.isLive).sort((a, b) => Number(b.isLatest) - Number(a.isLatest) || b.id - a.id).slice(0, 4);

  const toggleLive = (id: number) => {
    onNewsItemsChange(newsItems.map((entry) => entry.id === id ? { ...entry, isLive: !entry.isLive } : entry));
  };

  const toggleLatest = (id: number) => {
    onNewsItemsChange(newsItems.map((entry) => ({ ...entry, isLatest: entry.id === id })));
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2"><Shield size={18} className="text-amber-500" /><span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">Admin Console</span></div>
          <h2 className="text-xl font-bold text-foreground">System Overview</h2>
          <p className="text-sm text-muted-foreground">Welcome back, {userName}. Here&apos;s the status of the Sarai Ecosystem today.</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Staff", value: "120", change: "+3 this month", positive: true, icon: <Users size={18} /> },
          { label: "Docs in Queue", value: "18", change: "6 pending action", positive: false, icon: <FileText size={18} /> },
          { label: "Present Today", value: "98", change: "81.7% attendance", positive: true, icon: <Check size={18} /> },
          { label: "System Alerts", value: "2", change: "Needs attention", positive: false, icon: <AlertCircle size={18} /> },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-border bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-muted-foreground">{item.icon}</div>
              <span className={`text-[10px] font-mono ${item.positive ? "text-emerald-600" : "text-amber-600"}`}>{item.change}</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{item.value}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">{item.label}</div>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-border bg-white">
          <div className="border-b border-border px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Latest News Manager</h3>
                <p className="text-xs text-muted-foreground">Publish the newest updates and keep them live.</p>
              </div>
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-700">Admin</span>
            </div>
          </div>
          <div className="space-y-3 p-5">
            {liveNews.map((item) => (
              <div key={item.id} className="rounded-lg border border-border bg-muted/40 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{item.excerpt}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button onClick={() => toggleLive(item.id)} className={`rounded-full px-2 py-1 text-[10px] font-semibold ${item.isLive ? "bg-emerald-600 text-white" : "bg-white text-muted-foreground"}`}>
                      {item.isLive ? "Live" : "Draft"}
                    </button>
                    <button onClick={() => toggleLatest(item.id)} className={`rounded-full px-2 py-1 text-[10px] font-semibold ${item.isLatest ? "bg-primary text-white" : "bg-white text-muted-foreground"}`}>
                      {item.isLatest ? "Latest" : "Pin"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-border bg-white">
          <div className="border-b border-border px-5 py-4"><h3 className="text-sm font-semibold text-foreground">Today&apos;s Attendance Summary</h3></div>
          <div className="divide-y divide-border">
            {attendanceLogs.map((log, index) => (
              <div key={index} className="flex items-center gap-3 px-5 py-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{log.name[0]}</div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-foreground">{log.name}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">{log.amIn ? `AM: ${log.amIn}` : "—"} · {log.pmIn ? `PM: ${log.pmIn}` : "—"}</p>
                </div>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${log.status === "Complete" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : log.status === "Pending" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-red-200 bg-red-50 text-red-700"}`}>{log.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-border bg-white">
          <div className="border-b border-border px-5 py-4"><h3 className="text-sm font-semibold text-foreground">Document Pipeline</h3></div>
          <div className="space-y-3 p-5">
            {[
              { label: "In Transit", count: 6, total: 18, color: "bg-blue-500" },
              { label: "For Signature", count: 4, total: 18, color: "bg-amber-500" },
              { label: "Approved", count: 5, total: 18, color: "bg-emerald-500" },
              { label: "Delivered", count: 3, total: 18, color: "bg-gray-400" },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-mono font-semibold text-foreground">{item.count}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${(item.count / item.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DTSPage({ role }: { role: UserRole }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [documentsList, setDocumentsList] = useState<DocumentItem[]>(documents);
  const [showNewDocModal, setShowNewDocModal] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDocForm, setEditDocForm] = useState({
    id: "",
    subject: "",
    from: "",
    to: "",
    date: "",
    status: "In Transit" as DocumentItem["status"],
    priority: "Normal" as DocumentItem["priority"],
  });
  const [newDocForm, setNewDocForm] = useState({
    type: "",
    subject: "",
    from: "",
    to: "",
    date: new Date().toISOString().slice(0, 10),
    status: "In Transit" as DocumentItem["status"],
    priority: "Normal" as DocumentItem["priority"],
  });
  const statuses = ["All", "In Transit", "Received", "Approved", "For Signature", "Delivered"];

  const filtered = documentsList.filter((doc) => {
    const matchSearch = doc.subject.toLowerCase().includes(search.toLowerCase()) || doc.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || doc.status === filter;
    return matchSearch && matchFilter;
  });

  const handleCreateDocument = (event: FormEvent) => {
    event.preventDefault();

    if (!newDocForm.type.trim() || !newDocForm.subject.trim() || !newDocForm.from.trim() || !newDocForm.to.trim()) {
      return;
    }

    const createdDoc: DocumentItem = {
      id: newDocForm.type.trim(),
      subject: newDocForm.subject.trim(),
      from: newDocForm.from.trim(),
      to: newDocForm.to.trim(),
      date: newDocForm.date,
      status: newDocForm.status,
      priority: newDocForm.priority,
    };

    setDocumentsList((prev) => [createdDoc, ...prev]);
    setShowNewDocModal(false);
    setNewDocForm({
      type: "",
      subject: "",
      from: "",
      to: "",
      date: new Date().toISOString().slice(0, 10),
      status: "In Transit",
      priority: "Normal",
    });
  };

  const handleOpenEdit = (doc: DocumentItem) => {
    setEditDocForm({ ...doc });
    setEditingDocId(doc.id);
    setShowEditModal(true);
    setOpenActionMenuId(null);
  };

  const handleSaveEdit = (e: FormEvent) => {
    e.preventDefault();
    if (!editingDocId) return;
    setDocumentsList((prev) => prev.map((d) => (d.id === editingDocId ? ({
      id: editDocForm.id,
      subject: editDocForm.subject,
      from: editDocForm.from,
      to: editDocForm.to,
      date: editDocForm.date,
      status: editDocForm.status,
      priority: editDocForm.priority,
    } as DocumentItem) : d)));
    setShowEditModal(false);
    setEditingDocId(null);
    setOpenActionMenuId(null);
  };

  const handleDelete = (id: string) => {
    const ok = confirm("Delete this document? This action cannot be undone.");
    if (!ok) return;
    setDocumentsList((prev) => prev.filter((d) => d.id !== id));
    setOpenActionMenuId(null);
  };

  const handlePrint = (doc: DocumentItem) => {
    const w = window.open("", "_blank", "noopener,noreferrer");
    if (!w) return;
    const html = `
      <html>
        <head>
          <title>Print - ${doc.id}</title>
          <style>body{font-family:Arial,Helvetica,sans-serif;padding:20px;color:#111} .meta{margin:8px 0;}</style>
        </head>
        <body>
          <h1>${doc.subject}</h1>
          <div class="meta"><strong>ID:</strong> ${doc.id}</div>
          <div class="meta"><strong>From:</strong> ${doc.from}</div>
          <div class="meta"><strong>To:</strong> ${doc.to}</div>
          <div class="meta"><strong>Date:</strong> ${doc.date}</div>
          <div class="meta"><strong>Status:</strong> ${doc.status}</div>
          <div class="meta"><strong>Priority:</strong> ${doc.priority}</div>
          <hr />
          <p>Printed from Sarai Portal</p>
          <script>window.onload = function(){ setTimeout(() => { window.print(); }, 100); };</script>
        </body>
      </html>
    `;
    w.document.open();
    w.document.write(html);
    w.document.close();
    setOpenActionMenuId(null);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Document Tracking System</h2>
          <p className="text-sm text-muted-foreground">Monitor and trace all official documents across divisions.</p>
        </div>
        {role === "admin" && <button onClick={() => setShowNewDocModal(true)} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary/90"><Plus size={15} /> New Document</button>}
      </div>
      <div className="rounded-xl border border-border bg-white p-4">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-input-background px-3 py-2">
          <Search size={15} className="shrink-0 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by document title or ID..." className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {statuses.map((status) => (
            <button key={status} onClick={() => setFilter(status)} className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all ${filter === status ? "border-primary bg-primary text-white" : "border-transparent bg-muted text-muted-foreground hover:border-border"}`}>{status}</button>
          ))}
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <div className="grid grid-cols-12 gap-4 border-b border-border bg-muted/30 px-5 py-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          <div className="col-span-2">Type of Document</div>
          <div className="col-span-3">DESCRIPTION OF DOCUMENT</div>
          <div className="col-span-2 hidden lg:block">From → To</div>
          <div className="col-span-2 hidden md:block">Date</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1 text-right">Action</div>
        </div>
        <div className="divide-y divide-border">

          {filtered.map((doc) => (
            <div key={doc.id} className="relative grid grid-cols-12 items-center gap-4 px-5 py-3.5 transition-colors hover:bg-muted/20">
              <div className="col-span-2"><div className="flex items-center gap-2"><div className={`h-1.5 w-1.5 shrink-0 rounded-full ${priorityDot[doc.priority]}`} /><span className="font-mono text-xs font-semibold text-primary">{doc.id}</span></div></div>
              <div className="col-span-3 min-w-0"><p className="truncate text-sm font-semibold text-foreground">{doc.subject}</p></div>
              <div className="col-span-2 hidden lg:block text-xs text-muted-foreground"><p className="truncate">{doc.from}</p><p className="truncate text-primary/70">→ {doc.to}</p></div>
              <div className="col-span-2 hidden md:block text-xs font-mono text-muted-foreground">{doc.date}</div>
              <div className="col-span-2"><span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusColor[doc.status]}`}>{doc.status}</span></div>
              <div className="col-span-1 flex justify-end">
                <div className="relative">
                  <button onClick={() => setOpenActionMenuId(openActionMenuId === doc.id ? null : doc.id)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-white text-xl leading-none text-foreground transition-all hover:border-primary hover:text-primary" aria-label="More options">
                    <span className="translate-y-[-1px]">⋯</span>
                  </button>
                  {openActionMenuId === doc.id && (
                    <div className="absolute right-0 z-10 mt-2 w-40 rounded-lg border border-border bg-white p-1 shadow-lg">
                      <button onClick={() => handleOpenEdit(doc)} className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-foreground hover:bg-muted">Edit</button>
                      <button onClick={() => handleDelete(doc.id)} className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-foreground hover:bg-muted">Delete</button>
                      <button onClick={() => handlePrint(doc)} className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-foreground hover:bg-muted">Print</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showNewDocModal && (
        
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-xl rounded-2xl border border-border bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Add New Document</h3>
                <p className="mt-1 text-sm text-muted-foreground">Create a new document entry for the tracking system.</p>
              </div>
              <button onClick={() => setShowNewDocModal(false)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Type of Document</label>
                  <input value={newDocForm.type} onChange={(e) => setNewDocForm((prev) => ({ ...prev, type: e.target.value }))} required className="w-full rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Memo, Report, Letter..." />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Date</label>
                  <input type="date" value={newDocForm.date} onChange={(e) => setNewDocForm((prev) => ({ ...prev, date: e.target.value }))} required className="w-full rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Description of Document</label>
                <input value={newDocForm.subject} onChange={(e) => setNewDocForm((prev) => ({ ...prev, subject: e.target.value }))} required className="w-full rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter the document subject" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">From</label>
                  <input value={newDocForm.from} onChange={(e) => setNewDocForm((prev) => ({ ...prev, from: e.target.value }))} required className="w-full rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Office or unit" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">To</label>
                  <input value={newDocForm.to} onChange={(e) => setNewDocForm((prev) => ({ ...prev, to: e.target.value }))} required className="w-full rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Recipient" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</label>
                  <select value={newDocForm.status} onChange={(e) => setNewDocForm((prev) => ({ ...prev, status: e.target.value as DocumentItem["status"] }))} className="w-full rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="In Transit">In Transit</option>
                    <option value="Received">Received</option>
                    <option value="Approved">Approved</option>
                    <option value="For Signature">For Signature</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Priority</label>
                  <select value={newDocForm.priority} onChange={(e) => setNewDocForm((prev) => ({ ...prev, priority: e.target.value as DocumentItem["priority"] }))} className="w-full rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="High">High</option>
                    <option value="Normal">Normal</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowNewDocModal(false)} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-muted-foreground">Cancel</button>
                <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Save Document</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-xl rounded-2xl border border-border bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Edit Document</h3>
                <p className="mt-1 text-sm text-muted-foreground">Update the document fields then save.</p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Type / ID</label>
                  <input value={editDocForm.id} onChange={(e) => setEditDocForm((p) => ({ ...p, id: e.target.value }))} required className="w-full rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Date</label>
                  <input type="date" value={editDocForm.date} onChange={(e) => setEditDocForm((p) => ({ ...p, date: e.target.value }))} required className="w-full rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Description</label>
                <input value={editDocForm.subject} onChange={(e) => setEditDocForm((p) => ({ ...p, subject: e.target.value }))} required className="w-full rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">From</label>
                  <input value={editDocForm.from} onChange={(e) => setEditDocForm((p) => ({ ...p, from: e.target.value }))} required className="w-full rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">To</label>
                  <input value={editDocForm.to} onChange={(e) => setEditDocForm((p) => ({ ...p, to: e.target.value }))} required className="w-full rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</label>
                  <select value={editDocForm.status} onChange={(e) => setEditDocForm((p) => ({ ...p, status: e.target.value as DocumentItem["status"] }))} className="w-full rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="In Transit">In Transit</option>
                    <option value="Received">Received</option>
                    <option value="Approved">Approved</option>
                    <option value="For Signature">For Signature</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Priority</label>
                  <select value={editDocForm.priority} onChange={(e) => setEditDocForm((p) => ({ ...p, priority: e.target.value as DocumentItem["priority"] }))} className="w-full rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="High">High</option>
                    <option value="Normal">Normal</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowEditModal(false)} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-muted-foreground">Cancel</button>
                <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AttendancePage({ userName }: { userName: string }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState(userName || "SARAI Staff");
  const [department, setDepartment] = useState("SARAI");
  const [actionType, setActionType] = useState("Sign In");
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState(false);
  const [attendanceLogs, setAttendanceLogs] = useState([
    { id: "SARAI-001", name: "Dr. Maria Santos", dept: "SARAI", time: "08:15 AM", date: "June 17, 2026", type: "Sign In", status: "On Desk", photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150" },
    { id: "SARAI-002", name: "Engr. Juan Dela Cruz", dept: "CEST", time: "08:30 AM", date: "June 17, 2026", type: "Sign In", status: "On Desk", photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150" },
    { id: "SARAI-003", name: "Clarissa Ramirez", dept: "OJT", time: "09:02 AM", date: "June 17, 2026", type: "Sign In", status: "On Desk", photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150" },
    { id: "SARAI-004", name: "Arnel Bautista", dept: "OTHERS", time: "05:00 PM", date: "June 16, 2026", type: "Sign Out", status: "Left Desk", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" },
  ]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const resetForm = () => {
    setEmployeeId("");
    setEmployeeName(userName || "");
    setCapturedPhoto(null);
    setCurrentStep(1);
    setCameraError(false);
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  const handleStartProcess = async (action: string) => {
    setActionType(action);
    if (!employeeId || !employeeName) {
      alert("Please enter Employee ID and Name");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraStream(stream);
      setCameraError(false);
      setCurrentStep(2);
    } catch (err) {
      console.warn("Camera start failed", err);
      setCameraError(true);
      setCameraStream(null);
      setCurrentStep(2);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas && video.videoWidth) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/png");
        setCapturedPhoto(dataUrl);
        stopCamera();
        setCurrentStep(3);
        return;
      }
    }

    setCapturedPhoto("https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop");
    setCurrentStep(3);
  };

  const handleSubmitAttendance = () => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const date = now.toLocaleDateString([], { year: "numeric", month: "long", day: "numeric" });
    const isCheckIn = ["Sign In", "AM IN", "PM IN"].includes(actionType);

    const newLog = {
      id: employeeId || `SARAI-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      name: employeeName || "Unknown",
      dept: department,
      time,
      date,
      type: actionType,
      status: isCheckIn ? "On Desk" : "Left Desk",
      photo: capturedPhoto || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    };

    setAttendanceLogs((prev) => [newLog, ...prev]);
    setCurrentStep(4);
    setCapturedPhoto(null);
  };

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  const filteredLogs = attendanceLogs.filter((log) => {
    const matchesSearch = log.name.toLowerCase().includes(searchQuery.toLowerCase()) || log.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = filterDept === "All" || log.dept === filterDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] p-6">
      <div className="rounded-4xl border border-emerald-100 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">Attendance Hub</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">Camera-verified desk check-in</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Run the SARAI attendance workflow with clear steps, photo validation, and a live log directory.</p>
          </div>
          <div className="rounded-3xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">Active workflow step {currentStep} of 4</div>
        </div>

        <div className="rounded-4xl border border-slate-200 bg-slate-50 p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Step {currentStep}
            </div>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{actionType}</div>
          </div>

          <div className="space-y-4">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm text-slate-800">
                    Employee / ID Number
                    <input
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                      placeholder="e.g. SARAI-2026-085"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                    />
                  </label>
                  <label className="space-y-2 text-sm text-slate-800">
                    Full Name
                    <input
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                      placeholder="e.g. Dr. Maria Santos"
                      value={employeeName}
                      onChange={(e) => setEmployeeName(e.target.value)}
                    />
                  </label>
                </div>

                <label className="space-y-2 text-sm text-slate-800">
                  Station / Department
                  <select
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option value="SARAI">SARAI</option>
                    <option value="CEST">CEST</option>
                    <option value="OJT">OJT</option>
                    <option value="OTHERS">OTHERS</option>
                    <option value="Administration">Administration</option>
                  </select>
                </label>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    { action: "AM IN", label: "Morning Arrival", tone: "bg-amber-500 text-white" },
                    { action: "AM OUT", label: "Lunch Break", tone: "bg-violet-500 text-white" },
                    { action: "PM IN", label: "Afternoon Return", tone: "bg-emerald-500 text-white" },
                    { action: "PM OUT", label: "End of Day", tone: "bg-sky-500 text-white" },
                  ].map((option) => (
                    <button
                      key={option.action}
                      type="button"
                      onClick={() => handleStartProcess(option.action)}
                      className={`rounded-3xl px-4 py-5 text-left font-semibold shadow-sm transition hover:scale-[1.01] ${option.tone}`}
                    >
                      <span className="block text-sm opacity-90">{option.label}</span>
                      <span className="mt-3 block text-xl">{option.action}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white p-5">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Camera Verification</p>
                    <p className="mt-1 text-sm text-slate-600">Position yourself at your desk and capture a quick verification photo.</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${["AM IN", "PM IN"].includes(actionType) ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"}`}>
                    {actionType}
                  </span>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-900 p-3">
                  {cameraError ? (
                    <div className="flex min-h-65 flex-col items-center justify-center gap-3 rounded-3xl bg-slate-800 p-6 text-center text-slate-200">
                      <div className="text-4xl">📷</div>
                      <p className="text-sm font-semibold">Camera unavailable</p>
                      <p className="max-w-md text-xs text-slate-400">Please allow the browser to access your camera or continue with the fallback capture.</p>
                    </div>
                  ) : (
                    <div className="relative overflow-hidden rounded-3xl bg-black">
                      <video ref={videoRef} autoPlay playsInline muted className="h-65 w-full object-cover" />
                      <div className="pointer-events-none absolute inset-0 border border-dashed border-slate-300/40"></div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button type="button" onClick={() => { stopCamera(); setCurrentStep(1); }} className="rounded-3xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                    ← Back to Details
                  </button>
                  <button type="button" onClick={capturePhoto} className="rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
                    📸 Take Desk Photo
                  </button>
                </div>
                <canvas ref={canvasRef} style={{ display: "none" }} />
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm font-semibold text-slate-900">Confirm Attendance Entry</p>
                  <p className="mt-2 text-sm text-slate-600">Review your desk capture and details before final submission.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-[260px_1fr]">
                  <div className="rounded-3xl overflow-hidden border border-slate-200 bg-white">
                    <img src={capturedPhoto ?? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop"} alt="Desk capture" className="h-full w-full object-cover" />
                    <div className="bg-slate-900 px-3 py-2 text-center text-xs text-slate-200">Desk Capture • Approved Verification</div>
                  </div>
                  <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1 text-sm">
                        <p className="font-semibold text-slate-900">Name</p>
                        <p className="text-slate-600">{employeeName || "—"}</p>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="font-semibold text-slate-900">ID Number</p>
                        <p className="text-slate-600">{employeeId || "—"}</p>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="font-semibold text-slate-900">Department</p>
                        <p className="text-slate-600">{department}</p>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="font-semibold text-slate-900">Action</p>
                        <p className="text-slate-600">{actionType}</p>
                      </div>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
                      Tip: confirm the employee details before submitting. The desk photo helps validate physical presence.
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button type="button" onClick={() => { setCapturedPhoto(null); setCurrentStep(1); }} className="rounded-3xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                    Start Over
                  </button>
                  <button type="button" onClick={handleSubmitAttendance} className="rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
                    ✓ Submit {actionType}
                  </button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6 rounded-3xl border border-emerald-100 bg-emerald-50 p-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-700">✓</div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Success</p>
                  <h3 className="mt-4 text-2xl font-semibold text-slate-900">{actionType} Recorded Successfully!</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Thank you, {employeeName || "team member"}. Your attendance has been logged into the SARAI system.</p>
                </div>
                <div className="rounded-3xl bg-white p-5 text-left text-sm text-slate-700">
                  <p className="font-semibold">Desk health reminder</p>
                  <ul className="mt-3 space-y-2 text-slate-600">
                    <li>• Keep your desk view aligned with the camera.</li>
                    <li>• Take short breaks to rest your eyes every hour.</li>
                    <li>• Keep water nearby for better focus.</li>
                  </ul>
                </div>
                <button type="button" onClick={resetForm} className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                  Return to Attendance Hub
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-4xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Active Attendance Logs</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900">Live station feed</h3>
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">{filteredLogs.length} entries</div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[1.1fr_0.9fr]">
            <input
              type="text"
              placeholder="Search name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            >
              <option value="All">All Stations</option>
              <option value="SARAI">SARAI</option>
              <option value="CEST">CEST</option>
              <option value="OJT">OJT</option>
              <option value="OTHERS">OTHERS</option>
              <option value="Administration">Administration</option>
            </select>
          </div>
        </div>

        <div className="rounded-4xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            {filteredLogs.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
                <p className="text-xl">🔍</p>
                <p className="mt-3 text-sm">No attendance entries match your search.</p>
              </div>
            ) : (
              filteredLogs.map((log, index) => (
                <div key={index} className="rounded-3xl border border-slate-200 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
                      <img src={log.photo} alt={log.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-semibold text-slate-900">{log.name}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span>{log.id}</span>
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-300" />
                        <span>{log.dept}</span>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-semibold text-slate-900">{log.time}</p>
                      <p className="text-slate-500">{log.date}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                    <span className={`rounded-full px-3 py-1 ${log.type.includes("Sign In") ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"}`}>
                      {log.type}
                    </span>
                    <span className={`rounded-full px-3 py-1 ${log.status === "On Desk" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>
                      {log.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TrophiesPage({ newsItems, onNewsItemsChange, role }: { newsItems: NewsItem[]; onNewsItemsChange: (items: NewsItem[]) => void; role: UserRole }) {
  const [tab, setTab] = useState<"news" | "achievements">("news");
  const [showComposer, setShowComposer] = useState(false);
  const [draft, setDraft] = useState({
    title: "",
    excerpt: "",
    tag: "Announcement",
    image: "",
    date: new Date().toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" }),
  });
  const orderedNews = [...newsItems].sort((a, b) => Number(b.isLatest) - Number(a.isLatest) || Number(b.isLive) - Number(a.isLive) || b.id - a.id);

  const toggleLive = (id: number) => {
    onNewsItemsChange(newsItems.map((entry) => entry.id === id ? { ...entry, isLive: !entry.isLive } : entry));
  };

  const toggleLatest = (id: number) => {
    onNewsItemsChange(newsItems.map((entry) => ({ ...entry, isLatest: entry.id === id })));
  };

  const handleCreateNews = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.title.trim() || !draft.excerpt.trim()) return;

    const created: NewsItem = {
      id: Date.now(),
      title: draft.title.trim(),
      excerpt: draft.excerpt.trim(),
      tag: draft.tag.trim() || "Announcement",
      date: draft.date || new Date().toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" }),
      image: draft.image.trim() || "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=500&fit=crop&auto=format",
      isLive: true,
      isLatest: true,
    };

    onNewsItemsChange([created, ...newsItems.map((item) => ({ ...item, isLatest: false }))]);
    setDraft({ title: "", excerpt: "", tag: "Announcement", image: "", date: new Date().toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" }) });
    setShowComposer(false);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">News & Achievements</h2>
        <p className="text-sm text-muted-foreground">Latest updates, announcements, and recognition for the SARAI ecosystem.</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex w-fit gap-1 rounded-xl bg-muted/60 p-1">
          {(["news", "achievements"] as const).map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`rounded-lg px-5 py-2 text-sm font-semibold capitalize transition-all ${tab === item ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              {item === "achievements" ? "🏆 Trophies" : "📰 News"}
            </button>
          ))}
        </div>
        {tab === "news" && (
          <button onClick={() => setShowComposer((value) => !value)} className="rounded-lg border border-primary/20 bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
            {showComposer ? "Close controls" : role === "admin" ? "Manage news" : "View news"}
          </button>
        )}
      </div>

      {tab === "news" ? (
        <div className="space-y-4">
          {showComposer && (
            <form onSubmit={handleCreateNews} className="rounded-2xl border border-border bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Publish a latest update</h3>
                  <p className="text-xs text-muted-foreground">New stories appear instantly as latest and live.</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700">Live feed</span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <input value={draft.title} onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))} placeholder="Headline" className="rounded-lg border border-border bg-input-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                <input value={draft.tag} onChange={(e) => setDraft((prev) => ({ ...prev, tag: e.target.value }))} placeholder="Tag" className="rounded-lg border border-border bg-input-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                <input value={draft.date} onChange={(e) => setDraft((prev) => ({ ...prev, date: e.target.value }))} placeholder="Date" className="rounded-lg border border-border bg-input-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                <input value={draft.image} onChange={(e) => setDraft((prev) => ({ ...prev, image: e.target.value }))} placeholder="Image URL" className="rounded-lg border border-border bg-input-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <textarea value={draft.excerpt} onChange={(e) => setDraft((prev) => ({ ...prev, excerpt: e.target.value }))} placeholder="Short summary" className="mt-3 min-h-24 w-full rounded-lg border border-border bg-input-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Publish</button>
                <button type="button" onClick={() => setShowComposer(false)} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground">Cancel</button>
              </div>
            </form>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            {orderedNews.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-xl border border-border bg-white transition-shadow hover:shadow-md">
                <div className="h-52 overflow-hidden bg-muted">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                </div>
                <div className="p-5">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{item.tag}</span>
                    {item.isLatest && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700">Latest</span>}
                    {!item.isLive && <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Draft</span>}
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                  </div>
                  <h3 className="mb-3 font-bold leading-snug text-foreground">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.excerpt}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button onClick={() => toggleLive(item.id)} className={`rounded-full px-3 py-1 text-xs font-semibold ${item.isLive ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"}`}>
                      {item.isLive ? "Set draft" : "Go live"}
                    </button>
                    <button onClick={() => toggleLatest(item.id)} className={`rounded-full px-3 py-1 text-xs font-semibold ${item.isLatest ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                      {item.isLatest ? "Currently latest" : "Make latest"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trophies.map((item) => (
              <div key={item.id} className="flex items-start gap-4 rounded-xl border border-border bg-white p-5 transition-shadow hover:shadow-md">
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
            <div className="mb-4 text-5xl">🏆</div>
            <h3 className="mb-2 text-2xl font-extrabold">Best Regional Office 2025</h3>
            <p className="mx-auto max-w-md text-sm text-white/80">DOST Region 1 recognized as the Best Regional Office for outstanding performance in technology transfer, community engagement, and innovation in public service.</p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
              <Trophy size={14} /> Awarded by DOST Central Office · June 2025
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PortalQuerySync({ onSync }: { onSync: (portal: string | null, name: string) => void }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) return;
    const portal = searchParams.get("portal");
    const name = decodeURIComponent(searchParams.get("name") ?? "Staff Member");
    onSync(portal, name);
  }, [onSync, searchParams]);

  return null;
}

export default function SaraiPortal() {
  const router = useRouter();
  const [page, setPage] = useState<Page>("home");
  const [role, setRole] = useState<UserRole>(null);
  const [userName, setUserName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newsItems, setNewsItems] = useState<NewsItem[]>(initialNews);

  const clearUrlHash = useCallback(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const { pathname, search } = window.location;
      window.history.replaceState(null, "", pathname + search);
    }
  }, []);

  const handleLoginUser = (name: string) => {
    clearUrlHash();
    setRole("user");
    setUserName(name);
    setPage("user-dashboard");
  };

  const handleLoginAdmin = (name: string) => {
    clearUrlHash();
    setRole("admin");
    setUserName(name);
    setPage("admin-dashboard");
  };

  const handleLogout = () => {
    clearUrlHash();
    setRole(null);
    setUserName("");
    setPage("home");
    setSidebarOpen(false);
  };

  const handlePortalQuerySync = useCallback((portal: string | null, name: string) => {
    if (portal === "user") {
      setRole("user");
      setUserName(name);
      setPage("user-dashboard");
      return;
    }

    if (portal === "admin") {
      setRole("admin");
      setUserName(name);
      setPage("admin-dashboard");
    }
  }, []);

  const navigateToLogin = useCallback(() => {
    clearUrlHash();
    setPage("login");
    router.push("/login");
  }, [clearUrlHash, router]);

  return (
    <>
      <Suspense fallback={null}>
        <PortalQuerySync onSync={handlePortalQuerySync} />
      </Suspense>

      {page === "home" ? (
        <LandingPage onLogin={navigateToLogin} newsItems={newsItems} />
      ) : page === "login" ? (
        <LoginPage onBack={() => setPage("home")} onLoginUser={handleLoginUser} onLoginAdmin={handleLoginAdmin} />
      ) : (
        <div className="flex h-screen overflow-hidden bg-background" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
          <Sidebar role={role} current={page} onNav={setPage} onLogout={handleLogout} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="flex flex-1 flex-col overflow-hidden">
            <TopBar onMenuToggle={() => setSidebarOpen((value) => !value)} userName={userName} role={role} />
            <main className="flex-1 overflow-y-auto">
              {page === "user-dashboard" && <UserDashboard userName={userName} newsItems={newsItems} onNewsItemsChange={setNewsItems} />}
              {page === "admin-dashboard" && <AdminDashboard userName={userName} newsItems={newsItems} onNewsItemsChange={setNewsItems} />}
              {page === "dts" && <DTSPage role={role} />}
              {page === "attendance" && <AttendancePage userName={userName} />}
              {page === "trophies" && <TrophiesPage newsItems={newsItems} onNewsItemsChange={setNewsItems} role={role} />}
            </main>
          </div>
        </div>
      )}
    </>
  );
}
