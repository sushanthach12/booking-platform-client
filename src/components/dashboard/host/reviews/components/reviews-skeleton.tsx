/** Loading placeholder mirroring the reviews two-column layout. */
export function ReviewsSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-7 w-40 rounded-lg bg-slate-100" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
            <div className="h-80 rounded-2xl border border-slate-100 bg-white" />
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-28 rounded-2xl border border-slate-100 bg-white"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
