import { BookingDetailTemplate } from '@/components/dashboard/guest/booking-detail-template';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BookingDetailPage({ params }: Props) {
  const { id } = await params;
  return <BookingDetailTemplate bookingId={id} />;
}
