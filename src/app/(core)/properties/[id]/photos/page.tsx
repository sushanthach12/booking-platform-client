import { notFound } from "next/navigation";
import { getPropertyUseCase } from "@/domain/di";
import { mapPropertyToDetailView } from "@/lib/utils/map-property";
import PhotoTour from "@/components/property/photo-tour";

interface PropertyPhotosPageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyPhotosPage({
  params,
}: PropertyPhotosPageProps) {
  const { id } = await params;
  const propertyUseCase = getPropertyUseCase();
  const property = await propertyUseCase.getPropertyById(id);

  if (!property) notFound();

  const viewState = mapPropertyToDetailView(property);

  return (
    <div className="min-h-screen bg-white">
      <PhotoTour
        propertyId={id}
        images={viewState.images}
        title={viewState.title}
      />
    </div>
  );
}
