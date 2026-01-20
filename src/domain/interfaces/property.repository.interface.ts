import { IProperty } from '../entities';

export interface IPropertyRepository {
  getProperties(): Promise<IProperty[]>;
  getPropertyById(id: string): Promise<IProperty | null>;
}
