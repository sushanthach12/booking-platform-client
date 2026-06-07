import { HostGuard } from "@/components/dashboard/host-guard";
import { PayoutsTemplate } from "@/components/dashboard/host/payouts";

export default function HostPayoutsPage() {
  return (
    <HostGuard>
      <PayoutsTemplate />
    </HostGuard>
  );
}
