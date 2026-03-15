import { parseBookingSearchParams } from "@/lib/utils/booking-params";
import { SimpleHeader } from "@/components/header/simple-header";
import PropertyDetailsTemplate from "@/components/property/templates/property-details-template";

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolved = await searchParams;
  const raw = resolved?.title;
  const title =
    typeof raw === "string"
      ? decodeURIComponent(raw)
      : Array.isArray(raw) && raw[0]
        ? decodeURIComponent(raw[0])
        : null;
  return { title: title ?? "Property" };
}

export default async function PropertyDetailPage({
  params,
  searchParams,
}: PropertyDetailPageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const parsed = parseBookingSearchParams(resolvedSearchParams);
  const initialDateRange =
    parsed.checkIn && parsed.checkOut
      ? { from: parsed.checkIn, to: parsed.checkOut }
      : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SimpleHeader />
      <main className="flex-1">
        <PropertyDetailsTemplate
          propertyId={id}
          initialDateRange={initialDateRange}
        />
      </main>
    </div>
  );
}
