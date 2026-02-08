import { SimpleHeader } from "@/components/header/simple-header";
import PropertyDetailsTemplate from "@/components/property/templates/property-details-template";

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SimpleHeader />
      <main className="flex flex-1 overflow-hidden">
        <PropertyDetailsTemplate propertyId={id} />
      </main>
    </div>
  );
}
