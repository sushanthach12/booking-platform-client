import { PropertyUseCase } from '../use-cases/property.use-case';
import { AuthUseCase } from '../use-cases/auth.use-case';
import { container } from './container';

export const getPropertyUseCase = () => container.resolve(PropertyUseCase);
export const getAuthUseCase = () => container.resolve(AuthUseCase);
