'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const profileSchema = z.object({
  display_name: z.string().min(1, 'Name is required').max(80),
  phone: z.string().max(20).optional().or(z.literal('')),
  age: z.coerce.number().int().min(1).max(150).optional().or(z.literal('')),
  gender: z.enum(['Male', 'Female', 'Non-binary', 'Prefer not to say', '']).optional(),
  address: z.string().max(300).optional().or(z.literal('')),
})

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const raw = {
    display_name: formData.get('display_name') as string,
    phone: formData.get('phone') as string,
    age: formData.get('age') as string,
    gender: formData.get('gender') as string,
    address: formData.get('address') as string,
  }

  const parsed = profileSchema.safeParse(raw)
  if (!parsed.success) {
    const msg = parsed.error.issues.map((e) => e.message).join(', ')
    throw new Error(msg)
  }

  const updates: Record<string, unknown> = {
    display_name: parsed.data.display_name,
    phone: parsed.data.phone || null,
    age: parsed.data.age || null,
    gender: parsed.data.gender || null,
    address: parsed.data.address || null,
  }

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/account')
  revalidatePath('/')
}
