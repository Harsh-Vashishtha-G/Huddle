import { createClient } from '@/utils/supabase/server'
import { approveBooking, rejectBooking } from '@/app/actions/booking'
import { parseTstzrange } from '@/utils/date'
import { CheckSquare, User, Check, X, Clock } from 'lucide-react'
import { redirect } from 'next/navigation'

export const metadata = { title: 'Approvals — Huddle' }

interface BookingWithRelations {
  id: string
  resource_id: string
  user_id: string
  time_range: string
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  created_at: string
  recurrence_group_id: string | null
  resources: { name: string } | null
  profiles: { display_name: string } | null
}

export default async function ApprovalsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, resources(name), profiles(display_name)')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  return (
    <div className="relative min-h-screen">
      <div className="ambient-glow" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
            <CheckSquare className="h-3.5 w-3.5" />
            Admin Queue
          </div>
          <h1 className="text-2xl font-extrabold text-white sm:text-3xl">Pending Approvals</h1>
          <p className="mt-1.5 text-sm text-slate-400">
            Review booking requests for resources that require administrative confirmation.
          </p>
        </div>

        {(!bookings || bookings.length === 0) ? (
          <div className="glass-card flex flex-col items-center gap-4 rounded-2xl py-20 text-center">
            <CheckSquare className="h-10 w-10 stroke-1 text-slate-700" />
            <p className="text-sm text-slate-500">All clear! No pending bookings to review.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((b: BookingWithRelations) => {
              const range = parseTstzrange(b.time_range)
              if (!range) return null

              const dateStr = range.start.toLocaleDateString(undefined, {
                weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
              })
              const timeStr = `${range.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${range.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`

              return (
                <div
                  key={b.id}
                  className="glass-card flex flex-col gap-4 rounded-2xl border-amber-500/10 p-5 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="font-bold text-white">{b.resources?.name}</h3>
                      <span className="badge-pending rounded-full px-2.5 py-0.5 text-xs font-semibold">Pending</span>
                    </div>
                    <p className="text-sm text-slate-300">
                      <span className="font-medium">{dateStr}</span>
                      <span className="mx-2 text-slate-700">·</span>
                      <span className="font-bold text-indigo-400">{timeStr}</span>
                    </p>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                      <User className="h-3.5 w-3.5 text-indigo-400" />
                      Requested by{' '}
                      <span className="font-semibold text-slate-200">{b.profiles?.display_name}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600">
                      <Clock className="h-3 w-3" />
                      {new Date(b.created_at).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <form
                      action={async () => {
                        'use server'
                        await approveBooking(b.id)
                      }}
                    >
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/25 bg-emerald-500/12 px-4 py-2 text-xs font-bold text-emerald-400 transition hover:bg-emerald-500/20"
                      >
                        <Check className="h-4 w-4" /> Approve
                      </button>
                    </form>
                    <form
                      action={async () => {
                        'use server'
                        await rejectBooking(b.id)
                      }}
                    >
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/15 bg-red-500/8 px-4 py-2 text-xs font-bold text-red-400 transition hover:bg-red-500/15"
                      >
                        <X className="h-4 w-4" /> Reject
                      </button>
                    </form>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
