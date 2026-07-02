"use client";

import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),transparent_40%),linear-gradient(180deg,#ffffff_0%,#ecfdf5_100%)] px-4 py-12" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <div className="w-full max-w-md rounded-4xl border border-emerald-100 bg-white p-8 shadow-[0_20px_60px_-20px_rgba(16,185,129,0.25)]">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Password reset disabled</h1>
          <p className="mt-2 text-sm text-slate-600">Public password recovery is not supported. Contact regional IT management for credential assistance.</p>
        </div>
        <Link href="/login" className="inline-flex items-center justify-center rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
          ← Return to Login
        </Link>
      </div>
    </div>
  );
}
