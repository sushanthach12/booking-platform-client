/** Loading placeholder mirroring the payouts layout. */
export function PayoutsSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="space-y-2">
            <div className="h-8 w-32 rounded-lg bg-slate-100" />
            <div className="h-4 w-56 rounded bg-slate-100" />
          </div>
          <div className="h-32 rounded-2xl border border-slate-100 bg-white" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-28 rounded-2xl border border-slate-100 bg-white"
              />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="h-80 rounded-2xl border border-slate-100 bg-white" />
            <div className="h-80 rounded-2xl border border-slate-100 bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
