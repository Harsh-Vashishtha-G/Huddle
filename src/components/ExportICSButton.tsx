'use client'

import * as ics from 'ics'
import { Download } from 'lucide-react'
import { parseTstzrange } from './AvailabilityView'

export default function ExportICSButton({
  booking,
  resourceName,
}: {
  booking: {
    id: string
    time_range: string
    status: string
  }
  resourceName: string
}) {
  function downloadICSFile() {
    const range = parseTstzrange(booking.time_range)
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
      title: `Booking: ${resourceName}`,
      description: `Huddle reservation. Status: ${booking.status}`,
      location: 'Huddle Booking System',
    }

    ics.createEvent(event, (error, value) => {
      if (error) {
        alert('Failed to generate calendar file.')
        return
      }
      const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `huddle-booking-${resourceName.toLowerCase().replace(/\s+/g, '-')}.ics`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }

  return (
    <button
      onClick={downloadICSFile}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-850 hover:text-white transition cursor-pointer"
      title="Download .ics calendar file"
    >
      <Download className="h-3.5 w-3.5" /> .ics
    </button>
  )
}
