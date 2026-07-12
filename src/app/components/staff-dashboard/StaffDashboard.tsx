'use client';

import { ArrowRight, Bell, Calendar, Clock, Download, FileText, FolderOpen, MapPin, Plus } from "lucide-react";

type StaffDashboardDocument = {
  id: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  status: string;
  priority: string;
};

type StaffDashboardProps = {
  staffName: string;
  documents: StaffDashboardDocument[];
  statusColor: Record<string, string>;
  priorityDot: Record<string, string>;
  onNavigate: (page: any) => void;
};

export function StaffDashboard({ staffName, documents, statusColor, priorityDot, onNavigate }: StaffDashboardProps) {
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
                { label: "Clock In / Out", icon: <Clock size={15} />, action: () => onNavigate("attendance") },
                { label: "Open Document Tracking", icon: <Plus size={15} />, action: () => onNavigate("dts") },
                { label: "View Announcements", icon: <Bell size={15} />, action: () => window.open("/announcements", "_blank") },
                { label: "Open SARAI Map", icon: <MapPin size={15} />, action: () => window.open("https://maps.sarai.ph/", "_blank", "noopener,noreferrer") },
              ].map((action) => (
                <button key={action.label} onClick={action.action} className="flex w-full items-center gap-2.5 rounded-lg border border-border px-3 py-2.5 text-sm text-foreground transition-all hover:border-primary hover:bg-primary hover:text-white group">
                  <span className="text-primary transition-colors group-hover:text-white">{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-xl bg-primary p-5 text-white">
            <div className="mb-3 flex items-center gap-2"><Calendar size={16} /> <span className="text-sm font-semibold">Employee Focus</span></div>
            <div className="space-y-2 text-xs text-white/80">
              <div className="flex items-start gap-2"><span className="rounded bg-white/10 px-1.5 py-0.5 font-mono">Daily</span><span>Clock in and out from your desk</span></div>
              <div className="flex items-start gap-2"><span className="rounded bg-white/10 px-1.5 py-0.5 font-mono">Live</span><span>Track documents and check SARAI map updates</span></div>
            </div>
            <button onClick={() => onNavigate("dts")} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white">
              Open workspace <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
