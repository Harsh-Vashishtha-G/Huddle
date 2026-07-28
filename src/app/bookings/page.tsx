import { createClient } from '@/utils/supabase/server'
import { cancelBooking } from '@/app/actions/booking'
import { parseTstzrange } from '@/utils/date'
import { Clock, Calendar, CheckCircle2, XCircle, AlertCircle, HelpCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import ExportICSButton from '@/components/ExportICSButton'

export const metadata = { title: 'My Bookings — Huddle' }

interface BookingWithRelations {
  id: string
  resource_id: string
  user_id: string
  time_range: string
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  created_at: string
  updated_at: string
  recurrence_group_id: string | null
  resources: { name: string; requires_approval: boolean } | null
}

const statusConfig = {
  approved:  { label: 'Approved',  icon: CheckCircle2, cls: 'badge-approved' },
  pending:   { label: 'Pending',   icon: HelpCircle,   cls: 'badge-pending' },
  rejected:  { label: 'Rejected',  icon: AlertCircle,  cls: 'badge-rejected' },
  cancelled: { label: 'Cancelled', icon: XCircle,      cls: 'badge-cancelled' },
}

export default async function BookingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, resources(name, requires_approval)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="relative min-h-screen">
      <div className="ambient-glow" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
            <Calendar className="h-3.5 w-3.5" />
            Reservations
          </div>
          <h1 className="text-2xl font-extrabold text-white sm:text-3xl">My Bookings</h1>
          <p className="mt-1.5 text-sm text-slate-400">
            Monitor booking status, export calendar files, or cancel upcoming reservations.
          </p>
        </div>

        {(!bookings || bookings.length === 0) ? (
          <div className="glass-card flex flex-col items-center gap-4 rounded-2xl py-20 text-center">
            <Clock className="h-10 w-10 stroke-1 text-slate-700" />
            <p className="text-sm text-slate-500">You haven&apos;t made any bookings yet.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-400 transition hover:text-indigo-300"
            >
              Find a resource <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((b: BookingWithRelations) => {
              const range = parseTstzrange(b.time_range)
              if (!range) return null

              const cfg = statusConfig[b.status]
              const Icon = cfg.icon

              const dateStr = range.start.toLocaleDateString(undefined, {
                weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
              })
              const timeStr = `${range.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${range.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
              const canCancel = b.status === 'pending' || b.status === 'approved'

              return (
                <div
                  key={b.id}
                  className="glass-card flex flex-col gap-4 rounded-2xl p-5 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-white truncate">{b.resources?.name}</h3>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.cls}`}>
                        <Icon className="h-3 w-3" />
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300">
                      <span className="font-medium">{dateStr}</span>
                      <span className="mx-2 text-slate-700">·</span>
                      <span className="font-bold text-indigo-400">{timeStr}</span>
                    </p>
                    <span className="mt-0.5 block text-[10px] text-slate-600">
                      Created {new Date(b.created_at).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {b.status === 'approved' && (
                      <ExportICSButton
                        booking={{ id: b.id, time_range: b.time_range, status: b.status }}
                        resourceName={b.resources?.name || 'Resource'}
                      />
                    )}
                    {canCancel && (
                      <form
                        action={async () => {
                          'use server'
                          await cancelBooking(b.id, b.resource_id)
                        }}
                      >
                        <button
                          type="submit"
                          className="rounded-xl border border-red-500/15 bg-red-500/8 px-4 py-2 text-xs font-bold text-red-400 transition hover:bg-red-500/15"
                        >
                          Cancel
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
    </div>
  )
}
