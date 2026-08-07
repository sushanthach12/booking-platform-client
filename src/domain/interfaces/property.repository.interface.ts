import type {
  HomeData,
  PropertyEntity,
  PropertySearchParams,
  PropertySearchResult,
} from "@/domain/entities";

export interface IPropertyRepository {
  getProperties(): Promise<PropertyEntity[]>;
  getPropertyById(id: string): Promise<PropertyEntity | null>;
  /** Backend: GET /api/v1/properties/search */
  searchProperties(
    params?: PropertySearchParams,
  ): Promise<PropertySearchResult>;
  /** Backend: GET /api/v1/home — featured + nearby + destination tiles. */
  getHomeData(location?: string): Promise<HomeData>;
}
