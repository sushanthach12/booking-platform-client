import { HostGuard } from "@/components/dashboard/host-guard";
import { ReviewsView } from "@/components/dashboard/host/reviews-view";

export default function HostReviewsPage() {
  return (
    <HostGuard>
      <ReviewsView />
    </HostGuard>
  );
}
