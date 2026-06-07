import { HostGuard } from "@/components/dashboard/host-guard";
import { ReviewsTemplate } from "@/components/dashboard/host/reviews";

export default function HostReviewsPage() {
  return (
    <HostGuard>
      <ReviewsTemplate />
    </HostGuard>
  );
}
