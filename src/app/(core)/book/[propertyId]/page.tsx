import BookingTemplate from "@/components/book/templates/booking-template";
import { SimpleHeader } from "@/components/header/simple-header";

interface BookPageProps {
  params: Promise<{ propertyId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function BookPage({
  params,
  searchParams,
}: BookPageProps) {
  const { propertyId } = await params;
  const search = await searchParams;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SimpleHeader showUserMenu={false} />
      <main className="flex-1">
        <BookingTemplate propertyId={propertyId} searchParams={search} />
      </main>
    </div>
  );
}
