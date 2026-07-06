"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteShell from "../components/site-shell";

const adminCards = [
  { title: "Document Workflow", note: "Review incoming DTS records and approve requests." },
  { title: "Attendance Oversight", note: "Monitor staff presence and attendance summaries." },
  { title: "News & Achievements", note: "Publish achievements, announcements, and updates." },
];

type ActiveUser = { id: number; name: string; email: string; is_admin: boolean; last_login_at: string | null };

export default function AdminPage() {
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadActiveUsers = async () => {
      const response = await fetch("/api/admin/active-users");
      if (!response.ok) {
        setError("Unable to load active users.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setActiveUsers(data.users ?? []);
      setLoading(false);
    };

    loadActiveUsers();
  }, []);

  return (
    <SiteShell title="Admin Interface" description="A secure admin space for managing content, attendance, and operations inside the SARAI ecosystem.">
      <div className="space-y-6 rounded-4xl border border-emerald-100 bg-white p-7 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Special access</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">Admin workspace</h2>
            <p className="mt-2 text-sm text-slate-600">Overview of logged-in accounts and portal operations.</p>
          </div>
          <Link href="/" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
            Back to public home
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {adminCards.map((card) => (
            <div key={card.title} className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-5">
              <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{card.note}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Logged-in accounts</h3>
              <p className="text-sm text-slate-600">Recent users with active login activity.</p>
            </div>
            {loading && <span className="text-sm text-slate-500">Loading…</span>}
          </div>

          {error ? (
            <p className="text-sm text-red-700">{error}</p>
          ) : activeUsers.length === 0 ? (
            <p className="text-sm text-slate-700">No active users have been recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {activeUsers.map((user) => (
                <div key={user.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{user.name}</p>
                      <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${user.is_admin ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                      {user.is_admin ? "Admin" : "Staff"}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">Last login: {user.last_login_at ? new Date(user.last_login_at).toLocaleString("en-PH") : "Unknown"}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SiteShell>
  );
}
