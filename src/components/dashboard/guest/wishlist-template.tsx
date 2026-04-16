// Server Component — thin shell; wishlist data is fetched client-side via useWishlist hook
import { WishlistView } from "./wishlist-view";

export function WishlistTemplate() {
  return <WishlistView />;
}
