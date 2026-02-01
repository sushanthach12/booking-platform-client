import { AccountView } from "../account-view";

/**
 * Parent template for account page.
 * - Owns: API calls (user, bookings, waitlist, price alerts), hooks, data utils.
 * - Passes state to AccountView only via props. No fetching in child.
 * Page renders only layout + this template.
 */
export default async function AccountTemplate() {
  // TODO: fetch user, bookings from use-cases; map to view state
  const profile = undefined;
  const bookingsSummary = undefined;

  return (
    <AccountView
      profile={profile}
      bookingsSummary={bookingsSummary}
    />
  );
}
