import { SearchTemplate } from "@/components/search";
import { Suspense } from "react";

function SearchPageFallback() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-background animate-pulse">
      <div className="h-16 bg-stone-100" />
      <main className="flex-1 flex">
        <div className="hidden lg:block w-64 shrink-0 bg-stone-50 border-r border-stone-200" />
        <div className="flex-1 p-6">
          <div className="h-8 w-48 bg-stone-100 rounded mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-64 bg-stone-100 rounded-lg"
                aria-hidden
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchTemplate />
    </Suspense>
  );
}
