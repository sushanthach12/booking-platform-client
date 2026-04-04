export const TOKENS = {
  IPropertyRepository: Symbol.for("IPropertyRepository"),
  IAuthRepository: Symbol.for("IAuthRepository"),
  IUploadRepository: Symbol.for("IUploadRepository"),
  IBookingRepository: Symbol.for("IBookingRepository"),
  IHostPropertyRepository: Symbol.for("IHostPropertyRepository"),
  UploadUseCase: Symbol.for("UploadUseCase"),
  BookingUseCase: Symbol.for("BookingUseCase"),
  HostPropertyUseCase: Symbol.for("HostPropertyUseCase"),
} as const;
