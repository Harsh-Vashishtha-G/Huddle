import { createClient } from '@/utils/supabase/server'
import ResourceDashboard from '@/components/ResourceDashboard'
import Link from 'next/link'
import { Layers, Calendar, CheckCircle2, Shield, ArrowRight } from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-indigo-500 selection:text-white">
        {/* Navigation Bar */}
        <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-6 w-6 text-indigo-500" />
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Huddle
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition cursor-pointer"
              >
                Get Started
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 sm:py-32">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-3xl -z-10" />
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-cyan-500/10 blur-3xl -z-10" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Resource Booking, <br />
              Simplified.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 leading-relaxed">
              Book conference rooms, hot desks, workshop pods, and projector kits in seconds. Zero scheduling conflicts, instant real-time updates.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/login"
                className="group inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-bold text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-650/20 cursor-pointer"
              >
                Book Your First Slot
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-slate-900 bg-slate-950/20">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="flex flex-col gap-4 p-6 rounded-2xl border border-slate-900 bg-slate-950/40">
              <div className="w-10 h-10 rounded-lg bg-indigo-950/50 flex items-center justify-center border border-indigo-900/50">
                <CheckCircle2 className="h-5 w-5 text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-200">Zero Overlaps</h3>
              <p className="text-sm text-slate-450 leading-relaxed">
                Powered by transactional database exclusions. If a slot is booked, it cannot be reserved by anyone else—no exceptions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col gap-4 p-6 rounded-2xl border border-slate-900 bg-slate-950/40">
              <div className="w-10 h-10 rounded-lg bg-indigo-950/50 flex items-center justify-center border border-indigo-900/50">
                <Calendar className="h-5 w-5 text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-200">Recurring Reservations</h3>
              <p className="text-sm text-slate-450 leading-relaxed">
                Need a room every Monday? Create a recurring series for up to 12 weeks with a single click.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col gap-4 p-6 rounded-2xl border border-slate-900 bg-slate-950/40">
              <div className="w-10 h-10 rounded-lg bg-indigo-950/50 flex items-center justify-center border border-indigo-900/50">
                <Shield className="h-5 w-5 text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-200">Approval Workflows</h3>
              <p className="text-sm text-slate-450 leading-relaxed">
                Keep key equipment controlled. Set resources to require admin confirmation before their slots are finalized.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-900 mt-20 py-8 text-center text-xs text-slate-600">
          &copy; {new Date().getFullYear()} Huddle. All rights reserved.
        </footer>
      </div>
    )
  }

  // Fetch current user's profile role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // Fetch all bookable resources
  let { data: resources } = await supabase
    .from('resources')
    .select('*')
    .order('name', { ascending: true })

  // Auto-seed if empty and user is logged in
  if (user && (!resources || resources.length === 0)) {
    const sampleResources = [
      {
        name: 'Conference Room A',
        description: 'High-end meeting space with 85" TV, video conferencing bar, and seating for 12.',
        capacity: 12,
        requires_approval: true,
      },
      {
        name: 'Standing Desk Pod 1',
        description: 'Ergonomic workspace with 34" ultrawide monitor, standing desk, and premium task chair.',
        capacity: 1,
        requires_approval: false,
      },
      {
        name: 'Projector Kit',
        description: 'Portable 4K smart projector, tripod stand, and pull-up screen in a carrying bag.',
        capacity: 1,
        requires_approval: false,
      },
      {
        name: 'Design Workshop Area',
        description: 'Collaborative area with whiteboard walls, smart display, and flexible seating.',
        capacity: 8,
        requires_approval: true,
      },
    ]

    try {
      await supabase.from('resources').insert(sampleResources)
      const { data: refetched } = await supabase
        .from('resources')
        .select('*')
        .order('name', { ascending: true })
      if (refetched && refetched.length > 0) {
        resources = refetched
      }
    } catch (err) {
      console.error('Seeding failed (likely due to RLS constraints for non-admins):', err)
    }
  }

  return (
    <ResourceDashboard
      resources={resources || []}
      role={profile?.role || 'member'}
    />
  )
}
