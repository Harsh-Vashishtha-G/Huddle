import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { updateProfile } from '@/app/actions/profile'
import { User, Phone, MapPin, Calendar, Shield, CheckCircle2, AlertCircle } from 'lucide-react'

export const metadata = { title: 'Account Settings — Huddle' }

interface PageProps {
  searchParams: Promise<{ success?: string; error?: string }>
}

export default async function AccountPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { success, error } = await searchParams

  return (
    <div className="relative min-h-screen bg-white text-gray-900">
      <div className="ambient-glow" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="mb-8">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
            <User className="h-3.5 w-3.5" />
            Account
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">Account Settings</h1>
          <p className="mt-1.5 text-sm text-gray-600">
            Update your personal details and preferences.
          </p>
        </div>

        {/* Alerts */}
        {success && (
          <div className="mb-6 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            Profile updated successfully!
          </div>
        )}
        {error && (
          <div className="mb-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
            {decodeURIComponent(error)}
          </div>
        )}

        <div className="space-y-5">
          {/* Identity card — email + role, read-only */}
          <div className="glass-card rounded-2xl p-6 bg-white border border-gray-200">
            <h2 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
              <Shield className="h-3.5 w-3.5 text-emerald-600" />
              Account Identity
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Email Address
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5">
                  <span className="text-sm text-gray-700 font-medium">{user.email}</span>
                  <span className="ml-auto rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-bold text-gray-600">read-only</span>
                </div>
                <p className="mt-1 text-[10px] text-gray-400">Email changes are managed via Supabase Auth.</p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Role</label>
                <div className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 ${
                  profile?.role === 'admin'
                    ? 'border-emerald-200 bg-emerald-50'
                    : 'border-gray-200 bg-gray-50'
                }`}>
                  <Shield className={`h-3.5 w-3.5 ${profile?.role === 'admin' ? 'text-emerald-600' : 'text-gray-400'}`} />
                  <span className={`text-sm font-bold capitalize ${profile?.role === 'admin' ? 'text-emerald-800' : 'text-gray-600'}`}>
                    {profile?.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Editable profile form */}
          <div className="glass-card relative overflow-hidden rounded-2xl p-6 bg-white border border-gray-200">
            <div className="absolute left-0 top-0 h-full w-1 bg-emerald-500" />
            <h2 className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
              <User className="h-3.5 w-3.5 text-emerald-600" />
              Personal Details
            </h2>

            <form
              action={async (formData: FormData) => {
                'use server'
                try {
                  await updateProfile(formData)
                  redirect('/account?success=1')
                } catch (err: unknown) {
                  const msg = err instanceof Error ? err.message : 'Unknown error'
                  if (msg.includes('NEXT_REDIRECT')) throw err
                  redirect(`/account?error=${encodeURIComponent(msg)}`)
                }
              }}
              className="space-y-5"
            >
              {/* Row 1: Name */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Display Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    name="display_name"
                    required
                    defaultValue={profile?.display_name || ''}
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              {/* Row 2: Phone + Age */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      name="phone"
                      type="tel"
                      defaultValue={profile?.phone || ''}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Age
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      name="age"
                      type="number"
                      min={1}
                      max={150}
                      defaultValue={profile?.age || ''}
                      placeholder="28"
                      className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Gender */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Gender
                </label>
                <select
                  name="gender"
                  defaultValue={profile?.gender || ''}
                  className="w-full cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="">Prefer not to say</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              {/* Row 4: Address */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                  <textarea
                    name="address"
                    defaultValue={profile?.address || ''}
                    placeholder="123 Main Street, City, State, PIN"
                    rows={3}
                    className="w-full resize-none rounded-xl border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-400">
                  Last updated:{' '}
                  {profile?.updated_at
                    ? new Date(profile.updated_at).toLocaleString()
                    : 'Never'}
                </p>
                <button
                  type="submit"
                  className="btn-primary px-8 py-2.5 text-sm font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
