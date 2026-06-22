import type {
  HomeData,
  PropertyEntity,
  PropertySearchParams,
} from "@/domain/entities";

export interface IPropertyRepository {
  getProperties(): Promise<PropertyEntity[]>;
  getPropertyById(id: string): Promise<PropertyEntity | null>;
  /** Backend: GET /api/v1/properties/search */
  searchProperties(params?: PropertySearchParams): Promise<PropertyEntity[]>;
  /**
   * Backend: GET /api/v1/home — featured + nearby + destination tiles.
   * `forwardedHeaders` lets SSR callers propagate the visitor's Cloudflare/proxy
   * headers (real client IP, geo) onto this server-side request.
   */
  getHomeData(
    location?: string,
    forwardedHeaders?: Record<string, string>,
  ): Promise<HomeData>;
}
