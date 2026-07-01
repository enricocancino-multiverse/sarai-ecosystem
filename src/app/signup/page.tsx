"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, RefreshCw, UserPlus } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(payload.error || "Unable to create account.");
      return;
    }

    router.push("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),transparent_40%),linear-gradient(180deg,#ffffff_0%,#ecfdf5_100%)] px-4 py-12" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <div className="w-full max-w-md rounded-4xl border border-emerald-100 bg-white p-8 shadow-[0_20px_60px_-20px_rgba(16,185,129,0.25)]">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Create an account</h1>
          <p className="mt-2 text-sm text-slate-600">Sign up for staff access to SARAI Region 1.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">
            Full name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </label>

          {error && (
            <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={16} className="inline align-text-bottom" /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? <RefreshCw size={18} className="animate-spin" /> : <><UserPlus size={18} /> Create account</>}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account? <Link href="/login" className="font-semibold text-emerald-700 hover:text-emerald-900">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
