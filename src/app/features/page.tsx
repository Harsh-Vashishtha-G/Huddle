import Link from 'next/link'
import {
  ArrowRight, Shield, Clock, CheckCircle, Zap, Users, Calendar,
  Lock, Database, RefreshCw, Download, Bell, Eye, Layers, ChevronRight
} from 'lucide-react'

export const metadata = {
  title: 'Features — Huddle',
  description: 'Explore every feature of Huddle — conflict-free scheduling, approval workflows, real-time notifications, and more.',
}

const coreFeatures = [
  {
    icon: Shield,
    title: 'Zero Double-Bookings',
    tag: 'Core',
    body: 'Powered by a PostgreSQL EXCLUDE constraint on tstzrange columns — atomically prevents any two overlapping reservations for the same resource, even under simultaneous concurrent requests.',
    detail: 'Uses btree_gist extension with EXCLUDE USING gist(resource_id WITH =, time_range WITH &&)',
  },
  {
    icon: Clock,
    title: 'Recurring Reservations',
    tag: 'Scheduling',
    body: 'Book a weekly standing meeting in one step. Repeat for up to 12 weeks — each occurrence is materialized as its own row, independently conflict-checked and individually cancellable.',
    detail: 'Recurrence rule stored as JSON; rows generated at request time in a server action',
  },
  {
    icon: CheckCircle,
    title: 'Approval Workflows',
    tag: 'Admin',
    body: 'Mark premium resources as requiring admin sign-off. Booking requests enter a "pending" state; admins approve or reject from a dedicated queue, with instant requester notification.',
    detail: 'State machine: pending → approved / rejected → cancelled',
  },
  {
    icon: Zap,
    title: 'Real-time Notifications',
    tag: 'Realtime',
    body: 'In-app alerts fire the instant your booking status changes — approved, rejected, or conflict detected. Powered by Supabase Realtime WebSocket CDC, not polling.',
    detail: 'Persistent notification bell with unread badge and mark-all-read',
  },
  {
    icon: Users,
    title: 'Role-based Access Control',
    tag: 'Security',
    body: 'Admin and member roles enforced at the Postgres Row Level Security layer — not just in the UI. Members cannot approve their own bookings via any API route or direct DB call.',
    detail: 'RLS policies on bookings, resources, notifications, and profiles tables',
  },
  {
    icon: Calendar,
    title: 'Calendar Export (.ics)',
    tag: 'Productivity',
    body: 'Download a standard RFC 5545 .ics file for any confirmed booking. Drag it into Google Calendar, Outlook, or Apple Calendar instantly — no third-party integration required.',
    detail: 'Generated client-side using ics.js with correct DTSTART, DTEND, and SUMMARY',
  },
]

const technicalFeatures = [
  {
    icon: Database,
    title: 'PostgreSQL tstzrange Columns',
    body: 'Time slots stored as native timestamp range types — enabling range overlap checks natively in SQL without application-layer logic.',
  },
  {
    icon: Lock,
    title: 'Atomic Conflict Detection',
    body: 'EXCLUDE constraint uses GiST index for sub-millisecond overlap checks within a single transaction — no race conditions possible.',
  },
  {
    icon: Eye,
    title: 'Availability Timeline',
    body: 'Day and week view grids show booked/free blocks per resource at a glance. Toggle between views with a single click.',
  },
  {
    icon: RefreshCw,
    title: 'Full Audit Trail',
    body: 'Every state transition is persisted with timestamps. Admins always have full visibility into who booked what, and when.',
  },
  {
    icon: Bell,
    title: 'Persistent Notification Log',
    body: 'All notifications are stored in the database — not just ephemeral toasts. Users can review their full notification history anytime.',
  },
  {
    icon: Layers,
    title: 'Auto-seeded Demo Data',
    body: 'Fresh deployments auto-populate sample conference rooms and equipment so you can explore the system without manual setup.',
  },
  {
    icon: Download,
    title: 'ICS File Generation',
    body: 'Client-side RFC 5545 compliant .ics generation — works with every major calendar app without any OAuth or API keys.',
  },
  {
    icon: Shield,
    title: 'Supabase Auth Integration',
    body: 'Secure session management via Supabase Auth cookies. Server components check auth server-side before rendering any protected page.',
  },
]

const tagColors: Record<string, string> = {
  Core: 'bg-emerald-50 text-emerald-700',
  Scheduling: 'bg-blue-50 text-blue-700',
  Admin: 'bg-violet-50 text-violet-700',
  Realtime: 'bg-amber-50 text-amber-700',
  Security: 'bg-red-50 text-red-700',
  Productivity: 'bg-teal-50 text-teal-700',
}

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tight text-gray-900 hover:text-emerald-600 transition-colors">
              Huddle
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {[
                { name: 'Home', href: '/' },
                { name: 'How It Works', href: '/how-it-works' },
                { name: 'Features', href: '/features' },
              ].map(({ name, href }) => {
                const isActive = href === '/features'
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {name}
                  </Link>
                )
              })}
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-full border border-gray-200 hover:border-gray-300">
                Log In
              </Link>
              <Link href="/login" className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors">
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 text-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-100/60 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4">
          <span className="inline-block rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-800 mb-6">
            Everything Included
          </span>
          <h1 className="text-5xl font-black tracking-tight text-gray-900 sm:text-6xl">
            Enterprise Features,<br />
            <span className="text-emerald-600">Built In</span>
          </h1>
          <p className="mt-5 text-lg text-gray-600 leading-relaxed">
            Huddle ships with every feature your team needs — conflict-free scheduling, real-time notifications, admin approval workflows, and calendar export. No plugins, no extras.
          </p>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="border-y border-gray-100 bg-gray-50/60 py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
            {[
              { value: '100%', label: 'Conflict Prevention' },
              { value: '< 1s', label: 'Atomic Booking Lock' },
              { value: 'Real-time', label: 'WebSocket Alerts' },
              { value: 'RFC 5545', label: '.ics Calendar Files' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-3xl font-black text-gray-900 sm:text-4xl">{value}</div>
                <div className="mt-1 text-xs font-medium text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Core Features</span>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">What Makes Huddle Different</h2>
          <p className="mt-3 text-gray-600">Each feature is built on solid engineering — not workarounds.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {coreFeatures.map(({ icon: Icon, title, tag, body, detail }) => (
            <div
              key={title}
              className="group rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                  <Icon className="h-5 w-5 text-emerald-600" />
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tagColors[tag]}`}>
                  {tag}
                </span>
              </div>
              <h3 className="text-base font-bold text-gray-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{body}</p>
              <p className="mt-4 rounded-lg bg-gray-50 px-3 py-2.5 text-[11px] font-mono text-gray-500 leading-relaxed">
                {detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Features */}
      <section className="bg-gray-50/60 border-y border-gray-100 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Under the Hood</span>
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">Technical Depth</h2>
            <p className="mt-3 text-gray-600">Built on solid engineering decisions that scale.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {technicalFeatures.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:border-emerald-200 transition-colors">
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
                  <Icon className="h-4 w-4 text-emerald-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">{title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8 text-center">
        <div className="relative overflow-hidden rounded-3xl bg-emerald-600 p-10 text-white shadow-xl shadow-emerald-600/10 sm:p-16">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/5" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/5" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">All features, zero setup.</h2>
            <p className="mt-3 text-emerald-100">Sign in and your workspace is ready in seconds.</p>
            <Link
              href="/login"
              className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-base font-bold text-emerald-800 shadow-md transition-all hover:bg-emerald-50 hover:scale-105"
            >
              Access Huddle <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Huddle. Built with Next.js & Supabase.
      </footer>
    </div>
  )
}
