import { AppLayout } from "@/components/layout";
import PropertyDetailsTemplate from "@/components/property/templates/property-details-template";

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { id } = await params;

  return (
    <AppLayout variant="home">
      <PropertyDetailsTemplate propertyId={id} />
    </AppLayout>
  );
}
