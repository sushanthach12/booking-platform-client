import { HostPropertyEditView } from "@/components/host/host-property-edit-view";
import type { IBecomeHostPropertyFormData } from "@/domain/entities";

interface HostPropertyEditTemplateProps {
  propertyId: string;
  initialData: IBecomeHostPropertyFormData | null;
}

export function HostPropertyEditTemplate({
  propertyId,
  initialData,
}: HostPropertyEditTemplateProps) {
  return <HostPropertyEditView propertyId={propertyId} initialData={initialData} />;
}
