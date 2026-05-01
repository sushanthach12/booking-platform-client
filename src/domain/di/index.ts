import { UploadRepository } from "../../data/repositories/upload.repository";
import { AuthUseCase } from "../use-cases/auth.use-case";
import { BookingUseCase } from "../use-cases/booking.use-case";
import { HostPropertyUseCase } from "../use-cases/host-property.use-case";
import { PayoutUseCase } from "../use-cases/payout.use-case";
import { PropertyUseCase } from "../use-cases/property.use-case";
import { WishlistUseCase } from "../use-cases/wishlist.use-case";
import { container } from "./container";

export const getPropertyUseCase = () => container.resolve(PropertyUseCase);
export const getAuthUseCase = () => container.resolve(AuthUseCase);
export const getUploadRepository = () => container.resolve(UploadRepository);
export const getBookingUseCase = () => container.resolve(BookingUseCase);
export const getHostPropertyUseCase = () =>
  container.resolve(HostPropertyUseCase);
export const getWishlistUseCase = () => container.resolve(WishlistUseCase);
export const getPayoutUseCase = () => container.resolve(PayoutUseCase);
