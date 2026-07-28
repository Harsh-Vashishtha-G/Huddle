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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#040712] px-4">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[140px]" />
        <div className="absolute -bottom-40 right-1/4 h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[120px]" />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #818cf8 1px, transparent 0)', backgroundSize: '28px 28px' }}
        />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo mark */}
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" className="mb-5 flex items-center justify-center">
            <span className="text-3xl font-black tracking-tight text-white">Huddle</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-400">Team Resource &amp; Room Booking System</p>
        </div>

        <div className="glass-card overflow-hidden rounded-2xl p-8">
          {/* Gradient top line */}
          <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/8 p-3.5 text-sm text-red-400">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/8 p-3.5 text-sm text-emerald-400">
              {message}
            </div>
          )}

          <form className="space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="name@company.com"
                className="w-full rounded-xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-white placeholder-slate-600 transition-all duration-200 focus:border-indigo-500/60 focus:bg-white/6"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-white placeholder-slate-600 transition-all duration-200 focus:border-indigo-500/60 focus:bg-white/6"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">
                Display Name <span className="normal-case font-normal text-slate-600">(Sign up only)</span>
              </label>
              <input
                name="displayName"
                type="text"
                placeholder="Your full name"
                className="w-full rounded-xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-white placeholder-slate-600 transition-all duration-200 focus:border-indigo-500/60 focus:bg-white/6"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                formAction={login}
                className="btn-primary flex w-full items-center justify-center rounded-xl py-3 text-sm font-bold text-white"
              >
                Sign In
              </button>
              <button
                formAction={signup}
                className="flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-bold text-slate-300 transition-all duration-200 hover:bg-white/10 hover:text-white"
              >
                Create Account
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-xs text-slate-600">
            Secured by Supabase Auth · end-to-end encrypted
          </p>
        </div>
      </div>
    </div>
  )
}
