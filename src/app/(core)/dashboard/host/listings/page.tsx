import { HostGuard } from "@/components/dashboard/host-guard";
import { ListingsTemplate } from "@/components/dashboard/host/listings-template";

export default function HostListingsPage() {
  return (
    <HostGuard>
      <ListingsTemplate />
    </HostGuard>
  );
}
