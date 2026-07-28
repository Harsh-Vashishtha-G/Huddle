'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/login/actions'
import NotificationBell from './NotificationBell'
import { LogOut, Shield, Calendar, Layers, CheckSquare, Settings } from 'lucide-react'

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
  navItems.push({ name: 'Account', href: '/account', icon: Settings })

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo + Nav */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center group">
              <span className="text-xl font-bold tracking-tight text-gray-900 transition-colors group-hover:text-emerald-600">Huddle</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(({ name, href, icon: Icon }) => {
                const isActive = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
                    {name}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Right: Bell + User + Logout */}
          <div className="flex items-center gap-3">
            <NotificationBell userId={profile.id} />

            <Link
              href="/account"
              title="Account Settings"
              className="hidden sm:flex flex-col items-end rounded-lg px-2 py-1 transition hover:bg-gray-50 group cursor-pointer"
            >
              <span className="text-sm font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors">
                {profile.display_name}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                {profile.role === 'admin' && <Shield className="h-2.5 w-2.5 text-emerald-600" />}
                {profile.role}
              </span>
            </Link>

            <form action={logout}>
              <button
                type="submit"
                title="Sign Out"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-500 transition-all duration-150 hover:border-red-200 hover:bg-red-50 hover:text-red-600 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Mobile nav */}
      <div className="flex md:hidden gap-1 px-4 pb-3 pt-1 border-t border-gray-100">
        {navItems.map(({ name, href, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                isActive ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-gray-600 hover:text-gray-900'
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
