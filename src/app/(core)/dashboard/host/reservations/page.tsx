import { HostGuard } from "@/components/dashboard/host-guard";
import { ReservationsView } from "@/components/dashboard/host/reservations-view";

export default function HostReservationsPage() {
  return (
    <HostGuard>
      <ReservationsView />
    </HostGuard>
  );
}
