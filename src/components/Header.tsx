'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/login/actions'
import NotificationBell from './NotificationBell'
import { LogOut, Shield, Calendar, Layers, CheckSquare, Zap, Settings } from 'lucide-react'

interface Profile {
  id: string
  role: 'admin' | 'member'
  display_name: string
}

export default function Header({ profile }: { profile: Profile }) {
  const pathname = usePathname()

  const navItems = [
    { name: 'Resources', href: '/', icon: Layers },
    { name: 'My Bookings', href: '/bookings', icon: Calendar },
    { name: 'Account', href: '/account', icon: Settings },
  ]
  if (profile.role === 'admin') {
    navItems.push({ name: 'Approvals', href: '/approvals', icon: CheckSquare })
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#040712]/85 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo + Nav */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/30 transition-shadow group-hover:shadow-indigo-500/50">
                <Zap className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-base font-bold tracking-tight text-white">Huddle</span>
            </Link>

            <nav className="hidden md:flex items-center gap-0.5">
              {navItems.map(({ name, href, icon: Icon }) => {
                const isActive = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-indigo-500/15 text-indigo-300 shadow-sm'
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-400' : ''}`} />
                    {name}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Right: Bell + User + Logout */}
          <div className="flex items-center gap-3">
            <NotificationBell userId={profile.id} />

            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-200">{profile.display_name}</span>
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {profile.role === 'admin' && <Shield className="h-2.5 w-2.5 text-indigo-400" />}
                {profile.role}
              </span>
            </div>

            <form action={logout}>
              <button
                type="submit"
                title="Sign Out"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/6 bg-white/4 text-slate-500 transition-all duration-150 hover:border-red-500/20 hover:bg-red-500/8 hover:text-red-400 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Mobile nav */}
      <div className="flex md:hidden gap-0.5 px-4 pb-2">
        {navItems.map(({ name, href, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                isActive ? 'bg-indigo-500/15 text-indigo-300' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {name}
            </Link>
          )
        })}
      </div>
    </header>
  )
}
