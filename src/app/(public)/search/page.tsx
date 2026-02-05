import { SearchHeader } from "@/components/header/search-header";
import SearchListingTemplate from "@/components/property/templates/search-listing-template";

export default async function SearchPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  return (
    <div className="min-h-screen w-full flex flex-col bg-background">
      <SearchHeader />
      <main className="flex flex-1 overflow-hidden">
        <SearchListingTemplate searchParams={searchParams} />
      </main>
    </div>
  );
}
