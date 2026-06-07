/** Loading placeholder mirroring the listings grid. */
export function ListingsSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-7 w-40 rounded-lg bg-slate-100" />
          <div className="h-9 w-64 rounded-xl bg-slate-100" />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-72 rounded-2xl border border-slate-100 bg-white"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
