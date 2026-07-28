'use client'

import { useState } from 'react'
import { createBooking, cancelBooking } from '@/app/actions/booking'
import {
  Calendar as CalendarIcon, Clock, Users, ArrowLeft, Download,
  XCircle, Zap, AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, LayoutGrid, List,
} from 'lucide-react'
import Link from 'next/link'
import { parseTstzrange, formatTimeAMPM } from '@/utils/date'
import * as ics from 'ics'

export interface Booking {
  id: string
  resource_id: string
  user_id: string
  time_range: string
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  profiles: { display_name: string }
}

interface Resource {
  id: string
  name: string
  description: string | null
  capacity: number
  requires_approval: boolean
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function getWeekStart(date: Date) {
  const d = new Date(date)
  const day = d.getDay() // 0 Sun
  d.setDate(d.getDate() - day)
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(date: Date, n: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

function isoDate(d: Date) {
  return d.toISOString().split('T')[0]
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const HOUR_LABELS = Array.from({ length: 13 }, (_, i) => {
  const h = i + 8
  return h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`
})
const HOURS = Array.from({ length: 13 }, (_, i) => i + 8) // 8..20

// ─── sub-component: week grid ──────────────────────────────────────────────────

function WeekGrid({
  weekStart,
  bookings,
  currentUserId,
  onCancel,
  onDownload,
}: {
  weekStart: Date
  bookings: Booking[]
  currentUserId: string
  onCancel: (id: string) => void
  onDownload: (b: Booking) => void
}) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  // Map bookings to grid cells
  const activeBookings = bookings.filter(
    (b) => b.status !== 'cancelled' && b.status !== 'rejected'
  )

  return (
    <div className="overflow-x-auto rounded-xl border border-white/6">
      {/* Header row */}
      <div className="grid grid-cols-8 border-b border-white/6 bg-white/2 text-xs font-semibold text-slate-500">
        <div className="px-3 py-2.5 text-right" />
        {days.map((d, i) => {
          const isToday = isoDate(d) === isoDate(new Date())
          return (
            <div
              key={i}
              className={`px-2 py-2.5 text-center ${isToday ? 'text-indigo-400' : ''}`}
            >
              <div>{DAY_LABELS[d.getDay()]}</div>
              <div className={`mt-0.5 text-base font-bold ${isToday ? 'text-white' : 'text-slate-300'}`}>
                {d.getDate()}
              </div>
            </div>
          )
        })}
      </div>

      {/* Time rows */}
      <div className="relative">
        {HOURS.map((hour, hi) => (
          <div key={hour} className="grid grid-cols-8 border-b border-white/4 last:border-0">
            {/* Time label */}
            <div className="px-3 py-3 text-right text-[10px] text-slate-600 leading-none pt-2.5">
              {HOUR_LABELS[hi]}
            </div>

            {/* Day cells */}
            {days.map((day, di) => {
              const cellBookings = activeBookings.filter((b) => {
                const r = parseTstzrange(b.time_range)
                if (!r) return false
                const bDate = isoDate(r.start)
                if (bDate !== isoDate(day)) return false
                const bHour = r.start.getHours()
                return bHour === hour
              })

              return (
                <div key={di} className="relative border-l border-white/4 min-h-[44px] px-1 py-1">
                  {cellBookings.map((b) => {
                    const r = parseTstzrange(b.time_range)!
                    const mins = (r.end.getTime() - r.start.getTime()) / 60000
                    const heightPx = Math.max(32, (mins / 60) * 44)
                    const isOwner = b.user_id === currentUserId

                    return (
                      <div
                        key={b.id}
                        title={`${b.profiles.display_name}: ${r.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}–${r.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                        style={{ height: `${heightPx}px` }}
                        className={`mb-1 w-full overflow-hidden rounded-md px-1.5 py-1 text-[9px] leading-tight cursor-default ${
                          b.status === 'approved'
                            ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'
                            : 'bg-amber-500/20 border border-amber-500/30 text-amber-300'
                        }`}
                      >
                        <div className="font-bold truncate">
                          {r.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="truncate opacity-80">{b.profiles.display_name}</div>

                        {/* Action icons */}
                        <div className="mt-1 flex gap-1">
                          {b.status === 'approved' && (
                            <button
                              onClick={() => onDownload(b)}
                              className="opacity-70 hover:opacity-100 transition"
                              title="Download .ics"
                            >
                              <Download className="h-2.5 w-2.5" />
                            </button>
                          )}
                          {isOwner && (b.status === 'pending' || b.status === 'approved') && (
                            <button
                              onClick={() => onCancel(b.id)}
                              className="opacity-70 hover:opacity-100 transition"
                              title="Cancel"
                            >
                              <XCircle className="h-2.5 w-2.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── main component ────────────────────────────────────────────────────────────

export default function AvailabilityView({
  resource,
  initialBookings,
  currentUserId,
}: {
  resource: Resource
  initialBookings: Booking[]
  currentUserId: string
}) {
  const today = new Date()
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day')
  const [selectedDate, setSelectedDate] = useState(isoDate(today))
  const [weekStart, setWeekStart] = useState(getWeekStart(today))
  const [bookings, setBookings] = useState<Booking[]>(initialBookings)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // 30-minute intervals 08:00–20:00
  const timeSlots = Array.from({ length: 25 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8
    const min = i % 2 === 0 ? '00' : '30'
    return `${hour.toString().padStart(2, '0')}:${min}`
  })

  const dailyBookings = bookings.filter((b) => {
    if (b.status === 'cancelled' || b.status === 'rejected') return false
    const range = parseTstzrange(b.time_range)
    if (!range) return false
    return range.start.toLocaleDateString('en-CA') === selectedDate
      || range.end.toLocaleDateString('en-CA') === selectedDate
  })

  const weekEnd = addDays(weekStart, 6)

  async function handleBook(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formEl = e.currentTarget
    setError(null); setSuccess(null); setLoading(true)
    const fd = new FormData(formEl)
    fd.append('resourceId', resource.id)
    fd.append('date', selectedDate)
    try {
      await createBooking(fd)
      setSuccess('Booking submitted successfully!')
      formEl.reset()
      window.location.reload()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  async function handleCancel(bookingId: string) {
    if (!confirm('Cancel this booking?')) return
    try {
      await cancelBooking(bookingId, resource.id)
      setBookings((prev) => prev.map((b) => b.id === bookingId ? { ...b, status: 'cancelled' } : b))
      setSuccess('Booking cancelled.')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  function downloadICS(b: Booking) {
    const range = parseTstzrange(b.time_range)
    if (!range) return
    const event: ics.EventAttributes = {
      start: [range.start.getFullYear(), range.start.getMonth() + 1, range.start.getDate(), range.start.getHours(), range.start.getMinutes()],
      end: [range.end.getFullYear(), range.end.getMonth() + 1, range.end.getDate(), range.end.getHours(), range.end.getMinutes()],
      title: `${resource.name} — Huddle Booking`,
      description: `Huddle reservation. Status: ${b.status}`,
      location: 'Huddle Booking System',
    }
    ics.createEvent(event, (err, val) => {
      if (err) { setError('Failed to generate .ics file'); return }
      const blob = new Blob([val], { type: 'text/calendar' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `huddle-${resource.name.toLowerCase().replace(/\s+/g, '-')}.ics`
      a.click()
      URL.revokeObjectURL(url)
    })
  }

  return (
    <div className="relative min-h-screen">
      <div className="ambient-glow" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/" className="mb-7 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-200">
          <ArrowLeft className="h-4 w-4" /> Back to Resources
        </Link>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* ── Left: Info + Form ─────────────────────────────────── */}
          <div className="space-y-5">
            {/* Resource card */}
            <div className="glass-card rounded-2xl p-6">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
                <Zap className="h-3 w-3" />
                {resource.requires_approval ? 'Approval Required' : 'Instant Booking'}
              </div>
              <h1 className="text-xl font-extrabold text-white">{resource.name}</h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {resource.description || 'No description provided.'}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-indigo-400" />{resource.capacity} seat{resource.capacity !== 1 ? 's' : ''}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-indigo-400" />08:00 AM – 08:00 PM</span>
              </div>
            </div>

            {/* Booking form */}
            <div className="glass-card relative overflow-hidden rounded-2xl p-6">
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-indigo-500 to-purple-600" />
              <h2 className="mb-5 flex items-center gap-2 text-base font-bold text-white">
                <Clock className="h-4 w-4 text-indigo-400" /> Book a Slot
              </h2>

              {error && (
                <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/8 p-3.5 text-sm text-red-400">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}
                </div>
              )}
              {success && (
                <div className="mb-4 flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/8 p-3.5 text-sm text-emerald-400">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />{success}
                </div>
              )}

              <form onSubmit={handleBook} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full cursor-pointer rounded-xl border border-white/8 bg-white/4 px-4 py-2.5 text-sm text-white transition-all focus:border-indigo-500/60"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">Start Time</label>
                  <select name="startTime" required className="w-full cursor-pointer rounded-xl border border-white/8 bg-white/4 px-4 py-2.5 text-sm text-white transition-all focus:border-indigo-500/60">
                    {timeSlots.slice(0, -1).map((t) => (
                      <option key={t} value={t} style={{ background: '#0b0f1e' }}>{formatTimeAMPM(t)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">End Time</label>
                  <select name="endTime" required defaultValue="09:00" className="w-full cursor-pointer rounded-xl border border-white/8 bg-white/4 px-4 py-2.5 text-sm text-white transition-all focus:border-indigo-500/60">
                    {timeSlots.slice(1).map((t) => (
                      <option key={t} value={t} style={{ background: '#0b0f1e' }}>{formatTimeAMPM(t)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">Recurrence</label>
                  <select name="recurrenceWeeks" required className="w-full cursor-pointer rounded-xl border border-white/8 bg-white/4 px-4 py-2.5 text-sm text-white transition-all focus:border-indigo-500/60">
                    <option value="0" style={{ background: '#0b0f1e' }}>Single booking (no recurrence)</option>
                    <option value="2" style={{ background: '#0b0f1e' }}>Repeat weekly — 2 weeks</option>
                    <option value="4" style={{ background: '#0b0f1e' }}>Repeat weekly — 4 weeks</option>
                    <option value="8" style={{ background: '#0b0f1e' }}>Repeat weekly — 8 weeks</option>
                    <option value="12" style={{ background: '#0b0f1e' }}>Repeat weekly — 12 weeks</option>
                  </select>
                  <p className="mt-1.5 text-[10px] leading-relaxed text-slate-500">
                    Recurring series fails atomically if any week has an overlap conflict.
                  </p>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full rounded-xl py-3 text-sm font-bold text-white disabled:opacity-50">
                  {loading ? 'Processing...' : 'Confirm Reservation'}
                </button>
              </form>
            </div>
          </div>

          {/* ── Right: Availability ───────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-2xl p-6">
              {/* Toolbar */}
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="flex items-center gap-2 text-base font-bold text-white">
                  <CalendarIcon className="h-4 w-4 text-indigo-400" />
                  Availability Timeline
                </h2>

                {/* Day / Week toggle */}
                <div className="flex items-center gap-2">
                  <div className="flex rounded-lg border border-white/8 bg-white/4 p-0.5">
                    <button
                      onClick={() => setViewMode('day')}
                      className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${viewMode === 'day' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      <List className="h-3.5 w-3.5" /> Day
                    </button>
                    <button
                      onClick={() => setViewMode('week')}
                      className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${viewMode === 'week' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      <LayoutGrid className="h-3.5 w-3.5" /> Week
                    </button>
                  </div>

                  {/* Date navigation */}
                  {viewMode === 'day' ? (
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="cursor-pointer rounded-xl border border-white/8 bg-white/4 px-4 py-1.5 text-sm text-white transition-all focus:border-indigo-500/60"
                    />
                  ) : (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setWeekStart(addDays(weekStart, -7))}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/8 bg-white/4 text-slate-400 hover:text-white transition"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <span className="min-w-[130px] text-center text-xs font-semibold text-slate-300">
                        {weekStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} –{' '}
                        {weekEnd.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <button
                        onClick={() => setWeekStart(addDays(weekStart, 7))}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/8 bg-white/4 text-slate-400 hover:text-white transition"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Day view ── */}
              {viewMode === 'day' && (
                dailyBookings.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-white/8 py-14 text-center">
                    <CalendarIcon className="h-8 w-8 stroke-1 text-slate-700" />
                    <p className="text-sm text-slate-500">No reservations for this date.</p>
                    <p className="text-xs text-slate-600">Use the form on the left to be the first!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dailyBookings.map((b) => {
                      const range = parseTstzrange(b.time_range)
                      if (!range) return null
                      const timeStr = `${range.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${range.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                      const isOwner = b.user_id === currentUserId
                      return (
                        <div key={b.id} className={`flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between ${b.status === 'approved' ? 'border-emerald-500/15 bg-emerald-500/5' : 'border-white/6 bg-white/2'}`}>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-200">{timeStr}</span>
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${b.status === 'approved' ? 'badge-approved' : 'badge-pending'}`}>{b.status}</span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500">Booked by <span className="text-slate-300 font-medium">{b.profiles.display_name}</span></p>
                          </div>
                          <div className="flex items-center gap-2">
                            {b.status === 'approved' && (
                              <button onClick={() => downloadICS(b)} className="inline-flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/4 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-white/8 hover:text-white">
                                <Download className="h-3.5 w-3.5" /> .ics
                              </button>
                            )}
                            {isOwner && (b.status === 'pending' || b.status === 'approved') && (
                              <button onClick={() => handleCancel(b.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/15 bg-red-500/8 px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/15">
                                <XCircle className="h-3.5 w-3.5" /> Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              )}

              {/* ── Week view ── */}
              {viewMode === 'week' && (
                <WeekGrid
                  weekStart={weekStart}
                  bookings={bookings}
                  currentUserId={currentUserId}
                  onCancel={handleCancel}
                  onDownload={downloadICS}
                />
              )}

              {/* Legend */}
              <div className="mt-4 flex items-center gap-4 text-[10px] text-slate-600">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-emerald-500/40" />Approved</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-amber-500/40" />Pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
