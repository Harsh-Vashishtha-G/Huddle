export default function Loading() {
  return (
    <div className="relative min-h-screen">
      <div className="ambient-glow" />
      <div className="relative z-10 mx-auto max-w-7xl animate-pulse px-4 py-8 sm:px-6 lg:px-8">
        {/* Back button skeleton */}
        <div className="mb-7 h-4 w-32 rounded-full bg-white/6" />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-5">
            <div className="glass-card rounded-2xl p-6 space-y-3">
              <div className="h-5 w-24 rounded-full bg-white/6" />
              <div className="h-6 w-48 rounded bg-white/8" />
              <div className="h-4 w-full rounded bg-white/4" />
              <div className="h-4 w-3/4 rounded bg-white/4" />
            </div>
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <div className="h-5 w-28 rounded bg-white/8" />
              {[1,2,3,4].map(i => (
                <div key={i} className="space-y-1.5">
                  <div className="h-3 w-20 rounded bg-white/4" />
                  <div className="h-10 w-full rounded-xl bg-white/4" />
                </div>
              ))}
              <div className="h-10 w-full rounded-xl bg-indigo-500/20" />
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-5 w-40 rounded bg-white/8" />
                <div className="h-8 w-36 rounded-lg bg-white/6" />
              </div>
              {[1,2,3,4].map(i => (
                <div key={i} className="h-16 w-full rounded-xl bg-white/4" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
