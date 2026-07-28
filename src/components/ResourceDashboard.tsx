'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createResource, deleteResource } from '@/app/actions/resource'
import { Shield, Plus, Users, Trash2, Search, Layers, Zap, ArrowRight, AlertCircle, Filter } from 'lucide-react'

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
  const [approvalFilter, setApprovalFilter] = useState<'all' | 'instant' | 'approval'>('all')
  const [minCapacity, setMinCapacity] = useState<number>(0)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const filtered = resources.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesApproval = 
      approvalFilter === 'all' ? true :
      approvalFilter === 'instant' ? !r.requires_approval :
      r.requires_approval

    const matchesCapacity = r.capacity >= minCapacity

    return matchesSearch && matchesApproval && matchesCapacity
  })

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
    <div className="relative min-h-screen bg-white text-gray-900">
      <div className="ambient-glow" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
              <Layers className="h-3.5 w-3.5" />
              Bookable Resources
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">Team Resources</h1>
            <p className="mt-1.5 text-sm text-gray-600">
              Select a room or piece of equipment to view availability and make a booking.
            </p>
          </div>

          {role === 'admin' && (
            <button
              onClick={() => setIsCreating(!isCreating)}
              className={`flex shrink-0 items-center gap-2 px-5 py-2.5 text-sm font-bold transition-all duration-200 ${
                isCreating
                  ? 'btn-secondary'
                  : 'btn-primary'
              }`}
            >
              <Plus className={`h-4 w-4 transition-transform ${isCreating ? 'rotate-45' : ''}`} />
              {isCreating ? 'Cancel' : 'New Resource'}
            </button>
          )}
        </div>

        {/* Admin create form */}
        {isCreating && role === 'admin' && (
          <div className="glass-card mb-8 overflow-hidden rounded-2xl p-6 bg-white border border-gray-200 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-600" />
              <h2 className="text-base font-bold text-gray-900">Create New Resource</h2>
            </div>

            {error && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm font-medium text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleCreate} className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600">Resource Name</label>
                <input
                  name="name"
                  required
                  placeholder="e.g. Conference Room A"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600">Capacity</label>
                <input
                  name="capacity"
                  type="number"
                  required
                  min="1"
                  placeholder="Number of seats / units"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600">Description</label>
                <textarea
                  name="description"
                  placeholder="Location, setup, A/V equipment, rules..."
                  className="h-20 w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <div className="md:col-span-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  name="requires_approval"
                  id="requires_approval"
                  className="h-4 w-4 cursor-pointer rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                />
                <label htmlFor="requires_approval" className="cursor-pointer text-sm text-gray-700 font-medium">
                  Requires admin approval before slot is confirmed
                </label>
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary px-6 py-2.5 text-sm font-bold disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Save Resource'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search & Filter Controls */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources by name or equipment..."
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter by booking type */}
            <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white p-1 text-xs">
              <Filter className="ml-2 h-3.5 w-3.5 text-gray-400" />
              <button
                onClick={() => setApprovalFilter('all')}
                className={`rounded-lg px-2.5 py-1 font-semibold transition ${approvalFilter === 'all' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:text-gray-900'}`}
              >
                All
              </button>
              <button
                onClick={() => setApprovalFilter('instant')}
                className={`rounded-lg px-2.5 py-1 font-semibold transition ${approvalFilter === 'instant' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Instant Book
              </button>
              <button
                onClick={() => setApprovalFilter('approval')}
                className={`rounded-lg px-2.5 py-1 font-semibold transition ${approvalFilter === 'approval' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Needs Approval
              </button>
            </div>

            {/* Filter by capacity */}
            <select
              value={minCapacity}
              onChange={(e) => setMinCapacity(Number(e.target.value))}
              className="cursor-pointer rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition focus:border-emerald-500"
            >
              <option value={0}>Any Capacity</option>
              <option value={2}>2+ Seats</option>
              <option value={5}>5+ Seats</option>
              <option value={10}>10+ Seats</option>
            </select>
          </div>
        </div>

        {/* Resource grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-20 text-center">
            <Layers className="h-10 w-10 stroke-1 text-gray-400" />
            <p className="text-sm text-gray-500">
              {searchQuery || approvalFilter !== 'all' || minCapacity > 0
                ? 'No resources match your filters.'
                : 'No resources yet. Create the first one.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((res, i) => (
              <div
                key={res.id}
                style={{ animationDelay: `${i * 60}ms` }}
                className="glass-card animate-fade-up group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white opacity-0 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-gray-200/50"
              >
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-gray-900 transition-colors group-hover:text-emerald-600">
                      {res.name}
                    </h3>
                    {role === 'admin' && (
                      <button
                        onClick={() => handleDelete(res.id)}
                        title="Delete resource"
                        className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="mt-2 min-h-[2.5rem] text-xs leading-relaxed text-gray-600 line-clamp-3">
                    {res.description || 'No description provided.'}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700">
                      <Users className="h-3 w-3 text-emerald-600" />
                      {res.capacity} seat{res.capacity !== 1 ? 's' : ''}
                    </span>
                    {res.requires_approval ? (
                      <span className="badge-pending inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold">
                        Approval Required
                      </span>
                    ) : (
                      <span className="badge-approved inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold">
                        <Zap className="mr-1 h-2.5 w-2.5 text-emerald-600" /> Instant Book
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-6 py-3.5">
                  <span className="text-xs text-gray-500 font-medium">08:00 AM – 08:00 PM</span>
                  <Link
                    href={`/resources/${res.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 transition hover:text-emerald-700"
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
