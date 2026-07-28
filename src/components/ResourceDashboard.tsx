'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createResource, deleteResource } from '@/app/actions/resource'
import { Shield, Plus, Users, Trash2, Search, HelpCircle, Layers } from 'lucide-react'

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

  const filteredResources = resources.filter((res) =>
    res.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    try {
      await createResource(formData)
      // Reset form and reload
      event.currentTarget.reset()
      setIsCreating(false)
      window.location.reload()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this resource? All associated bookings will be deleted.')) return

    try {
      await deleteResource(id)
      setResources((prev) => prev.filter((r) => r.id !== id))
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Layers className="h-6 w-6 text-indigo-500" />
            Bookable Resources
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Select a room or piece of equipment to view availability and make bookings.
          </p>
        </div>

        {role === 'admin' && (
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4.5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-650/20 cursor-pointer"
          >
            <Plus className="h-4 w-4" /> {isCreating ? 'Cancel' : 'New Resource'}
          </button>
        )}
      </div>

      {/* Admin creation form */}
      {isCreating && role === 'admin' && (
        <div className="mb-8 rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600" />
          <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-400" /> Create New Resource
          </h2>
          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Resource Name
              </label>
              <input
                name="name"
                required
                placeholder="e.g. Conference Room A, projector"
                className="w-full rounded-lg border border-slate-850 bg-slate-900/50 px-4 py-2 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-indigo-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Capacity
              </label>
              <input
                name="capacity"
                type="number"
                required
                min="1"
                placeholder="Number of seats/units"
                className="w-full rounded-lg border border-slate-850 bg-slate-900/50 px-4 py-2 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-indigo-500 transition"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Provide location details, setup specifications, or rules..."
                className="w-full rounded-lg border border-slate-850 bg-slate-900/50 px-4 py-2 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-indigo-500 transition h-20 resize-none"
              />
            </div>
            <div className="md:col-span-2 flex items-center gap-3">
              <input
                name="requires_approval"
                id="requires_approval"
                type="checkbox"
                className="h-4.5 w-4.5 rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-950 cursor-pointer"
              />
              <label htmlFor="requires_approval" className="text-sm font-medium text-slate-300 cursor-pointer selection:bg-transparent">
                Requires Admin Approval (Bookings will be created as pending)
              </label>
            </div>
            <div className="md:col-span-2 flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:bg-indigo-800 transition cursor-pointer"
              >
                {loading ? 'Creating...' : 'Save Resource'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search Filter */}
      <div className="relative mb-6">
        <Search className="absolute top-3.5 left-4 h-4 w-4 text-slate-500" />
        <input
          type="text"
          placeholder="Filter resources by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-slate-900 bg-slate-950 px-11 py-3 text-sm text-slate-100 placeholder-slate-550 outline-none focus:border-indigo-500 transition"
        />
      </div>

      {/* Grid List */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-900 rounded-2xl bg-slate-950/20">
          <Layers className="h-10 w-10 mx-auto text-slate-600 stroke-1 mb-3" />
          <p className="text-sm text-slate-400">No resources found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="flex flex-col rounded-xl border border-slate-900 bg-slate-950/50 overflow-hidden hover:border-slate-800 transition shadow-md hover:shadow-lg group"
            >
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-400 transition">
                    {res.name}
                  </h3>
                  {role === 'admin' && (
                    <button
                      onClick={() => handleDelete(res.id)}
                      className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-900 transition cursor-pointer"
                      title="Delete resource"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <p className="mt-2 text-xs text-slate-400 line-clamp-3 leading-relaxed min-h-[3rem]">
                  {res.description || 'No description provided.'}
                </p>

                <div className="mt-6 flex flex-wrap gap-2 items-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300">
                    <Users className="h-3.5 w-3.5 text-indigo-400" />
                    Max: {res.capacity}
                  </span>

                  {res.requires_approval ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-950/30 px-3 py-1 text-xs font-semibold text-amber-400 border border-amber-950">
                      Requires Approval
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/30 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-950">
                      Auto-Approve
                    </span>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-900 bg-slate-950 px-6 py-4 flex items-center justify-between">
                <span className="text-xs text-slate-500">Available Daily</span>
                <Link
                  href={`/resources/${res.id}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
                >
                  Book Slot &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
