import { SearchHeader, SearchTemplate } from "@/components/search";

export default function SearchPage() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-background">
      <SearchHeader />
      <main className="flex flex-1 overflow-hidden">
        <SearchTemplate />
      </main>
    </div>)
}
