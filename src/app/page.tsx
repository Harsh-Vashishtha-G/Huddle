import { createClient } from '@/utils/supabase/server'
import ResourceDashboard from '@/components/ResourceDashboard'
import Link from 'next/link'
import { ArrowRight, Shield, Clock, Users, Calendar, CheckCircle, Zap } from 'lucide-react'

export const metadata = {
  title: 'Huddle — Team Resource & Room Booking',
  description: 'Book conference rooms, equipment, and shared spaces instantly. Zero scheduling conflicts, real-time availability, and smart approval workflows.',
}

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#040712]">
        <div className="ambient-glow" />

        {/* Sticky header */}
        <header className="sticky top-0 z-50 border-b border-white/5 bg-[#040712]/80 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-lg font-bold tracking-tight text-white">Huddle</span>
              </div>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:shadow-indigo-500/40 hover:-translate-y-px"
              >
                Sign In <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="relative z-10 px-4 pt-24 pb-20 text-center sm:pt-32 sm:pb-28">
          {/* Decorative orbs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-48 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />
            <div className="absolute top-1/3 right-1/4 h-[300px] w-[300px] rounded-full bg-purple-600/15 blur-[90px]" />
            <div className="absolute bottom-0 left-1/4 h-[250px] w-[250px] rounded-full bg-violet-600/10 blur-[80px]" />
          </div>

          <div className="relative mx-auto max-w-4xl">
            {/* Pill badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 backdrop-blur-sm">
              <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-400" />
              Conflict-free scheduling, enforced at the database layer
            </div>

            <h1 className="text-5xl font-black leading-[1.08] tracking-tight text-white sm:text-7xl">
              Book smarter.
              <br />
              <span className="gradient-text">Collaborate faster.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
              Huddle gives your team instant, conflict-free access to conference rooms, equipment, and shared spaces — with real-time availability and smart approval workflows.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/login"
                className="btn-primary inline-flex items-center gap-2.5 rounded-xl px-8 py-3.5 text-base font-bold text-white"
              >
                Book Your First Slot
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 text-base font-semibold text-slate-300 backdrop-blur-sm transition-all duration-200 hover:bg-white/10 hover:text-white"
              >
                See how it works
              </a>
            </div>
          </div>

          {/* Stats strip */}
          <div className="relative mx-auto mt-20 grid max-w-3xl grid-cols-3 divide-x divide-white/5">
            {[
              { value: '< 1s', label: 'Booking confirmation' },
              { value: '100%', label: 'Conflict prevention' },
              { value: 'Live', label: 'Real-time updates' },
            ].map((stat) => (
              <div key={stat.label} className="px-6 py-4 text-center first:pl-0 last:pr-0">
                <div className="text-2xl font-black text-white sm:text-3xl">{stat.value}</div>
                <div className="mt-1 text-xs text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features grid */}
        <section id="features" className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Everything your team needs
            </h2>
            <p className="mt-3 text-slate-400">Built for real teams with real scheduling requirements.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Shield,
                color: 'indigo',
                title: 'Zero Double-Bookings',
                body: 'Powered by a Postgres EXCLUDE constraint — atomically prevents any two overlapping reservations, even under simultaneous requests.',
              },
              {
                icon: Clock,
                color: 'violet',
                title: 'Recurring Reservations',
                body: 'Book a weekly standing meeting in seconds. Repeat for up to 12 weeks, materialized as individual rows so each slot is fully conflict-checked.',
              },
              {
                icon: CheckCircle,
                color: 'purple',
                title: 'Approval Workflows',
                body: 'Mark premium resources as requiring admin sign-off. Members request, admins approve or reject — all tracked in the booking status state machine.',
              },
              {
                icon: Zap,
                color: 'indigo',
                title: 'Real-time Notifications',
                body: 'Instant in-app alerts via Supabase Realtime WebSockets — not polling. Know the moment your booking is approved, rejected, or conflicts.',
              },
              {
                icon: Users,
                color: 'violet',
                title: 'Role-based Access',
                body: 'Admin and member roles enforced at the Postgres RLS layer — not just in the UI. Members cannot approve their own bookings via any route.',
              },
              {
                icon: Calendar,
                color: 'purple',
                title: 'Calendar Export',
                body: 'Download a standard .ics file for any confirmed booking. Drag it into Google Calendar, Outlook, or Apple Calendar instantly.',
              },
            ].map(({ icon: Icon, color, title, body }) => (
              <div
                key={title}
                className="glass-card group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/10"
              >
                <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${
                  color === 'indigo' ? 'bg-indigo-500/15 text-indigo-400'
                  : color === 'violet' ? 'bg-violet-500/15 text-violet-400'
                  : 'bg-purple-500/15 text-purple-400'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-base font-bold text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA band */}
        <section className="relative z-10 mx-auto max-w-4xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600/30 via-purple-600/20 to-violet-600/10 p-px">
            <div className="rounded-3xl bg-[#080d1e] px-8 py-12 text-center sm:py-16">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Ready to book smarter?</h2>
              <p className="mt-3 text-slate-400">Join in seconds. No credit card required.</p>
              <Link
                href="/login"
                className="btn-primary mt-8 inline-flex items-center gap-2.5 rounded-xl px-8 py-3.5 text-base font-bold text-white"
              >
                Get Started Free <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        <footer className="relative z-10 border-t border-white/5 py-8 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} Huddle. Built with Next.js & Supabase.
        </footer>
      </div>
    )
  }

  // Authenticated: load resource dashboard
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

  let { data: resources } = await supabase.from('resources').select('*').order('name', { ascending: true })

  // Auto-seed sample resources if none exist
  if (!resources || resources.length === 0) {
    const sampleResources = [
      { name: 'Conference Room A', description: 'High-end meeting space with 85" TV, video conferencing bar, and seating for 12.', capacity: 12, requires_approval: true },
      { name: 'Standing Desk Pod 1', description: 'Ergonomic workspace with 34" ultrawide monitor, standing desk, and premium task chair.', capacity: 1, requires_approval: false },
      { name: 'Projector Kit', description: 'Portable 4K smart projector, tripod stand, and pull-up screen in a carrying bag.', capacity: 1, requires_approval: false },
      { name: 'Design Workshop Area', description: 'Collaborative area with whiteboard walls, smart display, and flexible seating.', capacity: 8, requires_approval: true },
    ]
    try {
      await supabase.from('resources').insert(sampleResources)
      const { data: refetched } = await supabase.from('resources').select('*').order('name', { ascending: true })
      if (refetched && refetched.length > 0) resources = refetched
    } catch (err) {
      console.error('Auto-seed failed (likely RLS for non-admins):', err)
    }
  }

  return <ResourceDashboard resources={resources || []} role={profile?.role || 'member'} />
}
