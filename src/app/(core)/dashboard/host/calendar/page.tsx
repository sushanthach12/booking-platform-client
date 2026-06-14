import { HostGuard } from "@/components/dashboard/host-guard";
import { CalendarView } from "@/components/dashboard/host/calendar";

export default function HostCalendarPage() {
  return (
    <HostGuard>
      <CalendarView />
    </HostGuard>
  );
}
