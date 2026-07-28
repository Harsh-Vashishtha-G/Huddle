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
    <div className="relative min-h-screen bg-white text-gray-900">
      <div className="ambient-glow" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
            <CheckSquare className="h-3.5 w-3.5" />
            Admin Queue
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">Pending Approvals</h1>
          <p className="mt-1.5 text-sm text-gray-600">
            Review booking requests for resources that require administrative confirmation.
          </p>
        </div>

        {(!bookings || bookings.length === 0) ? (
          <div className="glass-card flex flex-col items-center gap-4 rounded-2xl py-20 text-center bg-gray-50/50">
            <CheckSquare className="h-10 w-10 stroke-1 text-gray-400" />
            <p className="text-sm text-gray-500">All clear! No pending bookings to review.</p>
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
                  className="glass-card flex flex-col gap-4 rounded-2xl p-5 md:flex-row md:items-center md:justify-between bg-white border border-gray-200"
                >
                  <div className="flex-1 min-w-0">
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="font-bold text-gray-900">{b.resources?.name}</h3>
                      <span className="badge-pending rounded-full px-2.5 py-0.5 text-xs font-semibold">Pending</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">{dateStr}</span>
                      <span className="mx-2 text-gray-300">·</span>
                      <span className="font-bold text-emerald-600">{timeStr}</span>
                    </p>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                      <User className="h-3.5 w-3.5 text-emerald-600" />
                      Requested by{' '}
                      <span className="font-semibold text-gray-800">{b.profiles?.display_name}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-400">
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
                        className="btn-primary inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold"
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
                        className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
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
