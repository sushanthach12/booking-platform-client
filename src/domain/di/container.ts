import "reflect-metadata";
import { container } from "tsyringe";
import type { IPropertyRepository } from "../interfaces";
import type { IAuthRepository } from "../interfaces/auth.interface";
import type { IUploadRepository } from "../interfaces/upload.repository.interface";
import { PropertyRepository } from "../repositories/property.repository";
import { AuthRepository } from "../repositories/auth.repository";
import { UploadRepository } from "../repositories/upload.repository";
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

container.register<UploadUseCase>(TOKENS.UploadUseCase, {
  useClass: UploadUseCase,
});

// Export configured container
export { container };
