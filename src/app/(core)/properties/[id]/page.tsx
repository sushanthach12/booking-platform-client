import { SimpleHeader } from "@/components/header/simple-header";
import PropertyDetailsTemplate from "@/components/property/templates/property-details-template";
import { parseBookingSearchParams } from "@/lib/utils/booking-params";
import { Metadata } from "next";

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
  searchParams,
}: PropertyDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const resolved = await searchParams;

  const raw = resolved?.title;
  const title =
    typeof raw === "string"
      ? decodeURIComponent(raw)
      : Array.isArray(raw) && raw[0]
        ? decodeURIComponent(raw[0])
        : "Property Details";

  const canonicalUrl = `/properties/${id}`;

  return {
    title, // → "Oia Cliffside Villa | Stayly" via layout template
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      url: canonicalUrl,
      type: "website",
      // Uncomment once property images are available via use case:
      // images: [{ url: property.coverImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      title,
      card: "summary_large_image",
    },
  };
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
