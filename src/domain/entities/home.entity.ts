/**
 * Homepage read model — mirrors the backend `GET /api/v1/home` response.
 * Backend: src/home/interfaces/home.interface.ts
 */
import type { PropertyEntity } from "./property.entity";

/** A city tile derived from active listings. */
export interface HomeDestination {
  city: string;
  state?: string;
  country?: string;
  /** Number of active listings in this city. */
  propertyCount: number;
  /** Cheapest base price across the city's listings (null if none priced). */
  fromPrice: number | null;
  currency: string | null;
  coverImage: string | null;
}

/** Everything the homepage renders, in one payload. */
export interface HomeData {
  /** Top-rated listings. */
  featured: PropertyEntity[];
  /** Most recent listings (optionally biased by location). */
  nearby: PropertyEntity[];
  /** City tiles for the destinations bento. */
  destinations: HomeDestination[];
}
