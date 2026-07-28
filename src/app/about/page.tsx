import Link from 'next/link'
import {
  ArrowRight, Shield, Zap, Users, Heart, Code2, Database,
  Globe, CheckCircle, Sparkles, Target, Lightbulb, Lock
} from 'lucide-react'

export const metadata = {
  title: 'About — Huddle',
  description: 'Learn about Huddle — the conflict-free team resource booking system built on Next.js, TypeScript, and Supabase.',
}

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'How It Works', href: '/how-it-works' },
  { name: 'Features', href: '/features' },
  { name: 'About', href: '/about' },
]

const values = [
  {
    icon: Shield,
    title: 'Correctness over Convenience',
    body: 'We use database-level constraints — not application-layer locks — to guarantee zero double-bookings. If it can fail under race conditions, we fix it at the source.',
  },
  {
    icon: Zap,
    title: 'Real-time, Not Polling',
    body: 'Notifications arrive via Supabase Realtime WebSockets the instant a booking status changes. No refresh loops. No stale UIs. Just live data.',
  },
  {
    icon: Lock,
    title: 'Security at Every Layer',
    body: 'Row Level Security is enforced at the Postgres layer. Admins can\'t be impersonated. Members can\'t approve their own bookings — period.',
  },
  {
    icon: Heart,
    title: 'Simplicity First',
    body: 'Huddle does one thing — room and resource booking — and does it extremely well. No feature bloat, no third-party calendar dependencies, no unnecessary complexity.',
  },
  {
    icon: Lightbulb,
    title: 'Transparency',
    body: 'Every booking state transition is stored. Every admin action is traceable. Your team always knows who booked what, when, and why it was approved or denied.',
  },
  {
    icon: Target,
    title: 'Built to Scale',
    body: 'PostgreSQL\'s GiST index on tstzrange columns means conflict checks are sub-millisecond even with thousands of concurrent bookings. No caching tricks needed.',
  },
]

const techStack = [
  { name: 'Next.js 16', role: 'Full-stack React framework', color: 'bg-gray-900', text: 'text-white' },
  { name: 'TypeScript', role: 'Type-safe codebase', color: 'bg-blue-600', text: 'text-white' },
  { name: 'Supabase', role: 'Auth, Database & Realtime', color: 'bg-emerald-600', text: 'text-white' },
  { name: 'PostgreSQL 17', role: 'Conflict-safe EXCLUDE constraints', color: 'bg-blue-800', text: 'text-white' },
  { name: 'Tailwind CSS v4', role: 'Utility-first styling', color: 'bg-cyan-500', text: 'text-white' },
  { name: 'Vercel', role: 'Edge deployment', color: 'bg-black', text: 'text-white' },
  { name: 'btree_gist', role: 'Range overlap indexing', color: 'bg-orange-500', text: 'text-white' },
  { name: 'RFC 5545 ICS', role: 'Calendar export standard', color: 'bg-violet-600', text: 'text-white' },
]

const timeline = [
  {
    phase: 'Phase 0',
    title: 'Foundation',
    items: ['Next.js 16 + TypeScript scaffold', 'Supabase project on Postgres 17', 'btree_gist extension enabled'],
  },
  {
    phase: 'Phase 1',
    title: 'Data Model & Roles',
    items: ['tstzrange bookings schema', 'EXCLUDE constraint for overlap prevention', 'RLS policies for admin vs member'],
  },
  {
    phase: 'Phase 2',
    title: 'Booking Core',
    items: ['Book, cancel, recurring support', 'Conflict detection at DB level', 'Admin approval workflow'],
  },
  {
    phase: 'Phase 3',
    title: 'Real-time & UX',
    items: ['WebSocket notification system', 'Availability timeline (day + week)', 'ICS calendar export'],
  },
  {
    phase: 'Phase 4',
    title: 'Polish & Deploy',
    items: ['White-and-green design system', 'Vercel production deployment', 'Concurrency test & README'],
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            {/* Logo */}
            <div className="w-32 flex-shrink-0">
              <Link href="/" className="text-xl font-bold tracking-tight text-gray-900 hover:text-emerald-600 transition-colors">
                Huddle
              </Link>
            </div>

            {/* Nav — center */}
            <nav className="hidden md:flex flex-1 justify-center items-center gap-1">
              {navLinks.map(({ name, href }) => {
                const isActive = href === '/about'
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

            {/* Actions */}
            <div className="w-32 flex-shrink-0 flex justify-end items-center gap-3">
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
      <section className="relative overflow-hidden py-24 text-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-100/60 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-800">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            Built for teams that move fast
          </div>
          <h1 className="text-5xl font-black tracking-tight text-gray-900 sm:text-6xl">
            About <span className="text-emerald-600">Huddle</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-gray-600">
            Huddle is an internal team resource and meeting room booking system built around one principle: <strong className="text-gray-900">scheduling conflicts should be impossible</strong>, not just unlikely.
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="border-y border-gray-100 bg-gray-50/60 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <Code2 className="mx-auto mb-4 h-8 w-8 text-emerald-600" />
          <blockquote className="text-2xl font-bold leading-snug text-gray-900 sm:text-3xl">
            "We don't prevent double-bookings at the application layer.<br />
            <span className="text-emerald-600">We make them structurally impossible at the database layer.</span>"
          </blockquote>
          <p className="mt-5 text-gray-600">
            Most booking systems rely on "check then insert" logic that breaks under concurrent load. Huddle uses PostgreSQL's <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-gray-800">EXCLUDE USING gist</code> constraint — a single atomic operation that makes any two overlapping bookings physically impossible to store simultaneously.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Our Principles</span>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">What We Stand For</h2>
          <p className="mt-3 text-gray-600">Every design decision in Huddle is guided by these values.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {values.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="group rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                <Icon className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="text-base font-bold text-gray-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="bg-gray-50/60 border-y border-gray-100 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Stack</span>
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900">Built On Proven Technology</h2>
            <p className="mt-3 text-gray-600">No exotic dependencies. Every choice is deliberate and production-grade.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {techStack.map(({ name, role, color, text }) => (
              <div key={name} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className={`mb-3 inline-flex rounded-lg ${color} px-2.5 py-1`}>
                  <span className={`text-xs font-bold ${text}`}>{name}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Build Timeline */}
      <section className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Journey</span>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">How Huddle Was Built</h2>
          <p className="mt-3 text-gray-600">A phased approach from data model to production deployment.</p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-emerald-100 hidden sm:block" />

          <div className="space-y-10">
            {timeline.map(({ phase, title, items }, i) => (
              <div key={phase} className="relative flex gap-6 sm:pl-12">
                {/* Step dot */}
                <div className="hidden sm:flex absolute left-0 h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-black shadow-md shadow-emerald-500/20 flex-shrink-0">
                  {i + 1}
                </div>

                <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:border-emerald-200 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="rounded-full bg-emerald-50 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                      {phase}
                    </span>
                    <h3 className="text-base font-bold text-gray-900">{title}</h3>
                  </div>
                  <ul className="space-y-1.5">
                    {items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 text-emerald-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Next */}
      <section className="bg-gray-50/60 border-t border-gray-100 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Roadmap</span>
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900">What We'd Build Next</h2>
            <p className="mt-3 text-gray-600">Given another week, here's what comes next.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Globe, title: 'Email Notifications', body: 'Supabase Edge Functions + Resend for transactional approval/rejection emails.' },
              { icon: Users, title: 'Waitlist Queue', body: 'Auto-notify the next user when a cancelled slot opens — no manual re-checking.' },
              { icon: Database, title: 'Booking Analytics', body: 'Peak hour heatmaps, utilization rates, and room occupancy dashboards for admins.' },
              { icon: Zap, title: 'Mobile PWA', body: 'Offline-capable Progressive Web App with push notifications and native install.' },
              { icon: CheckCircle, title: 'Resource Heatmap', body: 'Week-view availability across all resources simultaneously — not one at a time.' },
              { icon: Sparkles, title: 'AI Slot Suggestions', body: 'Suggest optimal time slots based on past booking patterns and team availability.' },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:border-emerald-200 transition-colors">
                <div className="mt-0.5 flex-shrink-0 h-8 w-8 inline-flex items-center justify-center rounded-lg bg-emerald-50">
                  <Icon className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8 text-center">
        <div className="relative overflow-hidden rounded-3xl bg-emerald-600 p-10 text-white shadow-xl shadow-emerald-600/10 sm:p-16">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/5" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/5" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Try Huddle Today</h2>
            <p className="mt-3 text-emerald-100">Sign in with your team account and book your first room in under a minute.</p>
            <Link
              href="/login"
              className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-base font-bold text-emerald-800 shadow-md transition-all hover:bg-emerald-50 hover:scale-105"
            >
              Get Started <ArrowRight className="h-5 w-5" />
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
