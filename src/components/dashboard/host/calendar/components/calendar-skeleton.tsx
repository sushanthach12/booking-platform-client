export function CalendarSkeleton() {
  return (
    <div className="grid animate-pulse grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="h-7 w-40 rounded-lg bg-slate-100" />
          <div className="h-7 w-32 rounded-lg bg-slate-100" />
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: 42 }).map((_, i) => (
            <div key={i} className="h-[78px] rounded-xl bg-slate-50 sm:h-[96px]" />
          ))}
        </div>
      </div>
      <div className="h-[480px] rounded-2xl border border-slate-100 bg-white" />
    </div>
  );
}
