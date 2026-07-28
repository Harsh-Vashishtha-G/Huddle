'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

const resourceSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  capacity: z.coerce.number().min(1, 'Capacity must be at least 1'),
  requires_approval: z.boolean().default(false),
})

export async function createResource(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  const validated = resourceSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    capacity: formData.get('capacity'),
    requires_approval: formData.get('requires_approval') === 'on',
  })

  if (!validated.success) {
    throw new Error(validated.error.issues[0].message)
  }

  const { error } = await supabase.from('resources').insert({
    ...validated.data,
    created_by: user.id,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/')
}

export async function deleteResource(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase.from('resources').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/')
}
