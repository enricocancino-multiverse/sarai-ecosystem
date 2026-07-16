import Link from "next/link";

export default function LordsPrayerPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(30,107,60,0.12),transparent_30%),linear-gradient(180deg,#fcfdfc_0%,#f6fbf7_100%)] px-4 py-10 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-4xl border border-emerald-100 bg-white/90 p-8 shadow-[0_20px_60px_-20px_rgba(30,107,60,0.25)] backdrop-blur sm:p-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">The Lord&apos;s Prayer</h1>
          </div>
          <Link href="/" className="rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50">
            Back to Home
          </Link>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6 sm:p-8">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">NIV Translation</p>
          <div className="space-y-4 text-lg leading-8 text-slate-700">
            <p className="font-semibold text-slate-900">Our Father in heaven,</p>
            <p>hallowed be your name.</p>
            <p>your kingdom come,</p>
            <p>your will be done,</p>
            <p>on earth as it is in heaven.</p>
            <p>Give us today our daily bread.</p>
            <p>And forgive us our debts,</p>
            <p>as we also have forgiven our debtors.</p>
            <p>And lead us not into temptation,</p>
            <p>but deliver us from the evil one.</p>
            <p className="pt-2 font-semibold text-slate-900">For yours is the kingdom and the power and the glory forever. Amen.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
