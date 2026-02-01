import { AppLayout } from "@/components/layout";
import PropertyListingTemplate from "@/components/property/templates/property-list";

export default async function Home() {
  return (
    <AppLayout variant="home">
      <PropertyListingTemplate />
    </AppLayout>
  );
}
