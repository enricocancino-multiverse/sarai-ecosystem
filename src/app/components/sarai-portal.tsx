"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AttendancePageContent } from "../sarai-attendance/page";
import AchievementsRoutePage from "../sarai-achievements/page";
import DocumentsPage from "../sarai-documents/page";
import GlobalLoginPage from "../global-login/page";
import AnnouncementsPage from "../announcements/page";
import { AdminDashboard as AdminDashboardPanel } from "./admin-dashboard/AdminDashboard";
import { StaffDashboard as StaffDashboardPanel } from "./staff-dashboard/StaffDashboard";
import { SuperadminDashboard } from "./superadmin-dashboard/SuperadminDashboard";
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

type Page = "home" | "login" | "staff-dashboard" | "admin-dashboard" | "superadmin-dashboard" | "dts" | "attendance" | "achievements" | "announcements";
type UserRole = "staff" | "admin" | "superadmin" | null;

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

type NavItem = { label: string; page: Page; icon: ReactNode };

const staffNav: NavItem[] = [
  { label: "Dashboard", page: "staff-dashboard", icon: <Home size={18} /> },
  { label: "Documents", page: "dts", icon: <FileText size={18} /> },
  { label: "Check-in", page: "attendance", icon: <Clock size={18} /> },
  { label: "Achievements", page: "achievements", icon: <Trophy size={18} /> },
];

const adminNav: NavItem[] = [
  { label: "Dashboard", page: "admin-dashboard", icon: <Home size={18} /> },
  { label: "Announcements", page: "announcements", icon: <Bell size={18} /> },
  { label: "Documents", page: "dts", icon: <FileText size={18} /> },
  { label: "Check-in", page: "attendance", icon: <Clock size={18} /> },
  { label: "Achievements", page: "achievements", icon: <Trophy size={18} /> },
];

const superadminNav: NavItem[] = [
  ...adminNav,
  { label: "Root Console", page: "superadmin-dashboard", icon: <Shield size={18} /> },
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

const initialEvents: EventItem[] = [
  { id: 1, title: "National Science Month Opening", date: "Jul 1, 2025", location: "Regional Center" },
  { id: 2, title: "SARAI Q3 Progress Review", date: "Jul 3, 2025", location: "DOST Region 1 HQ" },
  { id: 3, title: "Farmer Advisory Workshop", date: "Jul 12, 2025", location: "Municipal Hall" },
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
  const nav = role === "superadmin" ? superadminNav : role === "admin" ? adminNav : staffNav;

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
          {(() => {
            const items: React.ReactNode[] = [];
            const shown = new Set<string>();

            nav.forEach((item) => {
              if (["staff-dashboard", "admin-dashboard", "announcements"].includes(item.page) && !shown.has("MAIN")) {
                items.push(
                  <div key="title-main" className="px-3 pt-3 text-xs font-semibold text-white/60">
                    MAIN
                  </div>
                );
                shown.add("MAIN");
              }

              if (item.page === "dts" && !shown.has("TOOLS")) {
                items.push(
                  <div key="title-tools" className="px-3 pt-3 text-xs font-semibold text-white/60">
                    TOOLS
                  </div>
                );
                shown.add("TOOLS");
              }

              if (item.page === "achievements" && !shown.has("MISC")) {
                items.push(
                  <div key="title-misc" className="px-3 pt-3 text-xs font-semibold text-white/60">
                    MISC
                  </div>
                );
                shown.add("MISC");
              }

              if (item.page === "superadmin-dashboard" && !shown.has("SPECIAL")) {
                items.push(
                  <div key="title-special" className="px-3 pt-3 text-xs font-semibold text-white/60">
                    SPECIAL
                  </div>
                );
                shown.add("SPECIAL");
              }

              items.push(
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
              );
            });

            return items;
          })()}
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

function TopBar({ onMenuToggle, staffName, role, currentPage, onNavigate }: { onMenuToggle: () => void; staffName: string; role: UserRole; currentPage: Page; onNavigate: (p: Page) => void }) {
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
      {role && (() => {
        const dashboardPage = role === "superadmin" ? "superadmin-dashboard" : role === "admin" ? "admin-dashboard" : "staff-dashboard";
        return (
          <div className="flex items-center gap-2">
            {currentPage !== "home" && (
              <button
                onClick={() => onNavigate("home")}
                className="rounded-md px-3 py-1 text-sm font-medium text-foreground hover:bg-muted"
              >
                Go to landing page
              </button>
            )}

            {currentPage !== dashboardPage && (
              <button
                onClick={() => onNavigate(dashboardPage)}
                className="rounded-md px-3 py-1 text-sm font-medium text-foreground hover:bg-muted"
              >
                Go back to dashboard
              </button>
            )}
          </div>
        );
      })()}
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
    { src: "/banners/sarai-banners%20%281%29.jpg", alt: "SARAI banner" },
    { src: "/banners/sarai-banners%20%282%29.jpg", alt: "SARAI banner" },
    { src: "/banners/sarai-banners%20%283%29.jpg", alt: "SARAI banner" },
  ];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveBanner((current) => (current + 1) % heroBanners.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [heroBanners.length]);

    const featureHighlights = [
      { title: "WHO WE ARE", description: (
      <>A Government Organization, <b>Smarter Approaches to Reinvigorate Agriculture as an Industry in the Philippines</b>. We are a forward-thinking, tech-driven initiative funded by the Department of Science and Technology (DOST) dedicated to empowering Philippine agriculture. By bridging modern technology with local farming needs, we aim to build a more resilient, sustainable, and productive agricultural sector across the regions.</>
      ) },
      { title: "WHERE WE ARE", content: <img src="/Location-map.png" alt="Location Map" className="w-full h-auto" /> },
      { title: "WHAT WE DO", description: "We integrate modern data analytics, smart farming solutions, and proactive agronomic systems into agricultural practices. Project SARAI provides smarter approaches to rejuvenate agriculture as an industry in the Philippines by delivering actionable insights and tech-driven tools to support decision-making for a more sustainable farming future." },
    ];

    const moduleCards = [
      { title: "Mission & Vision", description: "Privacy Policy, Terms of Service, and Code of Conduct.", href: "/modules#projects", icon: <FileText size={18} /> },
      { title: "Crop Suitability Maps", description: "Interactive agro-ecological maps matching land classifications with optimal priority crop choices.", href: "/modules#maps", icon: <Clock size={18} /> },
      { title: "Seasonal Planting Calendars", description: "Dynamic, weather-driven schedules showing exactly when to plant and when to hold back based on real-time El Niño shifts.", href: "/modules#calendars", icon: <Trophy size={18} /> },
    ];

    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(30,107,60,0.16),transparent_35%),linear-gradient(180deg,#fcfdfc_0%,#f6fbf7_100%)]" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
        <nav className="sticky top-0 z-50 border-b border-border/70 bg-white/90 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <img src="/mainlogos/DOST%20LOGO%20GLOBAL.png" alt="DOST Logo" className="h-8 w-auto shrink-0" />
                <img src="/mainlogos/BagongPilipinas.png" alt="Bagong Pilipinas Logo" className="h-10 w-auto shrink-0" />
                <img src="/mainlogos/Sarai-IlocosRegion.png" alt="Sarai Ilocos Region Logo" className="h-13 w-auto shrink-0" />
                <img src="/mainlogos/Sarai-Header.png" alt="Sarai Ilocos Region Logo" className="h-11 w-auto shrink-0" />
              </div>
            </div>
            <div className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
              {['About', 'Modules', 'News', 'Contact'].map((item) => (
                <a key={item} href={item === 'Modules' ? '#modules' : item === 'About' ? '#about' : item === 'News' ? '#news' : '#contact'} className="transition-colors hover:text-primary">{item}</a>
              ))}
            </div>
            <div className="flex items-center gap-3">
  {/* Public "Sign In" button removed per IT instructions */}
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
                  {heroBanners.slice(0, 3).map((banner, index) => (
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
                    <h2 className="mt-1 text-lg font-semibold text-foreground">Welcome to SARAI Ilocos Portal</h2>
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/20 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                    🌾 Priority Crops Focus
                  </div>
                  <span className="text-[10px] bg-emerald-100 font-bold text-emerald-800 px-2 py-0.5 rounded-full">
                    9 Crops
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { name: "Rice", icon: "🌾" },
                    { name: "Corn", icon: "🌽" },
                    { name: "Banana", icon: "🍌" },
                    { name: "Coconut", icon: "🥥" },
                    { name: "Coffee", icon: "☕" },
                    { name: "Cacao", icon: "🍫" },
                    { name: "Sugarcane", icon: "🌱" },
                    { name: "Tomato", icon: "🍅" },
                    { name: "Soybean", icon: "🫛" }
                  ].map((crop) => (
                    <Link
                      key={crop.name}
                      href={`/sarai-crops?crop=${encodeURIComponent(crop.name)}`}
                      className="flex flex-col items-center justify-center rounded-xl bg-white border border-slate-100 p-2.5 shadow-sm hover:border-emerald-400 hover:shadow-sm transition-all cursor-pointer group"
                    >
                      <span className="text-xl mb-1 group-hover:scale-110 transition-transform">
                        {crop.icon}
                      </span>
                      <span className="text-[11px] font-bold text-slate-700 group-hover:text-emerald-900">
                        {crop.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              </div>
            </div>
          </div>
        </section>

      <section className="bg-primary border-t border-emerald-200/40">
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6">
          <div className="mx-auto relative h-1.5 w-full max-w-4xl overflow-hidden rounded-full bg-emerald-500/70 shadow-[0_0_30px_rgba(16,185,129,0.25)]">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(56,189,127,0.08)_0%,rgba(167,243,208,0.9)_15%,rgba(34,197,94,0.25)_45%,rgba(167,243,208,0.65)_70%,rgba(56,189,127,0.12)_100%)] opacity-90" />
            <div className="absolute inset-y-0 left-[-30%] h-full w-1/4 rounded-full bg-linear-to-r from-emerald-200/90 via-emerald-300/70 to-transparent blur-[6px] opacity-90 animate-[ledGlow_4.5s_linear_infinite]" />
          </div>
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
            <h2 className="text-3xl font-bold text-foreground">Announcements & News</h2>
          </div>
          <Link href="/announcements" className="hidden items-center gap-2 text-sm font-semibold text-primary hover:underline sm:flex">See more <ArrowRight size={14} /></Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {initialNews.slice(0, 3).map((item) => (
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
<section id="apps" className="relative overflow-hidden py-24 px-4 sm:px-6 md:px-8 bg-linear-to-br from-[#02182b] via-[#052237] to-[#01111e] border-t border-blue-900/40">
  {/* Injecting data and logic directly inside the section scope so it's self-contained */}
  {(() => {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [scrollPosition, setScrollPosition] = useState(0);

    const systems = [
      {
        id: "spidtech",
        type: "Mobile App",
        title: "SPIDTECH",
        tagline: "Smart Pest & Disease Identification",
        description: "Identify pests and crop diseases instantly using smart image recognition. Access an extensive digital library offline to safeguard your farm.",
        badge: "Google Play",
        badgeColor: "bg-amber-500 text-amber-950",
        actionText: "Download Here",
        actionUrl: "https://play.google.com/store/apps/details?id=ph.sarai.ipdas.spidtech",
        imageSrc: "/systemtech/Spidtech.png"
      },
      {
        id: "banatech",
        type: "Mobile App",
        title: "BANATECH",
        tagline: "Banana Harvest Estimator",
        description: "Predict the perfect banana harvest date and estimate potential yields. Log farm coordinates, track crop stages, and forecast supply schedules.",
        badge: "Web Demo",
        badgeColor: "bg-emerald-400 text-emerald-950",
        actionText: "Access Demo",
        actionUrl: "https://banana-b7ab6.web.app/",
        imageSrc: "/systemtech/Banatech.png"
      },
      {
        id: "waiss",
        type: "Web Platform",
        title: "WAISS",
        tagline: "Weather-Driven Agricultural Intelligence & Surveillance System",
        description: "Real-time weather data collection and analysis for precision irrigation, crop health monitoring, and water resource management.",
        badge: "Automation System",
        badgeColor: "bg-blue-400 text-blue-950",
        actionText: "View WAISS Models",
        actionUrl: "https://sarai.ph/",
        imageSrc: "/systemtech/Waiss.jpeg"
      },
      {
        id: "aws",
        type: "automation",
        title: "AWS",
        tagline: "Automated Weather Station",
        description: "Collects and analyzes real-time weather data for precision irrigation, crop health monitoring, and water resource management.",
        badge: "Automation System",
        badgeColor: "bg-indigo-400 text-indigo-950",
        actionText: "View AWS Models",
        actionUrl: "https://sarai.ph/",
        imageSrc: "/systemtech/Aws.jpg"
      },
      {
        id: "portal",
        type: "Web Platform",
        title: "SARAI Knowledge Portal",
        tagline: "Centralized Agrometeorological hub",
        description: "The primary operational portal offering regional crop monitoring, real-time weather-to-crop forecasts, and interactive advisory newsletters.",
        badge: "Main Hub",
        badgeColor: "bg-teal-400 text-teal-950",
        actionText: "Visit Portal",
        actionUrl: "https://sarai.ph/",
        imageSrc: "/systemtech/Sarai.ph.png"
      },
      {
        id: "seams",
        type: "Web System",
        title: "CL-SEAMS",
        tagline: "Community-Level SARAI Enhanced Agricultural Monitoring System",
        description: "Real-time soil moisture data collection and analysis for precision irrigation, crop health monitoring, and water resource management.",
        badge: "Real-time Web",
        badgeColor: "bg-blue-400 text-blue-950",
        actionText: "Monitor Soil",
        actionUrl: "https://sarai.ph/",
        imageSrc: "/systemtech/Seams.png"
      }
    ];

    const checkScrollPosition = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 5);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
        setScrollPosition(scrollLeft);
      }
    };

    useEffect(() => {
      const el = scrollRef.current;
      if (el) {
        el.addEventListener('scroll', checkScrollPosition);
        checkScrollPosition();
        window.addEventListener('resize', checkScrollPosition);
      }
      return () => {
        if (el) el.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }, []);

    const slideLeft = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: -340, behavior: 'smooth' });
      }
    };

    const slideRight = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 340, behavior: 'smooth' });
      }
    };

    return (
      <>
        {/* Background Decorative organic visual blobs */}
        <div className="absolute top-0 right-0 w-125 h-125 rounded-full bg-blue-600/10 blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-100 h-100 rounded-full bg-teal-600/5 blur-[100px] pointer-events-none -z-10" />
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-87.5 h-87.5 rounded-full bg-sky-600/5 blur-[90px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Title Block */}
          <div className="mb-14 text-center max-w-3xl mx-auto">
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-emerald-400">
              Digital Tools & Platforms
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
              SARAI Systems & Technologies
            </h2>
            <div className="h-1 w-20 bg-emerald-500 mx-auto rounded-full mb-6" />
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              Empowering agricultural forecasting, dynamic pest surveillance, and field advisory metrics through a unified technological portfolio developed for local communities.
            </p>
          </div>

          {/* Carousel Outer Wrapper with Custom Slide Buttons */}
          <div className="relative group/carousel">
            
            {/* Scroll Buttons - Absolute overlay */}
            {canScrollLeft && (
              <button
                type="button"
                onClick={slideLeft}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-11 h-11 rounded-full bg-slate-950/80 text-emerald-400 border border-slate-700/50 hover:bg-emerald-800 hover:text-white hover:scale-105 shadow-xl transition-all duration-200"
                aria-label="Slide Left"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {canScrollRight && (
              <button
                type="button"
                onClick={slideRight}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-11 h-11 rounded-full bg-slate-950/80 text-emerald-400 border border-slate-700/50 hover:bg-emerald-800 hover:text-white hover:scale-105 shadow-xl transition-all duration-200"
                aria-label="Slide Right"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Scrolling Container */}
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-8 pt-4 px-2 no-scrollbar scrollbar-none"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {systems.map((sys) => (
                <div
                  key={sys.id}
           
                  className="group shrink-0 w-77.5 sm:w-87.5 snap-start flex flex-col justify-between p-6 rounded-2xl border border-emerald-900/40 bg-linear-to-b from-[#022c22]/75 to-[#011a14]/90 backdrop-blur-md shadow-lg hover:border-emerald-500/50 hover:shadow-emerald-950/50 hover:shadow-2xl transition-all duration-300"
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        {sys.type}
                      </span>
                      <span className={`text-[9px] font-bold uppercase px-2.5 py-1 rounded-full shadow-sm ${sys.badgeColor}`}>
                        {sys.badge}
                      </span>
                    </div>

                    {/* Simplified Image Showcase Container */}
                    <div className="h-48 flex items-center justify-center mb-6 bg-slate-950/40 border border-emerald-950/30 rounded-xl overflow-hidden relative group">
                      <Image
                        src={sys.imageSrc}
                        alt={`${sys.title} asset`}
                        width={180}
                        height={260}
                        className="max-h-[85%] max-w-[85%] object-contain transition-transform duration-300 group-hover:scale-105"
                        unoptimized
                      />
                    </div>

                    {/* Tech Content Information */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white tracking-tight">{sys.title}</h3>
                      <p className="text-xs font-semibold text-emerald-300/90 leading-snug">{sys.tagline}</p>
                      <p className="text-[13px] text-zinc-300 leading-relaxed pt-2">
                        {sys.description}
                      </p>
                    </div>
                  </div>

                  {/* External Action Button */}
                  <div className="mt-8 pt-4 border-t border-emerald-900/20">
                    <a
                      href={sys.actionUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-slate-950/40 transition-all duration-200 hover:bg-emerald-500 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span>{sys.actionText}</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Progress Navigation Indicators */}
            <div className="flex justify-center items-center gap-2.5 mt-2">
              {systems.slice(0, 3).map((sys, index) => {
                const isActive = (Math.round(scrollPosition / 340) % 3 + 3) % 3 === index;
                return (
                  <button
                    key={sys.id}
                    type="button"
                    onClick={() => {
                      if (scrollRef.current) {
                        scrollRef.current.scrollTo({ left: index * 340, behavior: 'smooth' });
                      }
                    }}
                    className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 ${
                      isActive 
                        ? 'bg-emerald-400 border-emerald-300' 
                        : 'bg-slate-800 border-slate-700 hover:bg-emerald-600'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                );
              })}
            </div>
          </div>

        </div>
      </>
    );
  })()}

  {/* Styled Inline hiding of scrollbar support */}
  <style dangerouslySetInnerHTML={{__html: `
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `}} />
</section>

{/* Sarai Output/maps/advisories/weather forecast */}
<section id="modules" className="border-t border-emerald-200/40 bg-muted/40 py-20">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    {/* Module Internal State Controls */}
    {(() => {
      const [activeTab, setActiveTab] = useState<'weather' | 'maps' | 'advisories'>('weather');
      const [province, setProvince] = useState('Laguna');
      const [municipality, setMunicipality] = useState('Los Baños');
      const [metric, setMetric] = useState<'mm' | 'percent'>('mm');
      const [outlookMonth, setOutlookMonth] = useState('Apr 2026');

      const rainfallData = [
        { month: "Apr 2026", icon: "☀️", value: 22, percentage: 15, bg: "bg-zinc-100 border-zinc-200 text-zinc-900" },
        { month: "May 2026", icon: "💧", value: 179, percentage: 88, bg: "bg-cyan-400 border-cyan-500 text-slate-950" },
        { month: "Jun 2026", icon: "💧", value: 243, percentage: 104, bg: "bg-blue-500 border-blue-600 text-white" },
        { month: "Jul 2026", icon: "☔", value: 431, percentage: 142, bg: "bg-blue-950 border-blue-900 text-white" },
        { month: "Aug 2026", icon: "💧", value: 331, percentage: 118, bg: "bg-blue-700 border-blue-800 text-white" },
        { month: "Sep 2026", icon: "💧", value: 303, percentage: 110, bg: "bg-blue-600 border-blue-700 text-white" },
        { month: "Oct 2026", icon: "💧", value: 339, percentage: 125, bg: "bg-blue-850 border-blue-900 text-white" },
        { month: "Nov 2026", icon: "💧", value: 220, percentage: 98, bg: "bg-blue-500 border-blue-600 text-white" },
        { month: "Dec 2026", icon: "💧", value: 171, percentage: 82, bg: "bg-cyan-400 border-cyan-500 text-slate-950" },
        { month: "Jan 2027", icon: "☁️", value: 60, percentage: 45, bg: "bg-sky-200 border-sky-300 text-slate-950" },
        { month: "Feb 2027", icon: "☀️", value: 21, percentage: 18, bg: "bg-zinc-100 border-zinc-200 text-zinc-900" },
        { month: "Mar 2027", icon: "☀️", value: 16, percentage: 12, bg: "bg-zinc-100 border-zinc-200 text-zinc-900" },
      ];

      return (
        <>
          {/* Sub-navigation Switcher */}
          <div className="flex flex-wrap justify-center gap-3 mb-12 border-b border-emerald-200/20 pb-6">
            <button
              onClick={() => setActiveTab('weather')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                activeTab === 'weather' 
                  ? 'bg-emerald-700 text-white shadow-md' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <TrendingUp className="w-4 h-4" /> Weather & Rainfall Outlook
            </button>
            <button
              onClick={() => setActiveTab('maps')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                activeTab === 'maps' 
                  ? 'bg-emerald-700 text-white shadow-md' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Globe className="w-4 h-4" /> Maps & Remote Sensing
            </button>
            <button
              onClick={() => setActiveTab('advisories')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                activeTab === 'advisories' 
                  ? 'bg-emerald-700 text-white shadow-md' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Bell className="w-4 h-4" /> Real-time Advisories
            </button>
          </div>

          {/* Tab Content Panels */}
          {activeTab === 'weather' && (
            <div className="bg-card text-card-foreground rounded-2xl p-6 md:p-10 border border-emerald-200/20 shadow-sm animate-in fade-in-50 duration-200">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold tracking-tight text-foreground">Rainfall Outlook</h3>
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-1">El Niño season (Apr 2026 – Mar 2027)</p>
                <p className="text-xs text-muted-foreground mt-2 max-w-2xl mx-auto">
                  A 12-month municipal rainfall outlook framework. Switch between raw forecast calculations (mm) or long-term dynamic percentages.
                </p>
                <span className="text-[10px] text-muted-foreground opacity-60 block mt-1">Source: CHIRPS (Climate Hazards Group InfraRed Precipitation with Station data)</span>
              </div>

              {/* Input Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-6">
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-center mb-1.5">Province</label>
                  <select 
                    value={province} 
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full text-sm border border-emerald-200/20 rounded-xl p-2.5 bg-background text-foreground focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="Laguna">Laguna</option>
                    <option value="Batangas">Batangas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-center mb-1.5">Municipality</label>
                  <select 
                    value={municipality} 
                    onChange={(e) => setMunicipality(e.target.value)}
                    className="w-full text-sm border border-emerald-200/20 rounded-xl p-2.5 bg-background text-foreground focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="Los Baños">Los Baños</option>
                    <option value="Bay">Bay</option>
                  </select>
                </div>
              </div>

              {/* Metric Toggle */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex rounded-xl p-1 bg-muted border border-emerald-200/10">
                  <button
                    onClick={() => setMetric('mm')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      metric === 'mm' ? 'bg-blue-600 text-white shadow-sm' : 'text-muted-foreground'
                    }`}
                  >
                    Rainfall (mm)
                  </button>
                  <button
                    onClick={() => setMetric('percent')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      metric === 'percent' ? 'bg-blue-600 text-white shadow-sm' : 'text-muted-foreground'
                    }`}
                  >
                    % of normal
                  </button>
                </div>
              </div>

              {/* 12-Month Matrix Layout */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-10">
                {rainfallData.map((item) => (
                  <div 
                    key={item.month} 
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border shadow-sm transition-all hover:scale-[1.02] ${item.bg}`}
                  >
                    <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">{item.month}</span>
                    <span className="text-2xl my-1.5">{item.icon}</span>
                    <span className="text-xl font-black tracking-tight">
                      {metric === 'mm' ? `${item.value}` : `${item.percentage}%`}
                    </span>
                    <span className="text-[9px] uppercase font-extrabold tracking-widest opacity-70 mt-0.5">
                      {metric === 'mm' ? 'mm' : 'normal'}
                    </span>
                  </div>
                ))}
              </div>

              {/* GIS National Map Deck */}
              <div className="border-t border-emerald-200/10 pt-8 bg-muted/30 rounded-xl p-6 text-center">
                <h4 className="text-md font-bold text-foreground flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" /> National Outlook Map
                </h4>
                <p className="text-xs text-muted-foreground mt-1 mb-4 max-w-xl mx-auto">
                  Municipal classification parameters mapped across geographical coordinates for the target target temporal filter window.
                </p>
                <div className="max-w-xs mx-auto mb-6">
                  <select
                    value={outlookMonth}
                    onChange={(e) => setOutlookMonth(e.target.value)}
                    className="w-full text-sm border border-emerald-200/20 rounded-xl p-2 bg-background text-foreground shadow-sm"
                  >
                    {rainfallData.map(d => (
                      <option key={d.month} value={d.month}>{d.month}</option>
                    ))}
                  </select>
                </div>
                <div className="aspect-21/8 w-full bg-background border border-dashed border-emerald-200/30 rounded-xl flex flex-col items-center justify-center text-muted-foreground text-xs gap-1 p-4">
                  <Globe className="w-8 h-8 text-emerald-600/40 animate-pulse mb-1" />
                  <span className="font-medium text-foreground">Active Spatial Map Grid Loaded</span>
                  <span>Centred Coordinate Focus Layer: {outlookMonth} ({province})</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'maps' && (
            <div className="grid md:grid-cols-2 gap-6 animate-in fade-in-50 duration-200">
              <div className="p-6 bg-card text-card-foreground border border-emerald-200/20 rounded-2xl shadow-sm">
                <div className="p-2.5 bg-emerald-500/10 rounded-xl w-fit mb-4">
                  <RefreshCw className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Vegetation Water Stress (SEVTR)</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Real-time algorithmic calculations processing terrestrial data matrices to isolate regional drought risks early.
                </p>
              </div>
              <div className="p-6 bg-card text-card-foreground border border-emerald-200/20 rounded-2xl shadow-sm">
                <div className="p-2.5 bg-blue-500/10 rounded-xl w-fit mb-4">
                  <FolderOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Near Real-Time Flood Assessment</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Post-typhoon saturation modeling vectors detailing impact tracking dimensions straight to local analytics monitors.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'advisories' && (
            <div className="space-y-4 bg-card text-card-foreground p-6 rounded-2xl border border-emerald-200/20 shadow-sm animate-in fade-in-50 duration-200">
              <div className="p-4 border-l-4 border-emerald-600 bg-emerald-500/5 rounded-r-xl flex gap-3 items-start">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-foreground">Rice Crop System Advisory</span>
                    <span className="text-[10px] font-bold bg-emerald-600/10 text-emerald-600 px-2 py-0.5 rounded-md">Active</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Elevated rainfall configurations expected across regional monitoring units. Deploy proper Alternate Wetting and Drying (AWD) matrices to manage yield margins.
                  </p>
                </div>
              </div>
              <div className="p-4 border-l-4 border-amber-500 bg-amber-500/5 rounded-r-xl flex gap-3 items-start">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-foreground">Corn Stalk Rot Warning</span>
                    <span className="text-[10px] font-bold bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-md">Alert</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Monitored localized microclimate indices track a rise in relative boundary layer humidity. Initiate targeted crop updates and IPM schedules immediately.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      );
    })()}
  </div>
</section>

{/* Logos and Stakeholders section */}
<section id="partners" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 border-t border-emerald-200/40">
  <div className="mb-12 text-center">
    <div className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">Institutional Network</div>
    <h2 className="text-3xl font-bold text-foreground">Program Partners & Stakeholders</h2>
    <p className="mt-3 text-xs text-muted-foreground max-w-2xl mx-auto leading-relaxed">
      Collaborating agencies and institutional partners working together under Project SARAI to develop robust agricultural forecasting and monitoring systems across the region.
    </p>
  </div>

  <div className="space-y-12">
    {/* Group 1: Funding & Lead Implementers */}
    <div className="space-y-4">
      <div className="flex items-center gap-3 w-full">
        <span className="bg-emerald-600 text-[10px] font-bold text-white px-2 py-0.5 rounded-full shrink-0">Core Agencies</span>
        <h3 className="text-xs font-bold text-emerald-950 tracking-wide uppercase shrink-0">Funding & Lead Implementing Bodies</h3>
        <div className="h-px bg-emerald-200/60 grow ml-2" />
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {[
          { name: "DOST - PCAARRD", role: "Funding Agency", loc: "Los Baños, Laguna", img: "mainlogos/Pccard.png" },
          { name: "DOST Ilocos Region", role: "Regional Office", loc: "San Fernando City, La Union", img: "mainlogos/DOST LOGO GLOBAL.png" }
        ].map((agency, idx) => (
          <div 
            key={idx} 
            className="flex gap-5 items-center p-6 rounded-2xl border-2 border-emerald-500/20 bg-white shadow-sm hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer"
          >
            {/* Larger logo container for the primary agencies */}
            <div className="w-16 h-16 rounded-xl border border-slate-100 p-2 shrink-0 flex items-center justify-center bg-slate-50/50">
              <img 
                src={agency.img} 
                alt={`${agency.name} Logo`} 
                className="w-full h-full object-contain" 
              />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-bold text-slate-800 leading-tight">{agency.name}</div>
              <div className="text-xs font-semibold text-emerald-600">{agency.role}</div>
              <div className="text-[10px] text-muted-foreground">{agency.loc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
    {/* Group 2: Regional HEI Cooperators */}
    <div className="space-y-4">
      <div className="flex items-center gap-3 w-full">
        <span className="bg-amber-500 text-[10px] font-bold text-white px-2 py-0.5 rounded-full shrink-0">HEI Cooperators</span>
        <h3 className="text-xs font-bold text-emerald-950 tracking-wide uppercase shrink-0">State Universities & Colleges</h3>
        <div className="h-px bg-emerald-200/60 grow ml-2" />
      </div>
      
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
        {[
          { name: "DMMMSU", fullName: "Don Mariano Marcos Memorial State University", img: "sidelogos/DMMMSU-logos.png" },
          { name: "MMSU", fullName: "Mariano Marcos State University", img: "sidelogos/MMSU.png" },
          { name: "PSU", fullName: "Pangasinan State University", img: "sidelogos/PSU.png" },
          { name: "ISPSC", fullName: "Ilocos Sur Polytechnic State College", img: "sidelogos/ISPSC.png" }
        ].map((hei, idx) => (
          <div key={idx} className="flex flex-col items-center text-center justify-center p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer min-h-32.5">
            <div className="w-12 h-12 rounded-xl border border-slate-100 p-1 mb-3 flex items-center justify-center bg-slate-50/50">
              <img 
                src={hei.img} 
                alt={`${hei.name} Logo`} 
                className="w-full h-full object-contain" 
              />
            </div>
            <div className="text-[11px] font-bold text-slate-800 leading-tight mb-1">{hei.name}</div>
            <div className="text-[9px] text-muted-foreground leading-snug px-1">{hei.fullName}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Group 3: Local Government Units */}
    <div className="space-y-4">
      {/* Defined directly in JSX execution flow rather than inside a self-invoked layout closure */}
      {(() => {
        const lgus = [
          { name: "City of San Fernando, La Union", leader: "Hon. Hermenegildo A. Gualberto", img: "sidelogos/SanfernandoSeal.png" },
          { name: "Municipality of Bacnotan, La Union", leader: "Hon. Divina C. Fontanilla", img: "sidelogos/BacnotanSeal.png" },
          { name: "Municipality of Rosario, La Union", leader: "Hon. Bellarmin A. Flores II", img: "sidelogos/RosarioSeal.jpg" },
          { name: "Municipality of Aringay, La Union", leader: "Hon. Benjamin E. Sibuma", img: "sidelogos/AringaySeal.jpg" },
          { name: "City of Candon, Ilocos Sur", leader: "Hon. Eric D. Singson", img: "sidelogos/CandonSeal.png" },
          { name: "Municipality of Alilem, Ilocos Sur", leader: "Hon. Velmor P. Pinera", img: "sidelogos/AlilemSeal.png" },
          { name: "Municipality of Santa Maria, Ilocos Sur", leader: "Hon. Brigido C. Camarillo Jr.", img: "sidelogos/SantaMariaSeal.jpg" },
          { name: "Municipality of Santa Catalina, Ilocos Sur", leader: "Hon. Edgar R. Rapanut", img: "sidelogos/SantaCatalinaSeal.jpg" },
          { name: "Municipality of Banayoyo, Ilocos Sur", leader: "Hon. Virgilio G. Galimba", img: "sidelogos/BanayoyoSeal.jpg" },
          { name: "City of Batac, Ilocos Norte", leader: "Hon. Mark Christian R. Chua", img: "sidelogos/BatacSeal.png" },
          { name: "City of Laoag, Ilocos Norte", leader: "Hon. Michael Marcos Keon", img: "sidelogos/LaoagSeal.png" },
          { name: "Municipality of Pinili, Ilocos Norte", leader: "Hon. Rommel T. Labasan", img: "sidelogos/PiniliSeal.png" },
          { name: "Municipality of Vintar, Ilocos Norte", leader: "Hon. Richard A. Degala", img: "sidelogos/VintarSeal.png" },
          { name: "Municipality of San Nicolas, Pangasinan", leader: "Hon. Alicia L. Primicias-Enriquez", img: "sidelogos/SanNicolasSeal.png" },
          { name: "Municipality of Sual, Pangasinan", leader: "Hon. Liseldo D.Q. Calugay", img: "sidelogos/SualSeal.png" },
          { name: "Municipality of Dasol, Pangasinan", leader: "Hon. Rizalde A. Bernal", img: "sidelogos/DasolSeal.png" }
        ];

        return (
          <>
            <div className="flex items-center gap-3 w-full">
              <span className="bg-purple-600 text-[10px] font-bold text-white px-2 py-0.5 rounded-full shrink-0">
                {lgus.length} {lgus.length === 1 ? 'member' : 'members'}
              </span>
              <h3 className="text-xs font-bold text-emerald-950 tracking-wide uppercase shrink-0">Local Government Units</h3>
              <div className="h-px bg-emerald-200/60 grow ml-2" />
            </div>
            
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
              {lgus.map((lgu, idx) => (
                <div key={idx} className="flex flex-col items-center text-center justify-center p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer min-h-32.5">
                  <div className="w-12 h-12 rounded-xl border border-slate-100 p-1 mb-3 flex items-center justify-center bg-slate-50/50">
                    <img 
                      src={lgu.img} 
                      alt={`${lgu.name} Seal`} 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                  <div className="text-[11px] font-bold text-slate-800 leading-tight mb-1">{lgu.name}</div>
                  <div className="text-[9px] text-muted-foreground leading-snug px-1">{lgu.leader}</div>
                </div>
              ))}
              </div>
             </>
            );
           })()}
         </div>
        </div>
      </section>
    
     {/* Footer Section */}
      {/* Footer Section */}
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
                <span> 0945 644 9161</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="shrink-0" />
                <a href="mailto:sarai.centro.uplb@up.edu.ph" className="hover:text-white transition-colors">sarai@region1.dost.gov.ph</a>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin size={14} className="shrink-0 mt-0.5" />
                <span>DMMMSU-MLUC, DOST Ilocos Region Sevilla</span>
              </div>
            </div>
            
            {/* Social Icons matching the dark circular design */}
            <div className="flex gap-2 pt-2">
              <a href="https://www.facebook.com/profile.php?id=61582297319415" className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors text-white text-xs font-semibold">f</a>
              <a href="https://x.com/projectsarai_ph" className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors text-white text-xs font-semibold">𝕏</a>
              <a href="https://www.youtube.com/@projectsarai" className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors text-white text-[10px] font-semibold">YT</a>
            </div>
          </div>

          {/* Column 3: Links Left */}
          <div className="space-y-4">
            <h4 className="font-bold tracking-widest uppercase text-white text-xs">Links</h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li><a href="#" className="hover:text-white transition-colors block">About Us</a></li>
              <li><a href="https://sarai.ph/weather-monitoring" className="hover:text-white transition-colors block">Monitoring</a></li>
              <li><a href="https://sarai.ph/rainfall-outlook" className="hover:text-white transition-colors block">Rainfall Outlook</a></li>
              <li><a href="https://sarai.ph/drought-forecast" className="hover:text-white transition-colors block">DCAF</a></li>
            </ul>
          </div>

          {/* Column 4: Links Right */}
          <div className="space-y-4 pt-4 md:pt-8">
            <ul className="space-y-2.5 text-xs text-white/70">
              <li><a href="https://www.youtube.com/watch?v=vIL7g0CLMps&list=PLZOwkbT51Td3b35GKTJts_-YG8V9MatdW" className="hover:text-white transition-colors block">SARAI Eskwela</a></li>
              <li><a href="https://sarai.ph/" className="hover:text-white transition-colors block">SARAI Main Website</a></li>
              <li><a href="https://maps.sarai.ph/" className="hover:text-white transition-colors block">SARAI Maps</a></li>
            </ul>
          </div>

        </div>

        {/* Sub-footer metadata bottom bar */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/40">
          <div>
            Sarai CENTRO © 2026 ·{' '}
            {/* Subtle Admin Action Button executing onLogin */}
            <button 
              onClick={onLogin}
              className="bg-transparent border-none p-0 cursor-pointer text-[11px] text-white/40 hover:text-white transition-colors underline decoration-white/20 underline-offset-2"
              title="Internal Access"
            >
              Staff/Admin login
            </button>{' '}
            · DOST Region 1 · Republic of the Philippines
          </div>
          <div className="flex gap-6">
            <a href="/modules#projects" className="transition-colors hover:text-white">Privacy Policy</a>
            <a href="/modules#projects" className="transition-colors hover:text-white">Terms of Use</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StaffDashboardView({ staffName, onNavigate }: { staffName: string; onNavigate: (page: Page) => void }) {
  return (
    <StaffDashboardPanel
      staffName={staffName}
      documents={documents}
      statusColor={statusColor}
      priorityDot={priorityDot}
      onNavigate={onNavigate}
    />
  );
}

function AdminDashboardView({ staffName, onNavigate, onToggleUser, onRemoveUser, users, announcements }: { staffName: string; onNavigate: (page: Page) => void; onToggleUser: (id: number, active: boolean) => Promise<void> | void; onRemoveUser: (id: number) => Promise<void> | void; users: any[]; announcements: { id: number; title: string; date: string; tag: string }[] }) {
  return (
    <AdminDashboardPanel
      staffName={staffName}
      attendanceLogs={attendanceLogs}
      users={users}
      announcements={announcements}
      onNavigate={(page) => onNavigate(page)}
      onToggleUser={onToggleUser}
      onRemoveUser={onRemoveUser}
    />
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
  const [users, setUsers] = useState<any[]>([]);
  const [superadminUnlocked, setSuperadminUnlocked] = useState(false);
  const [newsItems, setNewsItems] = useState<NewsItem[]>(initialNews);
  const [eventItems, setEventItems] = useState<EventItem[]>(initialEvents);

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

  const loadUsers = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/users", { credentials: "same-origin" });
      if (!response.ok) return;
      const payload = await response.json();
      setUsers(payload.users || []);
    } catch (error) {
      console.error("Unable to load users", error);
    }
  }, []);

  const handleCreateUser = useCallback(async (payload: { name: string; email: string; password: string; isAdmin: boolean; isSuperadmin: boolean }) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || "Unable to create user");
      }
      await loadUsers();
    } catch (error) {
      console.error("Create user failed", error);
    }
  }, [loadUsers]);

  const handleToggleUser = useCallback(async (id: number, active: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active }),
      });
      if (!response.ok) throw new Error("Unable to update user");
      await loadUsers();
    } catch (error) {
      console.error("Toggle user failed", error);
    }
  }, [loadUsers]);

  const handleRemoveUser = useCallback(async (id: number) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      if (!response.ok) throw new Error("Unable to remove user");
      await loadUsers();
    } catch (error) {
      console.error("Remove user failed", error);
    }
  }, [loadUsers]);

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
    setSuperadminUnlocked(false);
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
      setPage(resolvedRole === "staff" ? "staff-dashboard" : resolvedRole === "superadmin" ? "superadmin-dashboard" : "admin-dashboard");
      if (resolvedRole === "superadmin") {
        setSuperadminUnlocked(true);
      }
    };

    loadSession();
  }, []);

  useEffect(() => {
    if (role === "admin" || role === "superadmin") {
      loadUsers();
    }
  }, [role, loadUsers]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (role === "superadmin") {
          setSuperadminUnlocked(true);
          setPage("superadmin-dashboard");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [role]);

  const isSuperadminArea = page === "superadmin-dashboard";
  const canAccessSuperadmin = role === "superadmin" && superadminUnlocked;

  useEffect(() => {
    if (isSuperadminArea && !canAccessSuperadmin) {
      setPage(role === "superadmin" ? "admin-dashboard" : role === "admin" ? "admin-dashboard" : "staff-dashboard");
    }
  }, [canAccessSuperadmin, isSuperadminArea, role]);

  const handleAddNews = useCallback((item: Omit<NewsItem, "id" | "date">) => {
    setNewsItems((current) => [{
      ...item,
      id: Date.now(),
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    }, ...current]);
  }, []);

  const handleRemoveNews = useCallback((id: number) => {
    setNewsItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const handleAddEvent = useCallback((event: Omit<EventItem, "id">) => {
    setEventItems((current) => [...current, { ...event, id: Date.now() }]);
  }, []);

  const handleRemoveEvent = useCallback((id: number) => {
    setEventItems((current) => current.filter((event) => event.id !== id));
  }, []);

  const navigateToLogin = useCallback(() => {
    clearUrlHash();
    router.push("/global-login");
  }, [clearUrlHash, router]);

  if (page === "home" && !role) return <LandingPage onLogin={navigateToLogin} />;

  if (isSuperadminArea && !canAccessSuperadmin) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <Sidebar role={role} current={page} onNav={setPage} onLogout={handleLogout} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar onMenuToggle={() => setSidebarOpen((value) => !value)} staffName={staffName} role={role} currentPage={page} onNavigate={(p) => setPage(p)} />
        <main className="flex-1 overflow-y-auto">
          {page === "home" && role && <LandingPage onLogin={navigateToLogin} />}
          {page === "staff-dashboard" && <StaffDashboardView staffName={staffName} onNavigate={(targetPage) => setPage(targetPage)} />}
          {page === "admin-dashboard" && (
            <AdminDashboardView
              staffName={staffName}
              users={users}
              announcements={newsItems.map((item) => ({ id: item.id, title: item.title, date: item.date, tag: item.tag }))}
              onNavigate={(targetPage) => setPage(targetPage)}
              onToggleUser={handleToggleUser}
              onRemoveUser={handleRemoveUser}
            />
          )}
          {page === "superadmin-dashboard" && (
            <SuperadminDashboard
              staffName={staffName}
              users={users}
              onCreateUser={handleCreateUser}
              onToggleUser={handleToggleUser}
              onRemoveUser={handleRemoveUser}
            />
          )}
          {page === "dts" && <DTSPage role={role} />}
          {page === "attendance" && <AttendancePage staffName={staffName} />}
          {page === "achievements" && <AchievementsView />}
          {page === "announcements" && (
            <AnnouncementsPage
              news={newsItems}
              events={eventItems}
              isSuperadmin={role === "superadmin"}
              onAddNews={handleAddNews}
              onRemoveNews={handleRemoveNews}
              onAddEvent={handleAddEvent}
              onRemoveEvent={handleRemoveEvent}
              onBack={() => setPage(role === "superadmin" ? "superadmin-dashboard" : role === "admin" ? "admin-dashboard" : "staff-dashboard")}
            />
          )}
        </main>
      </div>
    </div>
  );
}