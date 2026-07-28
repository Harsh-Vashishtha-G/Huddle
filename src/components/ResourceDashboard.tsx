'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createResource, deleteResource } from '@/app/actions/resource'
import { Shield, Plus, Users, Trash2, Search, Layers, Zap, ArrowRight, AlertCircle } from 'lucide-react'

interface Resource {
  id: string
  name: string
  description: string | null
  capacity: number
  requires_approval: boolean
}

export default function ResourceDashboard({
  resources: initialResources,
  role,
}: {
  resources: Resource[]
  role: 'admin' | 'member'
}) {
  const [resources, setResources] = useState<Resource[]>(initialResources)
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const filtered = resources.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setError(null)
    setLoading(true)
    try {
      await createResource(new FormData(form))
      form.reset()
      setIsCreating(false)
      window.location.reload()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this resource? All associated bookings will be deleted.')) return
    try {
      await deleteResource(id)
      setResources((prev) => prev.filter((r) => r.id !== id))
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  return (
    <div className="relative min-h-screen">
      <div className="ambient-glow" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
              <Layers className="h-3.5 w-3.5" />
              Bookable Resources
            </div>
            <h1 className="text-2xl font-extrabold text-white sm:text-3xl">Team Resources</h1>
            <p className="mt-1.5 text-sm text-slate-400">
              Select a room or piece of equipment to view availability and make a booking.
            </p>
          </div>

          {role === 'admin' && (
            <button
              onClick={() => setIsCreating(!isCreating)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-200 ${
                isCreating
                  ? 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/8'
                  : 'btn-primary text-white'
              }`}
            >
              <Plus className={`h-4 w-4 transition-transform ${isCreating ? 'rotate-45' : ''}`} />
              {isCreating ? 'Cancel' : 'New Resource'}
            </button>
          )}
        </div>

        {/* Admin create form */}
        {isCreating && role === 'admin' && (
          <div className="glass-card mb-8 overflow-hidden rounded-2xl p-6">
            <div className="mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4 text-indigo-400" />
              <h2 className="text-base font-bold text-white">Create New Resource</h2>
            </div>

            {error && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/8 p-3.5 text-sm text-red-400">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleCreate} className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">Resource Name</label>
                <input
                  name="name"
                  required
                  placeholder="e.g. Conference Room A"
                  className="w-full rounded-xl border border-white/8 bg-white/4 px-4 py-2.5 text-sm text-white placeholder-slate-600 transition-all focus:border-indigo-500/60"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">Capacity</label>
                <input
                  name="capacity"
                  type="number"
                  required
                  min="1"
                  placeholder="Number of seats / units"
                  className="w-full rounded-xl border border-white/8 bg-white/4 px-4 py-2.5 text-sm text-white placeholder-slate-600 transition-all focus:border-indigo-500/60"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">Description</label>
                <textarea
                  name="description"
                  placeholder="Location, setup, A/V equipment, rules..."
                  className="h-20 w-full resize-none rounded-xl border border-white/8 bg-white/4 px-4 py-2.5 text-sm text-white placeholder-slate-600 transition-all focus:border-indigo-500/60"
                />
              </div>
              <div className="md:col-span-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  name="requires_approval"
                  id="requires_approval"
                  className="h-4 w-4 cursor-pointer rounded border-slate-700 bg-slate-900 text-indigo-500 accent-indigo-500"
                />
                <label htmlFor="requires_approval" className="cursor-pointer text-sm text-slate-300">
                  Requires admin approval before slot is confirmed
                </label>
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary rounded-xl px-6 py-2.5 text-sm font-bold text-white disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Save Resource'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources..."
            className="w-full rounded-xl border border-white/6 bg-white/3 py-3 pl-11 pr-4 text-sm text-slate-200 placeholder-slate-600 transition-all focus:border-indigo-500/50 focus:bg-white/5"
          />
        </div>

        {/* Resource grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/8 bg-white/2 py-20 text-center">
            <Layers className="h-10 w-10 stroke-1 text-slate-700" />
            <p className="text-sm text-slate-500">
              {searchQuery ? 'No resources match your search.' : 'No resources yet. Create the first one.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((res, i) => (
              <div
                key={res.id}
                style={{ animationDelay: `${i * 60}ms` }}
                className="glass-card animate-fade-up group flex flex-col overflow-hidden rounded-2xl opacity-0 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/10"
              >
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-white transition-colors group-hover:text-indigo-300">
                      {res.name}
                    </h3>
                    {role === 'admin' && (
                      <button
                        onClick={() => handleDelete(res.id)}
                        title="Delete resource"
                        className="rounded-lg p-1.5 text-slate-600 transition hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="mt-2 min-h-[2.5rem] text-xs leading-relaxed text-slate-400 line-clamp-3">
                    {res.description || 'No description provided.'}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300">
                      <Users className="h-3 w-3 text-indigo-400" />
                      {res.capacity} seat{res.capacity !== 1 ? 's' : ''}
                    </span>
                    {res.requires_approval ? (
                      <span className="badge-pending inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold">
                        Approval Required
                      </span>
                    ) : (
                      <span className="badge-approved inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold">
                        <Zap className="mr-1 h-2.5 w-2.5" /> Instant Book
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 bg-white/2 px-6 py-3.5">
                  <span className="text-xs text-slate-600">08:00 AM – 08:00 PM</span>
                  <Link
                    href={`/resources/${res.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 transition hover:text-indigo-300"
                  >
                    Book Slot <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
