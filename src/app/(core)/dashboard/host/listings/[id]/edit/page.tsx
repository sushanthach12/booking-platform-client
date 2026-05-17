import { HostGuard } from '@/components/dashboard/host-guard';
import { HostPropertyEditTemplate } from '@/components/host/templates/host-property-edit-template';

interface EditListingPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditListingPage({ params }: EditListingPageProps) {
  const { id } = await params;

  return (
    <HostGuard>
      <HostPropertyEditTemplate propertyId={id} initialData={null} />
    </HostGuard>
  );
}
