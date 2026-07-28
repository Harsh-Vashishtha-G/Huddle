'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/login/actions'
import NotificationBell from './NotificationBell'
import { LogOut, Shield, Calendar, Layers, CheckSquare } from 'lucide-react'

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
  ]

  if (profile.role === 'admin') {
    navItems.push({ name: 'Approvals', href: '/approvals', icon: CheckSquare })
  }

  return (
    <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Navigation Links */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Huddle
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                      isActive
                        ? 'bg-indigo-650 text-white'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* User Details & Actions */}
          <div className="flex items-center gap-4">
            <NotificationBell userId={profile.id} />

            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-semibold text-slate-200">
                {profile.display_name}
              </span>
              <span className="flex items-center justify-end gap-1 text-[10px] uppercase font-bold tracking-wider text-slate-500">
                {profile.role === 'admin' && <Shield className="h-2.5 w-2.5 text-indigo-400" />}
                {profile.role}
              </span>
            </div>

            <form action={logout}>
              <button
                type="submit"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-red-400 transition cursor-pointer"
                title="Log Out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  )
}
