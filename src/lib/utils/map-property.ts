import type { PropertyEntity } from '@/domain/entities';

/**
 * Map property entity to view model for detail page.
 * Used in PropertyDetailsTemplate; children receive this shape via props.
 */
export interface PropertyDetailViewState {
  id: string;
  title: string;
  location: string;
  rating: number;
  reviewCount: number | null;
  type: string;
  priceLabel: string;
  imageUrl: string;
  images: string[];
  hostName: string;
  hostImage: string | undefined;
  isSuperhost: boolean;
  bedrooms: number | undefined;
  beds: number | undefined;
  bathrooms: number | undefined;
  description: string | null;
  amenities: string[] | undefined;
  pricing: {
    amount: number;
    currency: string;
    frequency: string;
  };
}

export function mapPropertyToDetailView(
  property: PropertyEntity,
): PropertyDetailViewState {
  const location = [
    property.location.city,
    property.location.state,
    property.location.country,
  ]
    .filter(Boolean)
    .join(', ');
  const priceLabel = `$${property.pricing.amount} ${property.pricing.currency} / ${property.pricing.frequency}`;

  return {
    id: property.id,
    title: property.title,
    location,
    rating: property.stats?.rating ?? 0,
    reviewCount: property.stats?.reviewCount ?? null,
    type: property.type ?? 'Entire place',
    priceLabel,
    imageUrl: property.images[0] ?? '/next.svg',
    images: property.images,
    hostName: property.host?.name ?? 'Host',
    hostImage: property.host?.image,
    isSuperhost: property.host?.isSuperhost ?? false,
    bedrooms: property.bedrooms,
    beds: property.beds,
    bathrooms: property.bathrooms,
    description: property.description ?? null,
    amenities: property.amenities,
    pricing: property.pricing,
  };
}
