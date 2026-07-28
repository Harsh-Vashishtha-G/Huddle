import { createClient } from '@/utils/supabase/server'
import ResourceDashboard from '@/components/ResourceDashboard'

export default async function Home() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Fetch current user's profile role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // Fetch all bookable resources
  const { data: resources } = await supabase
    .from('resources')
    .select('*')
    .order('name', { ascending: true })

  return (
    <ResourceDashboard
      resources={resources || []}
      role={profile?.role || 'member'}
    />
  )
}
