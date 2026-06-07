import { HostGuard } from "@/components/dashboard/host-guard";
import { ListingDetailTemplate } from "@/components/dashboard/host/listings";

interface ListingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ListingDetailPage({
  params,
}: ListingDetailPageProps) {
  const { id } = await params;

  return (
    <HostGuard>
      <ListingDetailTemplate propertyId={id} />
    </HostGuard>
  );
}
