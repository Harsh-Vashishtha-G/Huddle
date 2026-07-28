import { createClient } from '@/utils/supabase/server'
import { cancelBooking } from '@/app/actions/booking'
import { parseTstzrange } from '@/utils/date'
import { Clock, Calendar, CheckCircle2, XCircle, AlertCircle, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import ExportICSButton from '@/components/ExportICSButton'

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
    requires_approval: boolean
  } | null
}

export default async function BookingsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Fetch bookings for the logged-in user
  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      resources (
        name,
        requires_approval
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Calendar className="h-6 w-6 text-indigo-550" />
          My Reservations
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Monitor status, export calendar files, or cancel reservations.
        </p>
      </div>

      {(!bookings || bookings.length === 0) ? (
        <div className="text-center py-16 border border-dashed border-slate-900 rounded-2xl bg-slate-950/20">
          <Clock className="h-10 w-10 mx-auto text-slate-650 stroke-1 mb-3" />
          <p className="text-sm text-slate-400">You haven&apos;t made any bookings yet.</p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition"
          >
            Find a resource &rarr;
          </Link>
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

            const isPendingOrApproved = b.status === 'pending' || b.status === 'approved'

            return (
              <div
                key={b.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 rounded-xl border border-slate-900 bg-slate-950/50"
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-200 text-base">{b.resources?.name}</h3>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        b.status === 'approved'
                          ? 'bg-emerald-950 text-emerald-400'
                          : b.status === 'pending'
                          ? 'bg-amber-950 text-amber-400'
                          : b.status === 'rejected'
                          ? 'bg-red-950 text-red-400'
                          : 'bg-slate-900 text-slate-500'
                      }`}
                    >
                      {b.status === 'approved' && <CheckCircle2 className="h-3 w-3" />}
                      {b.status === 'pending' && <HelpCircle className="h-3 w-3" />}
                      {b.status === 'rejected' && <AlertCircle className="h-3 w-3" />}
                      {b.status === 'cancelled' && <XCircle className="h-3 w-3" />}
                      {b.status}
                    </span>
                  </div>
                  
                  <p className="mt-2 text-sm text-slate-300 flex items-center gap-1.5">
                    <span className="font-medium">{dateStr}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-indigo-400 font-semibold">{timeStr}</span>
                  </p>
                  
                  <span className="mt-1 block text-[10px] text-slate-500">
                    Booked on: {new Date(b.created_at).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-2 md:pt-0">
                  {b.status === 'approved' && (
                    <ExportICSButton
                      booking={{ id: b.id, time_range: b.time_range, status: b.status }}
                      resourceName={b.resources?.name || 'Resource'}
                    />
                  )}
                  {isPendingOrApproved && (
                    <form
                      action={async () => {
                        'use server'
                        await cancelBooking(b.id, b.resource_id)
                      }}
                    >
                      <button
                        type="submit"
                        className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20 transition cursor-pointer"
                      >
                        Cancel Reservation
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
