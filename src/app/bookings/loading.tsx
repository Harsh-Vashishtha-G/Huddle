export default function Loading() {
  return (
    <div className="relative min-h-screen bg-white">
      <div className="ambient-glow" />
      <div className="relative z-10 mx-auto max-w-5xl animate-pulse px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-2">
          <div className="h-4 w-28 rounded-full bg-emerald-50" />
          <div className="h-8 w-48 rounded bg-gray-100" />
          <div className="h-4 w-72 rounded bg-gray-50" />
        </div>
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="glass-card flex items-center justify-between rounded-2xl p-5 bg-white border border-gray-100">
              <div className="space-y-2">
                <div className="h-4 w-40 rounded bg-gray-100" />
                <div className="h-3 w-56 rounded bg-gray-50" />
                <div className="h-3 w-32 rounded bg-gray-50" />
              </div>
              <div className="h-8 w-24 rounded-full bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
