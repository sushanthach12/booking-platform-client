import { SimpleHeader } from "@/components/header/simple-header";
import { BookingStatusView } from "@/components/book/booking-status-view";

interface StatusPageProps {
  params: Promise<{ propertyId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function BookingStatusPage({
  params,
  searchParams,
}: StatusPageProps) {
  const { propertyId } = await params;
  const search = await searchParams;
  const bookingId =
    typeof search.bookingId === "string" ? search.bookingId : null;
  const returnStatus = typeof search.status === "string" ? search.status : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SimpleHeader showUserMenu={false} />
      <main className="flex-1">
        <BookingStatusView
          propertyId={propertyId}
          bookingId={bookingId}
          returnStatus={returnStatus}
        />
      </main>
    </div>
  );
}
