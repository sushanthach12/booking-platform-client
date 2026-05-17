import { HostGuard } from "@/components/dashboard/host-guard";
import { OverviewTemplate } from "@/components/dashboard/host/overview-template";

export default function HostOverviewPage() {
  return (
    <HostGuard>
      <OverviewTemplate />
    </HostGuard>
  );
}
