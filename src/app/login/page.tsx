import { login, signup } from './actions'

interface PageProps {
  searchParams: Promise<{ error?: string; message?: string }>
}

export default async function LoginPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const error = resolvedParams.error
  const message = resolvedParams.message

  return (
    <div className="flex min-h-screen items-center justify-center bg-radial from-slate-900 to-black px-4 font-sans text-slate-100 selection:bg-indigo-500 selection:text-white">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
        {/* Decorative ambient lights */}
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-8 text-center">
            <h1 className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
              Huddle
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Team Resource & Meeting Room Booking
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-6 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400">
              {message}
            </div>
          )}

          {/* Multi-mode container: default Login Form with option to Sign Up */}
          <div className="space-y-6">
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  defaultValue="vashishthaharsh97@gmail.com"
                  placeholder="name@example.com"
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Display Name (Signup only)
                </label>
                <input
                  name="displayName"
                  type="text"
                  placeholder="Your Name"
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <button
                  formAction={login}
                  className="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
                >
                  Log In
                </button>
                <button
                  formAction={signup}
                  className="flex w-full items-center justify-center rounded-lg border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-850 hover:text-white focus:ring-2 focus:ring-slate-700 cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>

          <div className="mt-8 border-t border-slate-900 pt-6 text-center text-xs text-slate-500">
            Secure connection via Supabase Auth
          </div>
        </div>
      </div>
    </div>
  )
}
