import { BookingDetailView } from './booking-detail-view';

interface Props {
  bookingId: string;
}

export function BookingDetailTemplate({ bookingId }: Props) {
  return <BookingDetailView bookingId={bookingId} />;
}
