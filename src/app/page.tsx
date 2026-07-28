import { createClient } from '@/utils/supabase/server'
import ResourceDashboard from '@/components/ResourceDashboard'
import Link from 'next/link'
import { ArrowRight, Shield, Clock, Users, Calendar, CheckCircle, Zap, Sparkles, Check, ChevronRight } from 'lucide-react'

export const metadata = {
  title: 'Huddle — Enterprise Team Resource & Room Booking System',
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
              <div className="flex items-center gap-8">
                <span className="text-xl font-bold tracking-tight text-gray-900">Huddle</span>
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                  <a href="#how-it-works" className="transition hover:text-emerald-600">How It Works</a>
                  <a href="#features" className="transition hover:text-emerald-600">Features</a>
                </nav>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="btn-secondary px-4 py-2 text-sm font-semibold"
                >
                  Log In
                </Link>
                <Link
                  href="/login"
                  className="btn-primary inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold"
                >
                  Get Started <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative z-10 px-4 pt-20 pb-20 text-center sm:pt-28 sm:pb-28">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-100/60 blur-[120px]" />
          </div>

          <div className="relative mx-auto max-w-4xl">
            {/* Pill badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>Conflict-Free Scheduling Engine for High-Velocity Teams</span>
            </div>

            <h1 className="text-5xl font-black leading-[1.08] tracking-tight text-gray-900 sm:text-7xl">
              Reserve rooms &amp; assets.
              <br />
              <span className="gradient-text">Zero double-bookings.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 sm:text-xl">
              Huddle gives your team instant, conflict-free access to conference rooms, hardware, and shared equipment with real-time availability and database-enforced lock constraints.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/login"
                className="btn-primary inline-flex items-center gap-2.5 px-8 py-3.5 text-base font-bold shadow-lg shadow-emerald-500/20"
              >
                Start Booking Now
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#how-it-works"
                className="btn-secondary inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold"
              >
                How It Works
              </a>
            </div>

            {/* Feature bullets */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-gray-500">
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-600" /> PostgreSQL EXCLUDE Locks</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-600" /> WebSockets Realtime Alerts</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-600" /> Admin Approval Engine</span>
            </div>
          </div>

          {/* Interactive Hero Preview Card */}
          <div className="relative mx-auto mt-16 max-w-5xl rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl shadow-gray-200/80 sm:p-6 text-left">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
                <span className="ml-2 text-xs font-semibold text-gray-400">huddle.app/resources/conference-room-a</span>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">⚡ Live Timeline</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Resource</span>
                <h4 className="text-base font-bold text-gray-900 mt-1">Executive Boardroom A</h4>
                <p className="text-xs text-gray-500 mt-1">12 seats · 85&quot; TV · 4K Video Bar</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="badge-approved rounded-full px-2.5 py-0.5 text-[10px] font-bold">Instant Book</span>
                  <span className="text-xs text-gray-500">08:00 AM - 08:00 PM</span>
                </div>
              </div>

              <div className="md:col-span-2 rounded-xl border border-gray-100 bg-white p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                  <span>Today&apos;s Reservations</span>
                  <span className="text-emerald-600">3 Slots Booked</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/40 p-2.5 text-xs">
                  <div>
                    <span className="font-bold text-gray-900">09:00 AM – 10:30 AM</span>
                    <span className="ml-2 text-gray-500">Q3 Strategy Review (Sarah T.)</span>
                  </div>
                  <span className="badge-approved rounded-full px-2 py-0.5 text-[10px] font-bold">Approved</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50/40 p-2.5 text-xs">
                  <div>
                    <span className="font-bold text-gray-900">02:00 PM – 03:30 PM</span>
                    <span className="ml-2 text-gray-500">Design Sprint Sync (Alex M.)</span>
                  </div>
                  <span className="badge-pending rounded-full px-2 py-0.5 text-[10px] font-bold">Pending</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="border-y border-gray-100 bg-gray-50/60 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
              <div>
                <div className="text-3xl font-black text-gray-900 sm:text-4xl">100%</div>
                <div className="mt-1 text-xs font-medium text-gray-500">Conflict Prevention</div>
              </div>
              <div>
                <div className="text-3xl font-black text-gray-900 sm:text-4xl">&lt; 1s</div>
                <div className="mt-1 text-xs font-medium text-gray-500">Atomic Booking Lock</div>
              </div>
              <div>
                <div className="text-3xl font-black text-gray-900 sm:text-4xl">Real-time</div>
                <div className="mt-1 text-xs font-medium text-gray-500">WebSocket CDC Alerts</div>
              </div>
              <div>
                <div className="text-3xl font-black text-gray-900 sm:text-4xl">RFC 5545</div>
                <div className="mt-1 text-xs font-medium text-gray-500">Local .ics Calendar Files</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Simple 3-Step Flow</span>
              <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">How Huddle Works</h2>
              <p className="mt-3 text-gray-600">Built for seamless team coordination with full admin oversight.</p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="glass-card rounded-2xl p-8 bg-white border border-gray-200 relative">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-base font-black text-emerald-700 mb-6">1</span>
                <h3 className="text-lg font-bold text-gray-900">Explore &amp; Select</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">Browse available meeting rooms, equipment, or collaborative spaces with seat capacity &amp; approval requirements.</p>
              </div>

              <div className="glass-card rounded-2xl p-8 bg-white border border-gray-200 relative">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-base font-black text-emerald-700 mb-6">2</span>
                <h3 className="text-lg font-bold text-gray-900">Choose Slots &amp; Recurrence</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">Pick 30-minute time slots or schedule weekly standing meetings for up to 12 weeks with instant atomic conflict checks.</p>
              </div>

              <div className="glass-card rounded-2xl p-8 bg-white border border-gray-200 relative">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-base font-black text-emerald-700 mb-6">3</span>
                <h3 className="text-lg font-bold text-gray-900">Sync &amp; Receive Alerts</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">Get live WebSocket notifications on approval status and export standard .ics files straight to your calendar.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Features Grid */}
        <section id="features" className="bg-gray-50/50 border-y border-gray-100 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-14 text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Enterprise Features Built-in
              </h2>
              <p className="mt-3 text-gray-600">Designed for team productivity with zero scheduling friction.</p>
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

        {/* CTA Section */}
        <section className="relative z-10 mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-emerald-600 p-8 text-center text-white sm:p-16 shadow-xl shadow-emerald-600/10">
            <div className="relative z-10">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Ready to streamline your workspace?</h2>
              <p className="mt-3 text-emerald-100">Sign in with your team credentials to start reserving slots immediately.</p>
              <Link
                href="/login"
                className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-base font-bold text-emerald-800 shadow-md transition-all hover:bg-emerald-50 hover:scale-105"
              >
                Access Huddle <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        <footer className="relative z-10 border-t border-gray-100 py-8 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Huddle. Built with Next.js &amp; Supabase.
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
