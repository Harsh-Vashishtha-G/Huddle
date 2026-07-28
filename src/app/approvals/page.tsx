import { createClient } from '@/utils/supabase/server'
import { approveBooking, rejectBooking } from '@/app/actions/booking'
import { parseTstzrange } from '@/utils/date'
import { CheckSquare, User, Check, X } from 'lucide-react'
import { redirect } from 'next/navigation'

interface BookingWithRelations {
  id: string
  resource_id: string
  user_id: string
  time_range: string
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  created_at: string
  updated_at: string
  recurrence_group_id: string | null
  resources: {
    name: string
  } | null
  profiles: {
    display_name: string
  } | null
}

export default async function ApprovalsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  // Fetch pending bookings with resource and requestor profile details
  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      resources (
        name
      ),
      profiles (
        display_name
      )
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <CheckSquare className="h-6 w-6 text-indigo-550" />
          Pending Approvals
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Review booking requests for resources requiring administrative approval.
        </p>
      </div>

      {(!bookings || bookings.length === 0) ? (
        <div className="text-center py-16 border border-dashed border-slate-900 rounded-2xl bg-slate-950/20">
          <CheckSquare className="h-10 w-10 mx-auto text-slate-650 stroke-1 mb-3" />
          <p className="text-sm text-slate-400">All caught up! No pending bookings to review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b: BookingWithRelations) => {
            const range = parseTstzrange(b.time_range)
            if (!range) return null

            const dateStr = range.start.toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })

            const timeStr = `${range.start.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })} - ${range.end.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}`

            return (
              <div
                key={b.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 rounded-xl border border-slate-900 bg-slate-950/50"
              >
                <div>
                  <h3 className="font-bold text-slate-200 text-base">{b.resources?.name}</h3>
                  <p className="mt-1.5 text-sm text-slate-300 flex items-center gap-1.5">
                    <span className="font-medium">{dateStr}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-indigo-400 font-semibold">{timeStr}</span>
                  </p>
                  
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                    <User className="h-3.5 w-3.5 text-indigo-400" />
                    Requested by: <span className="text-slate-350 font-semibold">{b.profiles?.display_name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 md:pt-0">
                  <form
                    action={async () => {
                      'use server'
                      await approveBooking(b.id)
                    }}
                  >
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-650 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-555 transition cursor-pointer"
                    >
                      <Check className="h-4.5 w-4.5" /> Approve
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
                      className="inline-flex items-center gap-1 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition cursor-pointer"
                    >
                      <X className="h-4.5 w-4.5" /> Reject
                    </button>
                  </form>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
