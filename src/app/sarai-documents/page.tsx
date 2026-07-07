"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";

type UserRole = "staff" | "admin" | "superadmin" | null;

const documents = [
  { id: "DTS-2025-001", subject: "Budget Proposal FY2025", from: "Finance", to: "Director", date: "2025-06-28", status: "In Transit", priority: "High" },
  { id: "DTS-2025-002", subject: "Project SARAI Phase 2 MOU", from: "DOST R1", to: "Legal", date: "2025-06-27", status: "Received", priority: "High" },
  { id: "DTS-2025-003", subject: "Quarterly Activity Report Q2", from: "Admin", to: "Planning", date: "2025-06-26", status: "Approved", priority: "Normal" },
  { id: "DTS-2025-004", subject: "Livelihood Technology Vouchers", from: "CEST", to: "Finance", date: "2025-06-25", status: "For Signature", priority: "Normal" },
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

export default function DocumentsPage({ role }: { role: UserRole }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const statuses = ["All", "In Transit", "Received", "Approved", "For Signature", "Delivered"];

  const filtered = documents.filter((doc) => {
    const matchSearch = doc.subject.toLowerCase().includes(search.toLowerCase()) || doc.id.includes(search);
    const matchFilter = filter === "All" || doc.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Document Tracking System</h2>
          <p className="text-sm text-muted-foreground">Monitor and trace all official documents across divisions.</p>
        </div>
        {role === "admin" && (
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary/90">
            <Plus size={15} /> New Document
          </button>
        )}
      </div>

      <div className="rounded-xl border border-border bg-white p-4">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-input-background px-3 py-2">
          <Search size={15} className="shrink-0 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by document title or ID..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all ${filter === status ? "border-primary bg-primary text-white" : "border-transparent bg-muted text-muted-foreground hover:border-border"}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <div className="grid grid-cols-12 gap-4 border-b border-border bg-muted/30 px-5 py-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          <div className="col-span-2">Doc ID</div>
          <div className="col-span-4">Subject</div>
          <div className="col-span-2 hidden lg:block">From → To</div>
          <div className="col-span-2 hidden md:block">Date</div>
          <div className="col-span-2">Status</div>
        </div>
        <div className="divide-y divide-border">
          {filtered.map((doc) => (
            <div key={doc.id} className="grid grid-cols-12 items-center gap-4 px-5 py-3.5 transition-colors hover:bg-muted/20">
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <div className={`h-1.5 w-1.5 shrink-0 rounded-full ${priorityDot[doc.priority]}`} />
                  <span className="font-mono text-xs font-semibold text-primary">{doc.id}</span>
                </div>
              </div>
              <div className="col-span-4 min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{doc.subject}</p>
              </div>
              <div className="col-span-2 hidden lg:block text-xs text-muted-foreground">
                <p className="truncate">{doc.from}</p>
                <p className="truncate text-primary/70">→ {doc.to}</p>
              </div>
              <div className="col-span-2 hidden md:block text-xs font-mono text-muted-foreground">{doc.date}</div>
              <div className="col-span-2">
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusColor[doc.status]}`}>{doc.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
