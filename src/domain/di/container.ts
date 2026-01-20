import 'reflect-metadata';
import { container } from 'tsyringe';
import type { IPropertyRepository } from '../interfaces';
import { PropertyRepository } from '../repositories/property.repository';
import { TOKENS } from './types';

// Register all dependencies
container.register<IPropertyRepository>(TOKENS.IPropertyRepository, {
  useClass: PropertyRepository,
});

// Export configured container
export { container };
