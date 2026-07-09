"use client";

import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AttendancePageContent } from "../sarai-attendance/page";
import AchievementsRoutePage from "../sarai-achievements/page";
import DocumentsPage from "../sarai-documents/page";
import GlobalLoginPage from "../global-login/page";
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

type Page = "home" | "login" | "staff-dashboard" | "admin-dashboard" | "dts" | "attendance" | "achievements";
type UserRole = "staff" | "admin" | "superadmin" | null;

type NavItem = { label: string; page: Page; icon: ReactNode };

const staffNav: NavItem[] = [
  { label: "Dashboard", page: "staff-dashboard", icon: <Home size={18} /> },
  { label: "Documents", page: "dts", icon: <FileText size={18} /> },
  { label: "Check-in", page: "attendance", icon: <Clock size={18} /> },
  { label: "Achievements", page: "achievements", icon: <Trophy size={18} /> },
];

const adminNav: NavItem[] = [
  { label: "Dashboard", page: "admin-dashboard", icon: <Home size={18} /> },
  { label: "Documents", page: "dts", icon: <FileText size={18} /> },
  { label: "Check-in", page: "attendance", icon: <Clock size={18} /> },
  { label: "Achievements", page: "achievements", icon: <Trophy size={18} /> },
];

const documents = [
  { id: "DTS-2025-001", subject: "Budget Proposal FY2025", from: "Finance", to: "Director", date: "2025-06-28", status: "In Transit", priority: "High" },
  { id: "DTS-2025-002", subject: "Project SARAI Phase 2 MOU", from: "DOST R1", to: "Legal", date: "2025-06-27", status: "Received", priority: "High" },
  { id: "DTS-2025-003", subject: "Quarterly Activity Report Q2", from: "Admin", to: "Planning", date: "2025-06-26", status: "Approved", priority: "Normal" },
  { id: "DTS-2025-004", subject: "Livelihood Technology Vouchers", from: "CEST", to: "Finance", date: "2025-06-25", status: "For Signature", priority: "Normal" },
];

const news = [
  {
    id: 1,
    title: "SARAI Launches AI-Powered Crop Monitoring",
    excerpt: "Satellite-linked crop monitoring stations are now active across key municipalities in Ilocos Region.",
    tag: "Technology",
    date: "June 28, 2025",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=500&fit=crop&auto=format",
  },
  {
    id: 2,
    title: "DOST Region 1 Wins Best Regional Office Award",
    excerpt: "The regional office was recognized for excellence in technology commercialization and community engagement.",
    tag: "Award",
    date: "June 24, 2025",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop&auto=format",
  },
  {
    id: 3,
    title: "240 Farmers Complete Weather Advisory Training",
    excerpt: "Locally trained beneficiaries can now interpret digital climate warnings and plan their farms better.",
    tag: "Training",
    date: "June 18, 2025",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=500&fit=crop&auto=format",
  },
];

const achievements = [
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

// Sidebar Component
function Sidebar({ role, current, onNav, onLogout, open, onClose }: { role: UserRole; current: Page; onNav: (page: Page) => void; onLogout: () => void; open: boolean; onClose: () => void }) {
  const nav = role === "admin" || role === "superadmin" ? adminNav : staffNav;

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
          {role === "superadmin" ? <div className="flex items-center gap-2"><Shield size={14} className="text-red-400" /> Superadmin Access</div> : role === "admin" ? <div className="flex items-center gap-2"><Shield size={14} className="text-amber-400" /> Admin Access</div> : <div className="flex items-center gap-2"><User size={14} /> Staff Portal</div>}
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

function TopBar({ onMenuToggle, staffName, role }: { onMenuToggle: () => void; staffName: string; role: UserRole }) {
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
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{staffName[0]}</div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-foreground">{staffName}</p>
            <p className="text-xs capitalize text-muted-foreground">{role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

function LandingPage({ onLogin }: { onLogin: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeBanner, setActiveBanner] = useState(0);

  const heroBanners = [
    { src: "/banners/DOST-banner.jpg", alt: "DOST banner" },
    { src: "/banners/SARAI-banner.jpg", alt: "SARAI banner" },
    { src: "/banners/Sarai-canva-banner.png", alt: "SARAI Canva banner" },
  ];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveBanner((current) => (current + 1) % heroBanners.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [heroBanners.length]);

  const featureHighlights = [
    { title: "WHO WE ARE", description: "A Government Organization, We are a forward-thinking, tech-driven initiative funded by the Department of Science and Technology (DOST) dedicated to empowering Philippine agriculture. By bridging modern technology with local farming needs, we aim to build a more resilient, sustainable, and productive agricultural sector across the regions." },
    { title: "WHERE WE ARE", content: <img src="/Location-map.png" alt="Location Map" className="w-full h-auto" /> },
    { title: "WHAT WE DO", description: "We integrate modern data analytics, smart farming solutions, and proactive agronomic systems into agricultural practices. Project SARAI provides smarter approaches to rejuvenate agriculture as an industry in the Philippines by delivering actionable insights and tech-driven tools to support decision-making for a more sustainable farming future." },
  ];

  const workflowSteps = [
    { title: "Explore the portal", detail: "Browse the public landing experience and see what SARAI offers." },
    { title: "Sign in securely", detail: "Choose staff or admin access and move into your personalized workspace." },
    { title: "Track and report", detail: "Monitor documents, attendance, and updates without switching tools." },
  ];

  const moduleCards = [
    { title: "Sarai Personnel", description: "Collection of Sarai personnel information and records.", href: "/modules#personnel", icon: <FileText size={18} /> },
    { title: "Mission & Vision", description: "Privacy Policy, Terms of Service, and Code of Conduct", href: "/modules#projects", icon: <Clock size={18} /> },
    { title: "Accomplishment Report", description: "Achievement summaries and performance metrics.", href: "/modules#reports", icon: <Trophy size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(30,107,60,0.16),transparent_35%),linear-gradient(180deg,#fcfdfc_0%,#f6fbf7_100%)]" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <nav className="sticky top-0 z-50 border-b border-border/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img src="/DOST LOGO GLOBAL.png" alt="DOST Logo" className="h-8 w-auto shrink-0" />
              <img src="/BagongPilipinas.png" alt="Bagong Pilipinas Logo" className="h-8 w-auto shrink-0" />
              <img src="/Sarai-IlocosRegion.png" alt="Sarai Ilocos Region Logo" className="h-8 w-auto shrink-0" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">SARAI ILOCOS</div>
            </div>
          </div>
          <div className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            {['About', 'Modules', 'News', 'Contact'].map((item) => (
              <a key={item} href={item === 'Modules' ? '#modules' : item === 'About' ? '#about' : item === 'News' ? '#news' : '#contact'} className="transition-colors hover:text-primary">{item}</a>
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
            {['About', 'Modules', 'News', 'Contact'].map((item) => (
              <a key={item} href={item === 'Modules' ? '#modules' : item === 'About' ? '#about' : item === 'News' ? '#news' : '#contact'} className="block py-2 text-sm text-muted-foreground hover:text-primary">{item}</a>
            ))}
          </div>
        )}
      </nav>

      <section className="relative overflow-hidden border-t border-white/90">
        <div className="absolute inset-0">
          {heroBanners.map((banner, index) => (
            <img
              key={banner.src}
              src={banner.src}
              alt={banner.alt}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${index === activeBanner ? "opacity-100" : "opacity-0"}`}
            />
          ))}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/80 via-primary/20 to-emerald-950/60" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_35%)]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/90 px-3 py-1.5 text-xs font-semibold text-primary shadow-sm backdrop-blur">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                DOST Region 1 — Portal
              </div>
              <h1 className="mb-6 text-4xl font-extrabold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
                Sarai Ilocos<br/>
                <span className="text-emerald-200">Ecosystem</span>
              </h1>
              <p className="mb-8 max-w-xl text-lg leading-relaxed text-emerald-50/95 font-bold">
                Smarter Approaches to Reinvigorate Agriculture as an Industry in the Philippines.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#modules" className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-all hover:bg-primary/90">
                  Explore Features <ArrowRight size={16} />
                </a>
                <a href="#about" className="flex items-center gap-2 rounded-lg border border-white/30 bg-white/15 px-6 py-3 font-semibold text-white transition-all hover:bg-white/25">Learn More</a>
              </div>
              <div className="mt-6 flex items-center gap-2">
                {heroBanners.map((banner, index) => (
                  <button
                    key={banner.src}
                    type="button"
                    aria-label={`Show ${banner.alt}`}
                    onClick={() => setActiveBanner(index)}
                    className={`h-2.5 rounded-full transition-all ${index === activeBanner ? "w-8 bg-white" : "w-2.5 bg-white/50"}`}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-emerald-100 bg-white/80 p-5 shadow-[0_20px_60px_-20px_rgba(30,107,60,0.25)] backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <div>
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
                  <p className="text-sm font-semibold text-foreground">What to do?</p>
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

      <section className="bg-primary border-t border-emerald-200/40">
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

      <section id="about" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 border-t border-white/90">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {featureHighlights.map((item) => (
            <article key={item.title} className="rounded-[1.35rem] border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
              {item.description ? (
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p>
              ) : null}
              {item.content ? <div className="mt-4">{item.content}</div> : null}
            </article>
          ))}
        </div>
      </section>

          {/* Modules Section */}

      <section id="modules" className="border-t border-emerald-200/40 bg-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600 align-middle">
                Sarai Modules
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white align-">
                Everything you need to know in one place
              </h2>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-start">
            <div className="flex flex-col gap-5 lg:col-span-5">
              {moduleCards.map((card) => (
                <article
                  key={card.title}
                  className="group relative rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                      {card.icon}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                        {card.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                        {card.description}
                      </p>
                      <Link
                        href={card.href}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
                        onClick={(e) => {
                          try {
                            e.preventDefault();
                            window.location.href = card.href;
                          } catch {
                            // ignore and let the link handle navigation
                          }
                        }}
                      >
                        Access Module <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="h-full lg:col-span-7">
              <div className="relative flex h-full min-h-85 flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-sm group dark:border-slate-800">
                <div className="absolute inset-0 z-0 h-full w-full opacity-100 transition-opacity">
                  <iframe
                    className="h-full w-full"
                    src="https://www.youtube.com/embed/tRBuJxEDZJ0?rel=0&modestbranding=1"
                    title="Project SARAI Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                <div className="pointer-events-none relative z-10 flex h-full min-h-85 flex-col justify-between bg-linear-to-b from-black/60 via-transparent to-black/80 p-5">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-300">Project SARAI Overview</p>
                    <p className="text-xs text-slate-400">Smarter Approaches to Rejuvenate Agriculture as an Industry</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     {/* News Section */}
      <section id="news" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 border-t border-white/90">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">Latest updates</div>
            <h2 className="text-3xl font-bold text-foreground">Announcements</h2>
          </div>
          <Link href="/announcements" className="hidden items-center gap-2 text-sm font-semibold text-primary hover:underline sm:flex">See more <ArrowRight size={14} /></Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-[1.25rem] border border-border bg-white transition-shadow hover:shadow-md">
              <div className="h-44 overflow-hidden bg-muted">
                <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
              </div>
              <div className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{item.tag}</span>
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                </div>
                <h3 className="mb-2 text-sm font-bold leading-snug text-foreground">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
          
      {/* Mobile Applications Section */}
      <section id="apps" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 border-t border-emerald-200/40">
        <div className="mb-12 text-center">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">Digital Tools</div>
          <h2 className="text-3xl font-bold text-foreground">SARAI Mobile Applications</h2>
        </div>

        <div className="grid gap-12 md:grid-cols-2 max-w-4xl mx-auto">
          {/* BANATECH */}
          <div className="flex flex-col items-center text-center p-6 rounded-[1.25rem] border border-border bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="relative w-48 h-48 flex items-center justify-center mb-6">
              {/* Background decorative circles mimicking the live site screenshot */}
              <div className="absolute top-2 left-6 w-36 h-36 rounded-full bg-emerald-500 -z-10 opacity-90" />
              <div className="absolute bottom-4 right-8 w-12 h-12 rounded-full bg-amber-400 -z-10" />
              {/* Fallback structural layout mirroring image mockup */}
              <div className="w-28 h-44 bg-zinc-800 rounded-xl p-1.5 shadow-xl border border-zinc-700">
                <div className="w-full h-full bg-[#1e2d24] rounded-lg p-2 flex flex-col justify-between text-left text-[8px] text-white/90">
                  <div className="font-bold border-b border-white/20 pb-0.5">BANATECH</div>
                  <div className="bg-white/10 rounded p-1 my-1 flex-1 flex flex-col items-center justify-center">
                    <span className="text-base">🍌</span>
                    <span className="text-[6px] text-center mt-1">Harvest Calculator</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="mb-6 text-sm text-muted-foreground leading-relaxed max-w-sm grow">
              Want to access <span className="font-bold text-foreground">BANATECH</span> firsthand? You can try the features of the mobile application through this link!
            </p>
            <a 
              href="https://sarai.ph/" 
              target="_blank" 
              rel="noreferrer" 
              className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition-all hover:bg-emerald-700"
            >
              Access Here
            </a>
          </div>

          {/* SPIDTECH */}
          <div className="flex flex-col items-center text-center p-6 rounded-[1.25rem] border border-border bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="relative w-48 h-48 flex items-center justify-center mb-6">
              {/* Background decorative elements */}
              <div className="absolute top-8 left-2 w-4 h-4 rounded-full bg-amber-400 -z-10" />
              <div className="absolute top-16 right-4 w-3 h-3 rounded-full bg-amber-400 -z-10" />
              <div className="absolute bottom-2 right-6 w-12 h-12 rounded-full bg-amber-400 -z-10" />
              
              {/* Google Play Store Badge Mockup */}
              <div className="absolute top-14 -right-2.5 bg-amber-100 text-[9px] font-medium text-amber-800 px-2 py-1 rounded-lg border border-amber-200 max-w-25 shadow-sm leading-tight">
                Available for download on the Google Play Store!
              </div>

              {/* Structural app preview container */}
              <div className="w-28 h-44 bg-zinc-800 rounded-xl p-1.5 shadow-xl border border-zinc-700">
                <div className="w-full h-full bg-[#112415] rounded-lg p-2 flex flex-col justify-between text-left text-[8px] text-white/90">
                  <div className="font-bold border-b border-white/20 pb-0.5 text-center text-emerald-400">🔍 SPIDTECH</div>
                  <div className="bg-emerald-950/40 border border-emerald-800/30 rounded p-1 mt-1 flex-1 text-[5px] space-y-1">
                    <div className="bg-white/10 p-0.5 rounded">📱 Pest Scanner</div>
                    <div className="bg-white/10 p-0.5 rounded">📚 Image Library</div>
                  </div>
                </div>
              </div>
            </div>
            <p className="mb-6 text-sm text-muted-foreground leading-relaxed max-w-sm grow">
              In need of assistance during pest season? Download <span className="font-bold text-foreground">SPIDTECH</span> now!
            </p>
            <a 
              href="https://play.google.com/store/apps/details?id=ph.sarai.ipdas.spidtech" 
              target="_blank" 
              rel="noreferrer" 
              className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition-all hover:bg-emerald-700"
            >
              Download Here
            </a>
          </div>
        </div>
      </section>

          {/* Footer Section */}

      {/* Contact Section */}
      <section id="contact" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 border-t border-emerald-200/40">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary">Get in touch</div>
            <h2 className="mb-6 text-3xl font-bold text-foreground">DOST Region 1 offices</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-3"><MapPin size={16} className="mt-0.5 text-primary" /> DMMMSU-MLUC, DOST Ilocos Region Sevilla, City of San Fernando, La Union</div>
              <div className="flex items-start gap-3"><Phone size={16} className="mt-0.5 text-primary" /> 0945 644 9161</div>
              <div className="flex items-start gap-3"><Mail size={16} className="mt-0.5 text-primary" /> sarai@region1.dost.gov.ph</div>
              <div className="flex items-start gap-3"><Globe size={16} className="mt-0.5 text-primary" /> https://sarai.ph/</div>
            </div>
          </div>
          <div className="rounded-3xl bg-primary p-8 text-white">
            <h3 className="mb-2 text-xl font-bold">Looking for public updates?</h3>
            <p className="mb-6 text-sm text-white/80">Explore the latest SARAI news, achievements, and office contact details from this public landing page.</p>
            <a href="#news" className="inline-flex w-full items-center justify-center rounded-lg bg-white px-4 py-3 font-semibold text-primary transition-all hover:bg-gray-50">View latest updates</a>
          </div>
        </div>
      </section>

      {/* Main Rich Footer Section */}
      <footer className="bg-[#42423e] py-16 text-white/80 border-t border-zinc-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid gap-10 sm:grid-cols-2 md:grid-cols-4 text-sm">
          
          {/* Column 1: About */}
          <div className="space-y-4">
            <h4 className="font-bold tracking-widest uppercase text-white text-xs">About SARAI</h4>
            <p className="text-white/70 leading-relaxed text-xs">
              Project SARAI aims to develop a national crop forecasting and monitoring system for nine priority crops: rice, corn, banana, coconut, coffee, cacao, sugarcane, tomato, and soybean. This project is funded by DOST-PCAARRD.
            </p>
          </div>

          {/* Column 2: Connect */}
          <div className="space-y-4">
            <h4 className="font-bold tracking-widest uppercase text-white text-xs">Connect With Us</h4>
            <div className="space-y-3 text-xs text-white/70">
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="shrink-0" />
                <span>+63 (049) 536 2251</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="shrink-0" />
                <a href="mailto:sarai.centro.uplb@up.edu.ph" className="hover:text-white transition-colors">sarai.centro.uplb@up.edu.ph</a>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin size={14} className="shrink-0 mt-0.5" />
                <span>SESAM UPLB, College, Laguna Philippines 4031</span>
              </div>
            </div>
            
            {/* Social Icons matching the dark circular design */}
            <div className="flex gap-2 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors text-white text-xs font-semibold">f</a>
              <a href="#" className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors text-white text-xs font-semibold">𝕏</a>
              <a href="#" className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors text-white text-[10px] font-semibold">YT</a>
            </div>
          </div>

          {/* Column 3: Links Left */}
          <div className="space-y-4">
            <h4 className="font-bold tracking-widest uppercase text-white text-xs">Links</h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li><a href="#" className="hover:text-white transition-colors block">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors block">Monitoring</a></li>
              <li><a href="#" className="hover:text-white transition-colors block">Rainfall Outlook</a></li>
              <li><a href="#" className="hover:text-white transition-colors block">DCAF</a></li>
            </ul>
          </div>

          {/* Column 4: Links Right */}
          <div className="space-y-4 pt-4 md:pt-8">
            <ul className="space-y-2.5 text-xs text-white/70">
              <li><a href="#" className="hover:text-white transition-colors block">SARAI Eskwela</a></li>
              <li><a href="#" className="hover:text-white transition-colors block">SARAI Conference</a></li>
              <li><a href="#" className="hover:text-white transition-colors block">SARAI Community</a></li>
              <li><a href="#" className="hover:text-white transition-colors block">SARAI Open Data</a></li>
            </ul>
          </div>

        </div>

        {/* Sub-footer metadata bottom bar */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/40">
          <div>Sarai Ecosystem © 2026 · DOST Region 1 · Republic of the Philippines</div>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-white">Privacy Policy</a>
            <a href="#" className="transition-colors hover:text-white">Terms of Use</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StaffDashboard({ staffName }: { staffName: string }) {
  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6 p-6">
      <div className="rounded-xl bg-linear-to-r from-primary to-emerald-600 p-6 text-white">
        <p className="text-sm text-white/80">{greeting},</p>
        <h2 className="mb-1 text-2xl font-bold">{staffName} 👋</h2>
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

function AdminDashboard({ staffName }: { staffName: string }) {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2"><Shield size={18} className="text-amber-500" /><span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">Admin Console</span></div>
          <h2 className="text-xl font-bold text-foreground">System Overview</h2>
          <p className="text-sm text-muted-foreground">Welcome back, {staffName}. Here&apos;s the status of the Sarai Ecosystem today.</p>
        </div>
        <div className="rounded-lg bg-muted px-3 py-1.5 text-right font-mono text-xs text-muted-foreground">June 30, 2025 · 08:41 AM</div>
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

//Dashboard Pages
function DTSPage({ role }: { role: UserRole }) {
  return <DocumentsPage role={role} />;
}

function AttendancePage({ staffName }: { staffName: string }) {
  return <AttendancePageContent userName={staffName} />;
}

function AchievementsView() {
  return <AchievementsRoutePage />;
}

export default function SaraiPortal() {
  const router = useRouter();
  const [page, setPage] = useState<Page>("home");
  const [role, setRole] = useState<UserRole>(null);
  const [staffName, setStaffName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const clearUrlHash = useCallback(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const { pathname, search } = window.location;
      window.history.replaceState(null, "", pathname + search);
    }
  }, []);

  const handleLoginStaff = (name: string) => {
    clearUrlHash();
    setRole("staff");
    setStaffName(name);
    setPage("staff-dashboard");
  };

  const handleLoginAdmin = (name: string) => {
    clearUrlHash();
    setRole("admin");
    setStaffName(name);
    setPage("admin-dashboard");
  };

  const handleLogout = async () => {
    clearUrlHash();

    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
    } catch (error) {
      console.error("Logout failed", error);
    }

    setRole(null);
    setStaffName("");
    setPage("home");
    setSidebarOpen(false);
    router.replace("/?view=landing");
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("view") === "landing") {
      setPage("home");
      return;
    }

    const loadSession = async () => {
      const response = await fetch("/api/auth/me", { credentials: "same-origin" });
      if (!response.ok) {
        setRole(null);
        setStaffName("");
        setPage("home");
        return;
      }

      const payload = await response.json();
      if (!payload.user) {
        setRole(null);
        setStaffName("");
        setPage("home");
        return;
      }

      const resolvedRole = payload.user.is_superadmin ? "superadmin" : payload.user.is_admin ? "admin" : "staff";
      setRole(resolvedRole);
      setStaffName(payload.user.name);
      setPage(resolvedRole === "staff" ? "staff-dashboard" : "admin-dashboard");
    };

    loadSession();
  }, []);

  const navigateToLogin = useCallback(() => {
    clearUrlHash();
    router.push("/global-login");
  }, [clearUrlHash, router]);

  if (page === "home") return <LandingPage onLogin={navigateToLogin} />;



  return (
    <div className="flex h-screen overflow-hidden bg-background" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <Sidebar role={role} current={page} onNav={setPage} onLogout={handleLogout} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar onMenuToggle={() => setSidebarOpen((value) => !value)} staffName={staffName} role={role} />
        <main className="flex-1 overflow-y-auto">
          {page === "staff-dashboard" && <StaffDashboard staffName={staffName} />}
          {page === "admin-dashboard" && <AdminDashboard staffName={staffName} />}
          {page === "dts" && <DTSPage role={role} />}
          {page === "attendance" && <AttendancePage staffName={staffName} />}
          {page === "achievements" && <AchievementsView />}
        </main>
      </div>
    </div>
  );
}
