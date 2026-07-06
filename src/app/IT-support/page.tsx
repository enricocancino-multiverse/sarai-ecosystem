"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";

export default function SupportPage() {
  const [message, setMessage] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setMessage("");
    setTimeout(() => {
      setMessage("Alright, a live personnel will connect to you shortly.");
    }, 250);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),transparent_40%),linear-gradient(180deg,#ffffff_0%,#ecfdf5_100%)] px-4 py-10 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-4xl border border-emerald-100 bg-white p-8 shadow-[0_20px_60px_-20px_rgba(16,185,129,0.25)] sm:p-10">
        <div className="mb-8 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">IT Support</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Need immediate assistance?</h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            Submit a concise ticket and our support team will connect with you through the official regional IT channel.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block text-sm font-semibold text-slate-700">
            State your problem:
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={6}
              className="mt-3 w-full resize-none rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              placeholder="Describe the issue you are experiencing..."
              required
            />
          </label>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Submit Ticket
          </button>

          {submitted && (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700 transition-all duration-300">
              Alright, a live personnel will connect to you shortly.
            </div>
          )}
        </form>

        <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/global-login" className="font-semibold text-emerald-700 hover:text-emerald-900">
            ← Return to login
          </Link>
          <span className="text-slate-500">Secure IT escalation channel</span>
        </div>
      </div>
    </main>
  );
}
