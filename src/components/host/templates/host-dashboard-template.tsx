import { HostDashboardView } from "../host-dashboard-view";

/**
 * Parent template for host dashboard page.
 * - Owns: API calls (listings, bookings), hooks, data utils.
 * - Passes state to HostDashboardView only via props. No fetching in child.
 * Page renders only layout + this template.
 */
export default async function HostDashboardTemplate() {
  // TODO: fetch host listings, bookings from use-cases; map to view state
  const listingsSummary = undefined;
  const bookingsSummary = undefined;

  return (
    <HostDashboardView
      listingsSummary={listingsSummary}
      bookingsSummary={bookingsSummary}
    />
  );
}
