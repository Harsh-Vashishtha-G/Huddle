import { createClient } from '@/utils/supabase/server'
import AvailabilityView, { Booking } from '@/components/AvailabilityView'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ResourcePage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Fetch resource details
  const { data: resource } = await supabase
    .from('resources')
    .select('*')
    .eq('id', id)
    .single()

  if (!resource) {
    notFound()
  }

  // Fetch active or pending bookings for this resource
  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      profiles (
        display_name
      )
    `)
    .eq('resource_id', id)
    .order('created_at', { ascending: false })

  return (
    <AvailabilityView
      resource={resource}
      initialBookings={(bookings as unknown as Booking[]) || []}
      currentUserId={user.id}
    />
  )
}
