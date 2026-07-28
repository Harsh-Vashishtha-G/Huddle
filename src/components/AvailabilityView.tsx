'use client'

import { useState } from 'react'
import { createBooking, cancelBooking } from '@/app/actions/booking'
import { Calendar as CalendarIcon, Clock, Users, ArrowLeft, Download, XCircle } from 'lucide-react'
import Link from 'next/link'
import * as ics from 'ics'

export interface Booking {
  id: string
  resource_id: string
  user_id: string
  time_range: string
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  profiles: {
    display_name: string
  }
}

interface Resource {
  id: string
  name: string
  description: string | null
  capacity: number
  requires_approval: boolean
}

// Parse PostgreSQL tstzrange to start and end dates
export function parseTstzrange(rangeStr: string) {
  const regex = /[\[\()]([^,]+),([^\]\)]+)[\]\)]/
  const match = rangeStr.match(regex)
  if (!match) return null
  const startStr = match[1].replace(/["']/g, '').trim()
  const endStr = match[2].replace(/["']/g, '').trim()
  return {
    start: new Date(startStr),
    end: new Date(endStr),
  }
}

export default function AvailabilityView({
  resource,
  initialBookings,
  currentUserId,
}: {
  resource: Resource
  initialBookings: Booking[]
  currentUserId: string
}) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [bookings, setBookings] = useState<Booking[]>(initialBookings)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Filter bookings for the selected date
  const dailyBookings = bookings.filter((b) => {
    if (b.status === 'cancelled' || b.status === 'rejected') return false
    const range = parseTstzrange(b.time_range)
    if (!range) return false
    
    // Check if range overlaps with the selected date (local calendar time)
    const dateStr = range.start.toLocaleDateString('en-CA') // YYYY-MM-DD
    const endDateStr = range.end.toLocaleDateString('en-CA')
    return dateStr === selectedDate || endDateStr === selectedDate
  })

  // Hourly slots for display (08:00 to 20:00)
  const hourSlots = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 8
    return `${hour.toString().padStart(2, '0')}:00`
  })

  async function handleBook(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    formData.append('resourceId', resource.id)
    formData.append('date', selectedDate)

    try {
      await createBooking(formData)
      setSuccess('Booking submitted successfully!')
      // Reset form
      event.currentTarget.reset()
      // Reload bookings by refreshing page state or window location
      window.location.reload()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  async function handleCancel(bookingId: string) {
    if (!confirm('Are you sure you want to cancel this booking?')) return

    try {
      await cancelBooking(bookingId, resource.id)
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
      )
      setSuccess('Booking cancelled.')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    }
  }

  function downloadICSFile(b: Booking) {
    const range = parseTstzrange(b.time_range)
    if (!range) return

    const event: ics.EventAttributes = {
      start: [
        range.start.getFullYear(),
        range.start.getMonth() + 1,
        range.start.getDate(),
        range.start.getHours(),
        range.start.getMinutes(),
      ],
      end: [
        range.end.getFullYear(),
        range.end.getMonth() + 1,
        range.end.getDate(),
        range.end.getHours(),
        range.end.getMinutes(),
      ],
      title: `Booking: ${resource.name}`,
      description: `Huddle reservation. Status: ${b.status}`,
      location: 'Huddle Booking System',
    }

    ics.createEvent(event, (error, value) => {
      if (error) {
        setError('Failed to generate calendar file.')
        return
      }
      const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `huddle-booking-${resource.name.toLowerCase().replace(/\s+/g, '-')}.ics`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 mb-6 transition"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Resources
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Resource Info & Booking form */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-900 bg-slate-950 p-6">
            <h1 className="text-xl font-bold text-slate-100">{resource.name}</h1>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              {resource.description || 'No description provided.'}
            </p>

            <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4 text-indigo-400" /> Max Capacity: {resource.capacity}
              </span>
              <span>
                Approval:{' '}
                {resource.requires_approval ? (
                  <span className="text-amber-400">Required</span>
                ) : (
                  <span className="text-emerald-400">Auto-approved</span>
                )}
              </span>
            </div>
          </div>

          {/* Booking Form */}
          <div className="rounded-xl border border-slate-900 bg-slate-950 p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-650" />
            <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-400" /> Book a Slot
            </h2>

            {error && (
              <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400">
                {success}
              </div>
            )}

            <form onSubmit={handleBook} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Start Time
                </label>
                <select
                  name="startTime"
                  required
                  className="w-full rounded-lg border border-slate-850 bg-slate-900 px-4 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500 transition"
                >
                  {hourSlots.slice(0, -1).map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  End Time
                </label>
                <select
                  name="endTime"
                  required
                  defaultValue="09:00"
                  className="w-full rounded-lg border border-slate-850 bg-slate-900 px-4 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500 transition"
                >
                  {hourSlots.slice(1).map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Recurring booking (weekly)
                </label>
                <select
                  name="recurrenceWeeks"
                  required
                  className="w-full rounded-lg border border-slate-850 bg-slate-900 px-4 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500 transition"
                >
                  <option value="0">Single booking (No recurrence)</option>
                  <option value="2">Repeat weekly for 2 weeks</option>
                  <option value="4">Repeat weekly for 4 weeks</option>
                  <option value="8">Repeat weekly for 8 weeks</option>
                  <option value="12">Repeat weekly for 12 weeks</option>
                </select>
                <p className="mt-1 text-[10px] text-slate-500 leading-normal">
                  If recurring, we will attempt to book this time slot on this day of the week for N consecutive weeks. The entire series will fail if there is an overlap conflict.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-indigo-650 py-2.5 text-sm font-semibold text-white hover:bg-indigo-550 disabled:bg-indigo-800 transition cursor-pointer"
              >
                {loading ? 'Processing...' : 'Confirm Reservation'}
              </button>
            </form>
          </div>
        </div>

        {/* Right column: Availability Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-900 bg-slate-950 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-indigo-400" /> Availability Timeline
              </h2>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-lg border border-slate-850 bg-slate-900 px-4 py-1.5 text-sm text-slate-100 outline-none focus:border-indigo-500 transition cursor-pointer"
              />
            </div>

            {/* Bookings table/list for the selected date */}
            {dailyBookings.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <p className="text-sm">No reservations for this date.</p>
                <p className="text-xs mt-1">Select times on the left to make the first booking.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dailyBookings.map((b) => {
                  const range = parseTstzrange(b.time_range)
                  if (!range) return null

                  const timeStr = `${range.start.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })} - ${range.end.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}`

                  const isOwner = b.user_id === currentUserId

                  return (
                    <div
                      key={b.id}
                      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg border ${
                        b.status === 'approved'
                          ? 'border-emerald-500/20 bg-emerald-950/5'
                          : 'border-slate-850 bg-slate-900/20'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-255">{timeStr}</span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              b.status === 'approved'
                                ? 'bg-emerald-950 text-emerald-400'
                                : 'bg-amber-950 text-amber-400'
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                          Booked by: <span className="text-slate-350">{b.profiles.display_name}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {b.status === 'approved' && (
                          <button
                            onClick={() => downloadICSFile(b)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer"
                            title="Export Calendar File"
                          >
                            <Download className="h-3.5 w-3.5" /> .ics
                          </button>
                        )}

                        {isOwner && (
                          <button
                            onClick={() => handleCancel(b.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition cursor-pointer"
                          >
                            <XCircle className="h-3.5 w-3.5" /> Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
