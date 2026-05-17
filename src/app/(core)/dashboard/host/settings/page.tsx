import { HostGuard } from "@/components/dashboard/host-guard";
import { HostSettingsView } from "@/components/dashboard/host/host-settings-view";

export default function HostSettingsPage() {
  return (
    <HostGuard>
      <HostSettingsView />
    </HostGuard>
  );
}
