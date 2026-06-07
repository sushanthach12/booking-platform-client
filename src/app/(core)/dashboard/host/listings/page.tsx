import { HostGuard } from "@/components/dashboard/host-guard";
import { ListingsTemplate } from "@/components/dashboard/host/listings";

export default function HostListingsPage() {
  return (
    <HostGuard>
      <ListingsTemplate />
    </HostGuard>
  );
}
