import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../di/types';
import { IProperty } from '../entities';
import type { IPropertyRepository } from '../interfaces';

@injectable()
export class PropertyUseCase {
  constructor(
    @inject(TOKENS.IPropertyRepository)
    private readonly propertyRepository: IPropertyRepository,
  ) {}

  async getProperties(): Promise<IProperty[]> {
    return this.propertyRepository.getProperties();
  }

  async getPropertyById(id: string): Promise<IProperty | null> {
    return this.propertyRepository.getPropertyById(id);
  }
}
