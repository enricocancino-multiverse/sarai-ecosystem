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
    <main className="min-h-screen bg-emerald-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl rounded-4xl border border-emerald-700/60 bg-emerald-900/95 p-10 shadow-[0_35px_80px_-30px_rgba(16,185,129,0.75)]">
        <div className="mb-8 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">IT Support</p>
          <h1 className="text-3xl font-semibold text-white">Need immediate assistance?</h1>
          <p className="max-w-2xl text-sm leading-6 text-emerald-200">
            Submit a concise ticket and our support team will connect with you through the official regional IT channel.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block text-sm font-semibold text-emerald-100">
            State your problem:
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={6}
              className="mt-3 w-full resize-none rounded-3xl border border-emerald-700 bg-emerald-950/90 px-4 py-4 text-sm text-white outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/30"
              placeholder="Describe the issue you are experiencing..."
              required
            />
          </label>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-3xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
          >
            Submit Ticket
          </button>

          {submitted && (
            <div className="rounded-3xl border border-emerald-300/20 bg-white/10 px-5 py-4 text-sm text-emerald-100 transition-all duration-300">
              Alright, a live personnel will connect to you shortly.
            </div>
          )}
        </form>

        <div className="mt-8 flex items-center justify-between border-t border-emerald-700/30 pt-6 text-sm text-emerald-200">
          <Link href="/global-login" className="font-semibold text-emerald-200 hover:text-white">
            ← Return to login
          </Link>
          <span className="text-emerald-300/90">Secure IT escalation channel</span>
        </div>
      </div>
    </main>
  );
}
