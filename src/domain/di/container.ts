import "reflect-metadata";
import { container } from "tsyringe";
import type { IPropertyRepository } from "../interfaces";
import type { IAuthRepository } from "../interfaces/auth.interface";
import { PropertyRepository } from "../repositories/property.repository";
import { AuthRepository } from "../repositories/auth.repository";
import { TOKENS } from "./types";

// Register all dependencies
container.register<IPropertyRepository>(TOKENS.IPropertyRepository, {
  useClass: PropertyRepository,
});

container.register<IAuthRepository>(TOKENS.IAuthRepository, {
  useClass: AuthRepository,
});

// Export configured container
export { container };
