import type {
  IAuthRepository,
  IBookingRepository,
  IHostPropertyRepository,
  IPayoutRepository,
  IPropertyRepository,
  IUploadRepository,
  IWishlistRepository,
} from "@/domain/interfaces";
import "reflect-metadata";
import { container } from "tsyringe";
import { AuthRepository } from "../../data/repositories/auth.repository";
import { BookingRepository } from "../../data/repositories/booking.repository";
import { HostPropertyRepository } from "../../data/repositories/host-property.repository";
import { PayoutRepository } from "../../data/repositories/payout.repository";
import { PropertyRepository } from "../../data/repositories/property.repository";
import { UploadRepository } from "../../data/repositories/upload.repository";
import { WishlistRepository } from "../../data/repositories/wishlist.repository";
import { BookingUseCase } from "../use-cases/booking.use-case";
import { HostPropertyUseCase } from "../use-cases/host-property.use-case";
import { PayoutUseCase } from "../use-cases/payout.use-case";
import { UploadUseCase } from "../use-cases/upload.use-case";
import { WishlistUseCase } from "../use-cases/wishlist.use-case";
import { TOKENS } from "./types";

// Register all dependencies
container.register<IPropertyRepository>(TOKENS.IPropertyRepository, {
  useClass: PropertyRepository,
});

container.register<IAuthRepository>(TOKENS.IAuthRepository, {
  useClass: AuthRepository,
});

container.register<IUploadRepository>(TOKENS.IUploadRepository, {
  useClass: UploadRepository,
});

container.register<IBookingRepository>(TOKENS.IBookingRepository, {
  useClass: BookingRepository,
});

container.register<IHostPropertyRepository>(TOKENS.IHostPropertyRepository, {
  useClass: HostPropertyRepository,
});

container.register<UploadUseCase>(TOKENS.UploadUseCase, {
  useClass: UploadUseCase,
});

container.register<BookingUseCase>(TOKENS.BookingUseCase, {
  useClass: BookingUseCase,
});

container.register<HostPropertyUseCase>(TOKENS.HostPropertyUseCase, {
  useClass: HostPropertyUseCase,
});

container.register<IWishlistRepository>(TOKENS.IWishlistRepository, {
  useClass: WishlistRepository,
});

container.register<IPayoutRepository>(TOKENS.IPayoutRepository, {
  useClass: PayoutRepository,
});

container.register<WishlistUseCase>(TOKENS.WishlistUseCase, {
  useClass: WishlistUseCase,
});

container.register<PayoutUseCase>(TOKENS.PayoutUseCase, {
  useClass: PayoutUseCase,
});

// Export configured container
export { container };
