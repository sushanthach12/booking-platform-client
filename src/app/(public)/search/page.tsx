import { AppLayout } from "@/components/layout";
import SearchListingTemplate from "@/components/property/templates/search-listing-template";

export default async function SearchPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  return (
    <AppLayout variant="search">
      <SearchListingTemplate searchParams={searchParams} />
    </AppLayout>
  );
}
