import { login, signup } from './actions'
import Link from 'next/link'

export const metadata = {
  title: 'Sign In — Huddle',
}

interface PageProps {
  searchParams: Promise<{ error?: string; message?: string }>
}

export default async function LoginPage({ searchParams }: PageProps) {
  const { error, message } = await searchParams

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50/50 px-4">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-100/50 blur-[120px]" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo mark */}
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" className="mb-4 flex items-center justify-center">
            <span className="text-3xl font-extrabold tracking-tight text-gray-900">Huddle</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-500">Team Resource &amp; Room Booking System</p>
        </div>

        <div className="glass-card overflow-hidden rounded-2xl p-8 bg-white shadow-xl shadow-gray-200/50 border border-gray-100">
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm font-medium text-red-700">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm font-medium text-emerald-700">
              {message}
            </div>
          )}

          <form className="space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="name@company.com"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600">
                Display Name <span className="normal-case font-normal text-gray-400">(Sign up only)</span>
              </label>
              <input
                name="displayName"
                type="text"
                placeholder="Your full name"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                formAction={login}
                className="btn-primary flex w-full items-center justify-center py-3 text-sm font-bold"
              >
                Sign In
              </button>
              <button
                formAction={signup}
                className="btn-secondary flex w-full items-center justify-center py-3 text-sm font-bold"
              >
                Create Account
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            Secured by Supabase Auth · end-to-end encrypted
          </p>
        </div>
      </div>
    </div>
  )
}
