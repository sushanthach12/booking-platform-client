import { PropertyEntity } from '../entities';

export interface IPropertyRepository {
  getProperties(): Promise<PropertyEntity[]>;
  getPropertyById(id: string): Promise<PropertyEntity | null>;
}
