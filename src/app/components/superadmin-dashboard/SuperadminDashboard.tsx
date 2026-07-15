'use client';

import { useState } from "react";
import { Database, KeyRound, ShieldAlert, UserPlus, UserX } from "lucide-react";

type UserRow = {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  is_superadmin: boolean;
  is_active: boolean;
};

type SuperadminDashboardProps = {
  staffName: string;
  users: UserRow[];
  onCreateUser: (payload: { name: string; email: string; password: string; isAdmin: boolean; isSuperadmin: boolean }) => Promise<void> | void;
  onToggleUser: (id: number, active: boolean) => Promise<void> | void;
  onRemoveUser: (id: number) => Promise<void> | void;
};

export function SuperadminDashboard({ staffName, users, onCreateUser, onToggleUser, onRemoveUser }: SuperadminDashboardProps) {
  const [form, setForm] = useState({ name: "", email: "", password: "", isAdmin: true, isSuperadmin: false });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onCreateUser({
      name: form.name,
      email: form.email,
      password: form.password,
      isAdmin: form.isAdmin,
      isSuperadmin: form.isSuperadmin,
    });
    setForm({ name: "", email: "", password: "", isAdmin: true, isSuperadmin: false });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="rounded-2xl border border-red-200 bg-linear-to-r from-red-950 to-emerald-950 p-6 text-white">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-red-200">
          <ShieldAlert size={16} /> Superadmin Console
        </div>
        <h2 className="mt-2 text-2xl font-bold">Root access secured</h2>
        <p className="mt-2 max-w-2xl text-sm text-white/80">Only the highest office authority can use this area. It provides database guidance and full account administration.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-xl border border-border bg-white p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Database size={16} className="text-primary" /> Database access guide
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="rounded-lg bg-muted/50 p-3 font-mono text-xs text-foreground">
              <div>1. Open PowerShell or Command Prompt</div>
              <div>cd C:\Users\username\OneDrive\Desktop\sarai-ecosystem</div>
              <div>& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d sarai</div>
            </div>
            <div className="rounded-lg bg-muted/50 p-3 font-mono text-xs text-foreground">
              <div>2. View the database</div>
              <div>\dt</div>
              <div>SELECT * FROM users;</div>
            </div>
            <div className="rounded-lg bg-muted/50 p-3 font-mono text-xs text-foreground">
              <div>3. Exit</div>
              <div>\q</div>
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <div className="flex items-center gap-2 font-semibold">
              <KeyRound size={15} /> Secret access reminder
            </div>
            <p className="mt-1">Use Ctrl + Shift + S from the main portal to return to this console.</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
            <UserPlus size={16} className="text-primary" /> Provision new account
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="w-full rounded-lg border border-border px-3 py-2 text-sm" placeholder="Full name" required />
            <input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="w-full rounded-lg border border-border px-3 py-2 text-sm" placeholder="Email address" required />
            <input type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} className="w-full rounded-lg border border-border px-3 py-2 text-sm" placeholder="Temporary password" required />
            <div className="flex flex-wrap gap-3 text-sm">
              <label className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
                <input type="checkbox" checked={form.isAdmin} onChange={(event) => setForm((current) => ({ ...current, isAdmin: event.target.checked, isSuperadmin: event.target.checked ? current.isSuperadmin : current.isSuperadmin }))} />
                Admin access
              </label>
              <label className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
                <input type="checkbox" checked={form.isSuperadmin} onChange={(event) => setForm((current) => ({ ...current, isSuperadmin: event.target.checked, isAdmin: event.target.checked ? true : current.isAdmin }))} />
                Superadmin access
              </label>
            </div>
            <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Create account</button>
          </form>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Account control center</h3>
            <p className="text-sm text-muted-foreground">Manage staff, admin, and superadmin accounts from this console.</p>
          </div>
          <div className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-700">Sensitive</div>
        </div>
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="flex flex-col gap-3 rounded-lg border border-border p-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{user.name}</p>
                  {user.is_superadmin ? <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-red-700">Superadmin</span> : user.is_admin ? <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-700">Admin</span> : <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-700">Staff</span>}
                </div>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => onToggleUser(user.id, !user.is_active)} className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground">{user.is_active ? "Deactivate" : "Reactivate"}</button>
                {!user.is_superadmin && (
                  <button type="button" onClick={() => onRemoveUser(user.id)} className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white">
                    <UserX size={14} /> Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
