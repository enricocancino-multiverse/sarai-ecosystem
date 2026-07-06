import Link from "next/link";

interface SiteShellProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function SiteShell({
  children,
  title = "Sarai Ilocos | Ecosystem",
  description = "A simple, green, and easy-to-navigate workplace for SARAI Region 1.",
}: SiteShellProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.14),transparent_35%),linear-gradient(135deg,#f8fdf9_0%,#f1f8f3_100%)] text-slate-800">
      <header className="sticky top-0 z-20 border-b border-emerald-100/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-sm font-bold text-white shadow-sm">
              SI
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.24em] text-emerald-700">SARAI ILOCOS</p>
              <p className="text-xs text-slate-500">Ecosystem Portal</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <Link href="/dts" className="transition hover:text-emerald-700">
              DTS
            </Link>
            <Link href="/attendance" className="transition hover:text-emerald-700">
              Attendance
            </Link>
            <Link href="/sarai-achievements" className="transition hover:text-emerald-700">
              Achievements & News
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-50"
            >
              Sign In
            </Link>
            <Link
              href="/admin"
              className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <section className="rounded-4xl border border-emerald-100 bg-white/90 p-7 shadow-[0_20px_60px_-24px_rgba(16,185,129,0.28)] sm:p-10 lg:p-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-4 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                {title}
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                A full-fledged workplace for SARAI Region 1.
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                {description}
              </p>
            </div>
            <div className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-5 text-sm text-slate-700 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Commissioned by</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">DOST Region 1</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/login" className="rounded-full bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700">
                  Open Portal
                </Link>
                <Link href="/dts" className="rounded-full border border-emerald-200 px-4 py-2 font-semibold text-emerald-700 transition hover:bg-white">
                  Explore DTS
                </Link>
              </div>
            </div>
          </div>
        </section>

        {children}
      </main>

      <footer className="border-t border-emerald-100 bg-white/80 py-6 text-center text-sm text-slate-500">
        <p>© 2026 SARAI Ilocos Ecosystem. Built for digitalized field operations, attendance, and essential news.</p>
      </footer>
    </div>
  );
}
