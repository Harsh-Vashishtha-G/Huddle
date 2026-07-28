export default function Loading() {
  return (
    <div className="relative min-h-screen">
      <div className="ambient-glow" />
      <div className="relative z-10 mx-auto max-w-5xl animate-pulse px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-2">
          <div className="h-4 w-28 rounded-full bg-white/6" />
          <div className="h-8 w-48 rounded bg-white/8" />
          <div className="h-4 w-72 rounded bg-white/4" />
        </div>
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="glass-card flex items-center justify-between rounded-2xl p-5">
              <div className="space-y-2">
                <div className="h-4 w-40 rounded bg-white/8" />
                <div className="h-3 w-56 rounded bg-white/4" />
                <div className="h-3 w-32 rounded bg-white/3" />
              </div>
              <div className="h-8 w-24 rounded-xl bg-white/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
