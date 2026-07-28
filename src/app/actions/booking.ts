'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

const bookingSchema = z.object({
  resourceId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid start time'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid end time'),
  recurrenceWeeks: z.coerce.number().min(0).max(12).default(0), // 0 means no recurrence
})

export async function createBooking(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const validated = bookingSchema.safeParse({
    resourceId: formData.get('resourceId'),
    date: formData.get('date'),
    startTime: formData.get('startTime'),
    endTime: formData.get('endTime'),
    recurrenceWeeks: formData.get('recurrenceWeeks'),
  })

  if (!validated.success) {
    throw new Error(validated.error.issues[0].message)
  }

  const { resourceId, date, startTime, endTime, recurrenceWeeks } = validated.data

  const start = new Date(`${date}T${startTime}:00`)
  const end = new Date(`${date}T${endTime}:00`)

  if (end <= start) {
    throw new Error('End time must be after start time')
  }

  const bookingsToInsert = []
  const recurrenceGroupId = recurrenceWeeks > 0 ? crypto.randomUUID() : null
  const totalBookings = recurrenceWeeks > 0 ? recurrenceWeeks : 1

  for (let i = 0; i < totalBookings; i++) {
    const currentStart = new Date(start)
    const currentEnd = new Date(end)

    currentStart.setDate(currentStart.getDate() + i * 7)
    currentEnd.setDate(currentEnd.getDate() + i * 7)

    bookingsToInsert.push({
      resource_id: resourceId,
      user_id: user.id,
      time_range: `[${currentStart.toISOString()}, ${currentEnd.toISOString()})`,
      recurrence_group_id: recurrenceGroupId,
    })
  }

  const { error } = await supabase.from('bookings').insert(bookingsToInsert)

  if (error) {
    // 23P01 is Postgres SQLSTATE for exclusion_violation
    if (error.code === '23P01') {
      throw new Error(
        recurrenceWeeks > 0
          ? 'Booking failed: One or more slots in the recurring series overlap with an existing booking.'
          : 'Booking failed: The selected time slot is already booked.'
      )
    }
    throw new Error(error.message)
  }

  revalidatePath(`/resources/${resourceId}`)
}

export async function cancelBooking(id: string, resourceId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Attempt to cancel (policy will reject if user is member and status was already resolved or not owned)
  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/resources/${resourceId}`)
  revalidatePath('/bookings')
}

export async function approveBooking(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') throw new Error('Unauthorized')

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'approved' })
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/approvals')
}

export async function rejectBooking(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') throw new Error('Unauthorized')

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'rejected' })
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/approvals')
}
