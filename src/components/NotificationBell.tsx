'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Bell, Check, Inbox } from 'lucide-react'

interface Notification {
  id: string
  type: string
  message: string
  read: boolean
  created_at: string
}

export default function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Fetch initial notifications
  useEffect(() => {
    async function fetchNotifications() {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

      if (data) {
        setNotifications(data)
      }
    }

    fetchNotifications()

    // Subscribe to real-time notification inserts for the logged-in user
    const channel = supabase
      .channel(`user-notifications-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, supabase])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  async function markAllAsRead() {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id)
    if (unreadIds.length === 0) return

    // Update locally first for fast feedback
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))

    // Update in database
    await supabase
      .from('notifications')
      .update({ read: true })
      .in('id', unreadIds)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-slate-100 transition cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white ring-2 ring-slate-950">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-xl ring-1 ring-black/5 z-50">
          <div className="flex items-center justify-between border-b border-slate-900 px-4 py-3 bg-slate-950">
            <span className="text-sm font-semibold text-slate-200">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
              >
                <Check className="h-3 w-3" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-slate-500">
                <Inbox className="h-8 w-8 mb-2 stroke-1" />
                <span className="text-xs">No notifications yet</span>
              </div>
            ) : (
              <div className="divide-y divide-slate-900/50">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`px-4 py-3 text-xs transition ${
                      notif.read ? 'bg-transparent text-slate-400' : 'bg-indigo-950/20 text-slate-200'
                    }`}
                  >
                    <p className="font-medium leading-relaxed">{notif.message}</p>
                    <span className="mt-1 block text-[10px] text-slate-500">
                      {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
