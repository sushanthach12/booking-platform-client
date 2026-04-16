export const TOKENS = {
  IPropertyRepository: Symbol.for("IPropertyRepository"),
  IAuthRepository: Symbol.for("IAuthRepository"),
  IUploadRepository: Symbol.for("IUploadRepository"),
  IBookingRepository: Symbol.for("IBookingRepository"),
  IHostPropertyRepository: Symbol.for("IHostPropertyRepository"),
  IWishlistRepository: Symbol.for("IWishlistRepository"),
  IPayoutRepository: Symbol.for("IPayoutRepository"),
  UploadUseCase: Symbol.for("UploadUseCase"),
  BookingUseCase: Symbol.for("BookingUseCase"),
  HostPropertyUseCase: Symbol.for("HostPropertyUseCase"),
  WishlistUseCase: Symbol.for("WishlistUseCase"),
  PayoutUseCase: Symbol.for("PayoutUseCase"),
} as const;
