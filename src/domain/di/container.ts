import "reflect-metadata";
import { container } from "tsyringe";
import type { IBookingRepository } from "../../data/interfaces/booking.repository.interface";
import type { IHostPropertyRepository } from "../../data/interfaces/host-property.repository.interface";
import type { IPropertyRepository } from "../../data/interfaces";
import type { IAuthRepository } from "../../data/interfaces/auth.interface";
import type { IUploadRepository } from "../../data/interfaces/upload.repository.interface";
import { AuthRepository } from "../../data/repositories/auth.repository";
import { BookingRepository } from "../../data/repositories/booking.repository";
import { HostPropertyRepository } from "../../data/repositories/host-property.repository";
import { PropertyRepository } from "../../data/repositories/property.repository";
import { UploadRepository } from "../../data/repositories/upload.repository";
import { BookingUseCase } from "../use-cases/booking.use-case";
import { HostPropertyUseCase } from "../use-cases/host-property.use-case";
import { UploadUseCase } from "../use-cases/upload.use-case";
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

// Export configured container
export { container };
