import { injectable } from 'tsyringe';
import type { PropertyEntity, PropertySearchParams } from '../entities';
import type { IPropertyRepository } from '../interfaces';

const MOCK_PROPERTIES: PropertyEntity[] = [
  {
    id: '1',
    name: 'Property 1',
    title: 'Whitefish Estate',
    type: 'Entire rental unit',
    location: {
      city: 'Whitefish',
      state: 'Montana',
      country: 'United States',
      coordinates: { lat: 48.4, lng: -114.3 },
    },
    host: { name: 'Host', image: '/avatar.jpg', isSuperhost: true },
    stats: { rating: 5.0, reviewCount: 42 },
    amenities: ['1 bed', 'Wi-Fi', 'Kitchen'],
    pricing: { amount: 10000, currency: 'USD', frequency: 'night' },
    images: [''],
  },
  {
    id: '2',
    name: 'Property 2',
    title: 'Luxury stay in Weston, Saint James, Barbados',
    type: 'Entire apartment',
    location: { city: 'Weston', state: 'Saint James', country: 'Barbados' },
    host: { name: 'Caitlyn', image: '/avatar.jpg', isSuperhost: false },
    stats: { rating: 5.0, reviewCount: 82 },
    amenities: ['2 beds', 'Wi-Fi', 'Pool'],
    pricing: { amount: 1500, currency: 'USD', frequency: 'night' },
    images: ['/next.svg'],
  },
  {
    id: '3',
    name: 'Property 3',
    title: 'Just a 5-Minute Walk from the University of Melbourne',
    type: 'Entire rental unit',
    location: {
      city: 'Carlton',
      state: 'VIC',
      country: 'Australia',
      coordinates: { lat: -37.8, lng: 144.96 },
    },
    host: { name: 'Caitlyn', image: '/avatar.jpg', isSuperhost: true },
    stats: { rating: 4.7, reviewCount: 82 },
    amenities: ['1 bed', 'Wi-Fi', 'Kitchen'],
    pricing: { amount: 490, currency: 'AUD', frequency: 'night' },
    images: ['/next.svg'],
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
  },

  {
    id: '3',
    name: 'Property 3',
    title: 'Just a 5-Minute Walk from the University of Melbourne',
    type: 'Entire rental unit',
    location: {
      city: 'Carlton',
      state: 'VIC',
      country: 'Australia',
      coordinates: { lat: -37.8, lng: 144.96 },
    },
    host: { name: 'Caitlyn', image: '/avatar.jpg', isSuperhost: true },
    stats: { rating: 4.7, reviewCount: 82 },
    amenities: ['1 bed', 'Wi-Fi', 'Kitchen'],
    pricing: { amount: 490, currency: 'AUD', frequency: 'night' },
    images: ['/next.svg'],
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
  },
  {
    id: '3',
    name: 'Property 3',
    title: 'Just a 5-Minute Walk from the University of Melbourne',
    type: 'Entire rental unit',
    location: {
      city: 'Carlton',
      state: 'VIC',
      country: 'Australia',
      coordinates: { lat: -37.8, lng: 144.96 },
    },
    host: { name: 'Caitlyn', image: '/avatar.jpg', isSuperhost: true },
    stats: { rating: 4.7, reviewCount: 82 },
    amenities: ['1 bed', 'Wi-Fi', 'Kitchen'],
    pricing: { amount: 490, currency: 'AUD', frequency: 'night' },
    images: ['/next.svg'],
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
  },
  {
    id: '3',
    name: 'Property 3',
    title: 'Just a 5-Minute Walk from the University of Melbourne',
    type: 'Entire rental unit',
    location: {
      city: 'Carlton',
      state: 'VIC',
      country: 'Australia',
      coordinates: { lat: -37.8, lng: 144.96 },
    },
    host: { name: 'Caitlyn', image: '/avatar.jpg', isSuperhost: true },
    stats: { rating: 4.7, reviewCount: 82 },
    amenities: ['1 bed', 'Wi-Fi', 'Kitchen'],
    pricing: { amount: 490, currency: 'AUD', frequency: 'night' },
    images: ['/next.svg'],
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
  },
  {
    id: '3',
    name: 'Property 3',
    title: 'Just a 5-Minute Walk from the University of Melbourne',
    type: 'Entire rental unit',
    location: {
      city: 'Carlton',
      state: 'VIC',
      country: 'Australia',
      coordinates: { lat: -37.8, lng: 144.96 },
    },
    host: { name: 'Caitlyn', image: '/avatar.jpg', isSuperhost: true },
    stats: { rating: 4.7, reviewCount: 82 },
    amenities: ['1 bed', 'Wi-Fi', 'Kitchen'],
    pricing: { amount: 490, currency: 'AUD', frequency: 'night' },
    images: ['/next.svg'],
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
  },
  {
    id: '3',
    name: 'Property 3',
    title: 'Just a 5-Minute Walk from the University of Melbourne',
    type: 'Entire rental unit',
    location: {
      city: 'Carlton',
      state: 'VIC',
      country: 'Australia',
      coordinates: { lat: -37.8, lng: 144.96 },
    },
    host: { name: 'Caitlyn', image: '/avatar.jpg', isSuperhost: true },
    stats: { rating: 4.7, reviewCount: 82 },
    amenities: ['1 bed', 'Wi-Fi', 'Kitchen'],
    pricing: { amount: 490, currency: 'AUD', frequency: 'night' },
    images: ['/next.svg'],
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
  },
  {
    id: '3',
    name: 'Property 3',
    title: 'Just a 5-Minute Walk from the University of Melbourne',
    type: 'Entire rental unit',
    location: {
      city: 'Carlton',
      state: 'VIC',
      country: 'Australia',
      coordinates: { lat: -37.8, lng: 144.96 },
    },
    host: { name: 'Caitlyn', image: '/avatar.jpg', isSuperhost: true },
    stats: { rating: 4.7, reviewCount: 82 },
    amenities: ['1 bed', 'Wi-Fi', 'Kitchen'],
    pricing: { amount: 490, currency: 'AUD', frequency: 'night' },
    images: ['/next.svg'],
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
  },
  {
    id: '3',
    name: 'Property 3',
    title: 'Just a 5-Minute Walk from the University of Melbourne',
    type: 'Entire rental unit',
    location: {
      city: 'Carlton',
      state: 'VIC',
      country: 'Australia',
      coordinates: { lat: -37.8, lng: 144.96 },
    },
    host: { name: 'Caitlyn', image: '/avatar.jpg', isSuperhost: true },
    stats: { rating: 4.7, reviewCount: 82 },
    amenities: ['1 bed', 'Wi-Fi', 'Kitchen'],
    pricing: { amount: 490, currency: 'AUD', frequency: 'night' },
    images: ['/next.svg'],
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
  },
  {
    id: '3',
    name: 'Property 3',
    title: 'Just a 5-Minute Walk from the University of Melbourne',
    type: 'Entire rental unit',
    location: {
      city: 'Carlton',
      state: 'VIC',
      country: 'Australia',
      coordinates: { lat: -37.8, lng: 144.96 },
    },
    host: { name: 'Caitlyn', image: '/avatar.jpg', isSuperhost: true },
    stats: { rating: 4.7, reviewCount: 82 },
    amenities: ['1 bed', 'Wi-Fi', 'Kitchen'],
    pricing: { amount: 490, currency: 'AUD', frequency: 'night' },
    images: ['/next.svg'],
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
  },
  {
    id: '3',
    name: 'Property 3',
    title: 'Just a 5-Minute Walk from the University of Melbourne',
    type: 'Entire rental unit',
    location: {
      city: 'Carlton',
      state: 'VIC',
      country: 'Australia',
      coordinates: { lat: -37.8, lng: 144.96 },
    },
    host: { name: 'Caitlyn', image: '/avatar.jpg', isSuperhost: true },
    stats: { rating: 4.7, reviewCount: 82 },
    amenities: ['1 bed', 'Wi-Fi', 'Kitchen'],
    pricing: { amount: 490, currency: 'AUD', frequency: 'night' },
    images: ['/next.svg'],
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
  },
  {
    id: '3',
    name: 'Property 3',
    title: 'Just a 5-Minute Walk from the University of Melbourne',
    type: 'Entire rental unit',
    location: {
      city: 'Carlton',
      state: 'VIC',
      country: 'Australia',
      coordinates: { lat: -37.8, lng: 144.96 },
    },
    host: { name: 'Caitlyn', image: '/avatar.jpg', isSuperhost: true },
    stats: { rating: 4.7, reviewCount: 82 },
    amenities: ['1 bed', 'Wi-Fi', 'Kitchen'],
    pricing: { amount: 490, currency: 'AUD', frequency: 'night' },
    images: ['/next.svg'],
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
  },
];

@injectable()
export class PropertyRepository implements IPropertyRepository {
  async getProperties(): Promise<PropertyEntity[]> {
    return [...MOCK_PROPERTIES];
  }

  async getPropertyById(id: string): Promise<PropertyEntity | null> {
    return MOCK_PROPERTIES.find((p) => p.id === id) ?? null;
  }

  async searchProperties(
    params?: PropertySearchParams,
  ): Promise<PropertyEntity[]> {
    if (!params) return this.getProperties();
    let list = [...MOCK_PROPERTIES];
    if (params.price_min != null)
      list = list.filter((p) => p.pricing.amount >= params.price_min!);
    if (params.price_max != null)
      list = list.filter((p) => p.pricing.amount <= params.price_max!);
    if (params.guests != null)
      list = list.filter((p) => (p.beds ?? 1) >= params.guests!);
    return list;
  }
}
