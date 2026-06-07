/** Loading placeholder mirroring the overview layout. */
export function OverviewSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="space-y-2">
            <div className="h-7 w-64 rounded-lg bg-slate-100" />
            <div className="h-4 w-80 rounded bg-slate-100" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 rounded-2xl border border-slate-100 bg-white"
              />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="h-96 rounded-2xl border border-slate-100 bg-white" />
            <div className="space-y-6">
              <div className="h-44 rounded-2xl border border-slate-100 bg-white" />
              <div className="h-44 rounded-2xl border border-slate-100 bg-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
