import 'reflect-metadata';
import { container } from 'tsyringe';
import type { IPropertyRepository } from '../../data/interfaces';
import type { IAuthRepository } from '../../data/interfaces/auth.interface';
import type { IUploadRepository } from '../../data/interfaces/upload.repository.interface';
import { AuthRepository } from '../../data/repositories/auth.repository';
import { PropertyRepository } from '../../data/repositories/property.repository';
import { UploadRepository } from '../../data/repositories/upload.repository';
import { UploadUseCase } from '../use-cases/upload.use-case';
import { TOKENS } from './types';

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
