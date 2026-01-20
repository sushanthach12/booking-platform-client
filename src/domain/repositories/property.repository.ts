import { injectable } from 'tsyringe';
import { IProperty } from '../entities';
import { IPropertyRepository } from '../interfaces';

@injectable()
export class PropertyRepository implements IPropertyRepository {
  async getProperties(): Promise<IProperty[]> {
    // Your API call here
    // const response = await fetch('/api/properties');
    // return response.json();

    return [
      {
        id: '1',
        name: 'Property 1',
      },
    ];
  }

  async getPropertyById(id: string): Promise<IProperty | null> {
    const response = await fetch(`/api/properties/${id}`);
    if (!response.ok) return null;
    return response.json();
  }
}
