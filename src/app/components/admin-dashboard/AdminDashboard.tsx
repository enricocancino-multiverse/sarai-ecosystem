'use client';

import { AlertCircle, ArrowRight, Check, FileText, MapPin, Settings, Shield, UserX, Users, Megaphone } from "lucide-react";

type AttendanceLog = {
  name: string;
  amIn: string;
  amOut: string;
  pmIn: string;
  pmOut: string;
  status: string;
};

type AdminUser = {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  is_superadmin: boolean;
  is_active: boolean;
};

// Simple shape for showing dynamic metrics or list overviews
type AnnouncementOverview = {
  id: number;
  title: string;
  date: string;
  tag: string;
};

type AdminNavigationPage = "attendance" | "dts" | "announcements";

type AdminDashboardProps = {
  staffName: string;
  attendanceLogs: AttendanceLog[];
  users: AdminUser[];
  onNavigate: (page: AdminNavigationPage) => void;
  onToggleUser: (id: number, active: boolean) => Promise<void> | void;
  onRemoveUser: (id: number) => Promise<void> | void;
  announcements?: AnnouncementOverview[]; // Optional prop to feed live updates
};

export function AdminDashboard({ 
  staffName, 
  attendanceLogs, 
  users, 
  onNavigate, 
  onToggleUser, 
  onRemoveUser,
  announcements = [
    { id: 1, title: "SARAI Launches AI-Powered Crop Monitoring", date: "June 28, 2025", tag: "Technology" },
    { id: 2, title: "DOST Region 1 Wins Best Regional Office Award", date: "June 24, 2025", tag: "Award" }
  ]
}: AdminDashboardProps) {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Shield size={18} className="text-amber-500" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">Admin Console</span>
          </div>
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
        {/* Quick Actions Panel */}
        <div className="overflow-hidden rounded-xl border border-border bg-white">
          <div className="border-b border-border px-5 py-4"><h3 className="text-sm font-semibold text-foreground">Quick Actions</h3></div>
          <div className="space-y-3 p-5">
            {[
              { label: "Clock In / Out", action: () => onNavigate("attendance"), icon: <Check size={15} /> },
              { label: "Open Document Tracking", action: () => onNavigate("dts"), icon: <FileText size={15} /> },
              { label: "Manage Announcements", action: () => onNavigate("announcements"), icon: <Megaphone size={15} /> },
              { label: "Open SARAI Map", action: () => window.open("https://maps.sarai.ph/", "_blank", "noopener,noreferrer"), icon: <MapPin size={15} /> },
            ].map((action) => (
              <button key={action.label} onClick={action.action} className="flex w-full items-center gap-2.5 rounded-lg border border-border px-3 py-3 text-sm text-foreground transition-all hover:border-primary hover:bg-primary hover:text-white group">
                <span className="text-primary transition-colors group-hover:text-white">{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Addition: Announcements Dashboard Functionality Widget */}
        <div className="overflow-hidden rounded-xl border border-border bg-white">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold text-foreground">Ecosystem Announcements</h3>
            <button 
              onClick={() => onNavigate("announcements")} 
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              Manage all <ArrowRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-border">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    {announcement.tag}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">{announcement.date}</span>
                </div>
                <h4 className="text-xs font-semibold text-foreground line-clamp-1">{announcement.title}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="overflow-hidden rounded-xl border border-border bg-white">
          <div className="border-b border-border px-5 py-4"><h3 className="text-sm font-semibold text-foreground">Today&apos;s Attendance Summary</h3></div>
          <div className="divide-y divide-border">
            {attendanceLogs.map((log, index) => (
              <div key={`${log.name}-${index}`} className="flex items-center gap-3 px-5 py-3">
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

        {/* Staff Access Controls */}
        <div className="overflow-hidden rounded-xl border border-border bg-white">
          <div className="border-b border-border px-5 py-4"><h3 className="text-sm font-semibold text-foreground">Staff access controls</h3></div>
          <div className="space-y-3 p-5">
            {users.filter((user) => !user.is_superadmin).map((user) => (
              <div key={user.id} className="flex flex-col gap-2 rounded-lg border border-border p-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => onToggleUser(user.id, !user.is_active)} className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground">
                    {user.is_active ? "Deactivate" : "Reactivate"}
                  </button>
                  <button onClick={() => onRemoveUser(user.id)} className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white">
                    <UserX size={14} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Document Pipeline */}
      <div className="grid gap-6 lg:grid-cols-2">
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