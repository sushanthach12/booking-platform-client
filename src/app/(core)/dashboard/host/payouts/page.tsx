import { HostGuard } from "@/components/dashboard/host-guard";
import { PayoutsView } from "@/components/dashboard/host/payouts-view";

export default function HostPayoutsPage() {
  return (
    <HostGuard>
      <PayoutsView />
    </HostGuard>
  );
}
