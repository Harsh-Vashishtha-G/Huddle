import Link from 'next/link'
import { ArrowRight, Search, Clock, Bell, CheckCircle, RefreshCw, Download, Shield } from 'lucide-react'

export const metadata = {
  title: 'How It Works — Huddle',
  description: 'Learn how Huddle\'s conflict-free booking engine works in three simple steps — browse, book, and get notified.',
}

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Explore Resources',
    subtitle: 'Find exactly what your team needs',
    body: 'Browse the full catalog of bookable resources — conference rooms, equipment, collaborative spaces, and more. Each listing shows real-time availability, seating capacity, and whether the resource requires admin approval before being confirmed.',
    details: [
      'Filterable resource catalog with capacity info',
      'Real-time availability heatmap (day & week view)',
      'Clear approval-required badges',
    ],
  },
  {
    number: '02',
    icon: Clock,
    title: 'Pick Your Slot',
    subtitle: 'One-time or recurring — your call',
    body: 'Select a 30-minute time window from the visual timeline. Need a weekly standup room? Toggle recurring booking and choose how many weeks to repeat — up to 12. Every slot is independently conflict-checked at the database level before it\'s committed.',
    details: [
      '30-minute granularity with visual timeline',
      'Weekly recurring bookings up to 12 weeks',
      'Atomic PostgreSQL EXCLUDE constraint check',
    ],
  },
  {
    number: '03',
    icon: Bell,
    title: 'Get Notified Instantly',
    subtitle: 'Real-time status, zero polling',
    body: 'The moment your booking is approved, rejected, or hits a conflict, you\'ll receive an in-app notification via Supabase Realtime WebSockets — no page refresh needed. Download a standard .ics file to add the booking straight to your calendar.',
    details: [
      'Live WebSocket notifications (no polling)',
      'Approval & rejection alerts',
      'RFC 5545 .ics calendar export',
    ],
  },
]

const adminSteps = [
  {
    icon: Shield,
    title: 'Manage Resources',
    body: 'Create, edit, or delete bookable resources. Mark premium spaces as approval-required to maintain control over high-demand rooms.',
  },
  {
    icon: CheckCircle,
    title: 'Review Requests',
    body: 'A dedicated Approvals queue surfaces all pending requests. Approve or reject with one click — the requester is notified in real time.',
  },
  {
    icon: RefreshCw,
    title: 'Full Audit Trail',
    body: 'Every booking state transition is stored — pending → approved → cancelled. Admins always have visibility into who booked what and when.',
  },
]

export default function HowItWorksPage() {
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
                { name: 'About', href: '/about' },
              ].map(({ name, href }) => {
                const isActive = href === '/how-it-works'
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
            <div className="flex-shrink-0 flex justify-end items-center gap-3">
              <Link href="/login" className="whitespace-nowrap text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-full border border-gray-200 hover:border-gray-300">
                Log In
              </Link>
              <Link href="/login" className="whitespace-nowrap inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors">
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
            Simple 3-Step Flow
          </span>
          <h1 className="text-5xl font-black tracking-tight text-gray-900 sm:text-6xl">
            How Huddle Works
          </h1>
          <p className="mt-5 text-lg text-gray-600 leading-relaxed">
            From browsing available rooms to receiving real-time notifications — Huddle keeps your team coordinated without the back-and-forth.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-20">
          {steps.map((step, i) => {
            const Icon = step.icon
            const isEven = i % 2 === 1
            return (
              <div
                key={step.number}
                className={`flex flex-col gap-10 md:flex-row md:items-center ${isEven ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Visual block */}
                <div className="flex-1">
                  <div className="relative rounded-3xl border border-gray-100 bg-gray-50/60 p-10 shadow-sm">
                    <span className="absolute top-6 right-6 text-6xl font-black text-gray-100 select-none">
                      {step.number}
                    </span>
                    <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 shadow-md shadow-emerald-500/20">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <ul className="space-y-3">
                      {step.details.map((d) => (
                        <li key={d} className="flex items-start gap-2.5 text-sm text-gray-600">
                          <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Text block */}
                <div className="flex-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                    Step {step.number}
                  </span>
                  <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
                    {step.title}
                  </h2>
                  <p className="mt-1 text-sm font-semibold text-gray-500">{step.subtitle}</p>
                  <p className="mt-4 text-base leading-relaxed text-gray-600">{step.body}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-gray-100 mx-auto max-w-5xl" />

      {/* Admin Flow */}
      <section className="bg-gray-50/60 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">For Admins</span>
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900">Full Control, Zero Friction</h2>
            <p className="mt-3 text-gray-600">Admins get a dedicated toolkit to manage resources and approvals.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {adminSteps.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm hover:border-emerald-200 transition-colors">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                  <Icon className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="text-base font-bold text-gray-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-3xl font-extrabold text-gray-900">Ready to try it?</h2>
          <p className="mt-3 text-gray-600">Sign in and make your first booking in under 60 seconds.</p>
          <Link
            href="/login"
            className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-emerald-600 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all hover:scale-105"
          >
            Start Booking Now <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Huddle. Built with Next.js & Supabase.
      </footer>
    </div>
  )
}
