import type {
  PropertyEntity,
  PropertySearchParams,
} from "../../domain/entities";

export interface IPropertyRepository {
  getProperties(): Promise<PropertyEntity[]>;
  getPropertyById(id: string): Promise<PropertyEntity | null>;
  /** Backend: GET /api/v1/properties/search */
  searchProperties(params?: PropertySearchParams): Promise<PropertyEntity[]>;
}
