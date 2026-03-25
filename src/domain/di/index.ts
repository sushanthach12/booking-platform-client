import { UploadRepository } from '../../data/repositories/upload.repository';
import { AuthUseCase } from '../use-cases/auth.use-case';
import { PropertyUseCase } from '../use-cases/property.use-case';
import { container } from './container';

export const getPropertyUseCase = () => container.resolve(PropertyUseCase);
export const getAuthUseCase = () => container.resolve(AuthUseCase);
export const getUploadRepository = () => container.resolve(UploadRepository);
