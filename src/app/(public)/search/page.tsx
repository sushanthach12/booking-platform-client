import { AppLayout } from "@/components/layout";
import SearchListingTemplate from "@/components/property/templates/search-listing-template";

export default async function SearchPage() {
  return (
    <AppLayout variant="home">
      <SearchListingTemplate />
    </AppLayout>
  );
}
