import { PropertyUseCase } from '../use-cases/property.use-case';
import { container } from './container';

export const getPropertyUseCase = () => container.resolve(PropertyUseCase);
