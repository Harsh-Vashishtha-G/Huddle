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
      <div className="relative min-h-screen overflow-hidden bg-white text-gray-900">
        <div className="ambient-glow" />

        {/* Sticky header */}
        <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xl font-bold tracking-tight text-gray-900">Huddle</span>
              </div>
              <Link
                href="/login"
                className="btn-primary inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold"
              >
                Sign In <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="relative z-10 px-4 pt-20 pb-20 text-center sm:pt-28 sm:pb-28">
          {/* Decorative background glow */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-100/60 blur-[100px]" />
          </div>

          <div className="relative mx-auto max-w-4xl">
            {/* Pill badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-800">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              Conflict-free scheduling, enforced at the database layer
            </div>

            <h1 className="text-5xl font-black leading-[1.08] tracking-tight text-gray-900 sm:text-7xl">
              Book smarter.
              <br />
              <span className="gradient-text">Collaborate faster.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 sm:text-xl">
              Huddle gives your team instant, conflict-free access to conference rooms, equipment, and shared spaces — with real-time availability and smart approval workflows.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/login"
                className="btn-primary inline-flex items-center gap-2.5 px-8 py-3.5 text-base font-bold"
              >
                Book Your First Slot
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#features"
                className="btn-secondary inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold"
              >
                See how it works
              </a>
            </div>
          </div>

          {/* Stats strip */}
          <div className="relative mx-auto mt-20 grid max-w-3xl grid-cols-3 divide-x divide-gray-200 rounded-2xl bg-gray-50/80 p-4 border border-gray-100">
            {[
              { value: '< 1s', label: 'Booking confirmation' },
              { value: '100%', label: 'Conflict prevention' },
              { value: 'Live', label: 'Real-time updates' },
            ].map((stat) => (
              <div key={stat.label} className="px-6 py-2 text-center">
                <div className="text-2xl font-black text-gray-900 sm:text-3xl">{stat.value}</div>
                <div className="mt-1 text-xs text-gray-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features grid */}
        <section id="features" className="relative z-10 bg-gray-50/50 border-y border-gray-100 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-14 text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Everything your team needs
              </h2>
              <p className="mt-3 text-gray-600">Built for real teams with real scheduling requirements.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Shield,
                  title: 'Zero Double-Bookings',
                  body: 'Powered by a Postgres EXCLUDE constraint — atomically prevents any two overlapping reservations, even under simultaneous requests.',
                },
                {
                  icon: Clock,
                  title: 'Recurring Reservations',
                  body: 'Book a weekly standing meeting in seconds. Repeat for up to 12 weeks, materialized as individual rows so each slot is fully conflict-checked.',
                },
                {
                  icon: CheckCircle,
                  title: 'Approval Workflows',
                  body: 'Mark premium resources as requiring admin sign-off. Members request, admins approve or reject — all tracked in the booking status state machine.',
                },
                {
                  icon: Zap,
                  title: 'Real-time Notifications',
                  body: 'Instant in-app alerts via Supabase Realtime WebSockets — not polling. Know the moment your booking is approved, rejected, or conflicts.',
                },
                {
                  icon: Users,
                  title: 'Role-based Access',
                  body: 'Admin and member roles enforced at the Postgres RLS layer — not just in the UI. Members cannot approve their own bookings via any route.',
                },
                {
                  icon: Calendar,
                  title: 'Calendar Export',
                  body: 'Download a standard .ics file for any confirmed booking. Drag it into Google Calendar, Outlook, or Apple Calendar instantly.',
                },
              ].map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="glass-card group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200"
                >
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-base font-bold text-gray-900">{title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA band */}
        <section className="relative z-10 mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-emerald-600 p-8 text-center text-white sm:p-16 shadow-xl shadow-emerald-600/10">
            <div className="relative z-10">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Ready to book smarter?</h2>
              <p className="mt-3 text-emerald-100">Join in seconds. No credit card required.</p>
              <Link
                href="/login"
                className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-base font-bold text-emerald-800 shadow-md transition-all hover:bg-emerald-50 hover:scale-105"
              >
                Get Started Free <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        <footer className="relative z-10 border-t border-gray-100 py-8 text-center text-xs text-gray-500">
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
