import { notFound } from "next/navigation";

import type { BookPropertyViewState } from "@/components/book/types";
import { getPropertyUseCase } from "@/domain/di";
import { parseBookingSearchParams } from "@/lib/utils/booking-params";
import { mapPropertyToDetailView } from "@/lib/utils/map-property";
import { addDays, startOfDay } from "date-fns";
import { BookingForm } from "../booking-form";

interface BookingTemplateProps {
  propertyId: string;
  searchParams: Record<string, string | string[] | undefined>;
}

function toBookPropertyView(
  base: ReturnType<typeof mapPropertyToDetailView>,
): BookPropertyViewState {
  return {
    ...base,
    cancellationDate: "2 April",
  };
}

export default async function BookingTemplate({
  propertyId,
  searchParams,
}: BookingTemplateProps) {
  const propertyUseCase = getPropertyUseCase();
  const property = await propertyUseCase.getPropertyById(propertyId);

  if (!property) notFound();

  const detailView = mapPropertyToDetailView(property);
  const bookProperty = toBookPropertyView(detailView);

  const parsed = parseBookingSearchParams(searchParams);
  const today = startOfDay(new Date());
  const defaultCheckIn = addDays(today, 2);
  const defaultCheckOut = addDays(today, 16);

  const initialCheckIn = parsed.checkIn ?? defaultCheckIn;
  const initialCheckOut = parsed.checkOut ?? defaultCheckOut;
  const initialGuests = {
    adults: parsed.adults,
    children: parsed.children,
    infants: parsed.infants,
  };

  return (
    <BookingForm
      property={bookProperty}
      initialCheckIn={initialCheckIn}
      initialCheckOut={initialCheckOut}
      initialGuests={initialGuests}
      currency={parsed.currency}
    />
  );
}
