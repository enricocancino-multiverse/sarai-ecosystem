"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Eye, EyeOff, RefreshCw, Shield, User } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"user" | "superadmin">("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.code === "KeyS") {
        setMode("superadmin");
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, mode }),
    });

    let payload: { error?: string } | null = null;
    try {
      payload = await response.json();
    } catch (err) {
      payload = null;
    }

    if (!response.ok) {
      setLoading(false);
      setError(
        payload?.error ??
          `Unable to sign in. ${response.statusText || "Please check your credentials."}`
      );
      return;
    }

    // Both staff and admin redirect to home portal
    // The portal component detects user role and shows appropriate dashboard
    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),transparent_40%),linear-gradient(180deg,#ffffff_0%,#ecfdf5_100%)]" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-4xl border border-emerald-100 bg-white shadow-[0_20px_60px_-20px_rgba(16,185,129,0.25)] lg:grid lg:grid-cols-[1.2fr_0.8fr]">
          <section className="p-8 sm:p-10">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Link href="/?view=landing" className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-900">
                  ← Back to home
                </Link>
              </div>
              <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                Secure access
              </span>
            </div>

            <div className="mt-10 sm:mt-12">
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                SARAI portal sign in
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
                Use your DOST credentials to sign in and access the SARAI portal. Authorized personnel may proceed.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">

              <label className="block text-sm font-semibold text-slate-700">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@dost.gov.ph"
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Password
                <div className="relative mt-2">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-900"
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              {error && (
                <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" /> Signing in...
                  </>
                ) : (
                  <>
                    <User size={18} /> Continue
                  </>
                )}
              </button>
              <div className="mt-4 rounded-3xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm leading-6 text-slate-700">
                Authorized Personnel Only. All activities logged. | <Link href="/IT-support" className="font-semibold text-emerald-700 hover:text-emerald-900">Need Help? Contact IT support.</Link>
              </div>
            </form>
          </section>

          <aside className="space-y-6 border-t border-slate-200 bg-emerald-50 p-8 sm:p-10 lg:border-t-0 lg:border-l lg:rounded-r-4xl lg:p-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">SARAI login</p>
              <h2 className="mt-4 text-xl font-semibold text-slate-900">Access all SARAI services from one secure portal</h2>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                Sign in to manage document workflows, review attendance, and stay updated with the latest announcements across DOST Region 1.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">What you can do</p>
              <ul className="mt-5 space-y-4 text-sm text-slate-600">
                <li className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">Track DTS records and approvals.</li>
                <li className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">Monitor staff attendance and schedules.</li>
                <li className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">Update public news and achievements.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
