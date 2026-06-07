/** Loading placeholder mirroring the listing detail layout. */
export function ListingDetailSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-56 rounded-lg bg-slate-100" />
          <div className="h-56 rounded-[14px] border border-slate-100 bg-white" />
          <div className="h-9 w-80 rounded bg-slate-100" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              <div className="h-40 rounded-2xl border border-slate-100 bg-white" />
              <div className="h-48 rounded-2xl border border-slate-100 bg-white" />
            </div>
            <div className="h-64 rounded-2xl border border-slate-100 bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
