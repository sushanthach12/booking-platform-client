import 'reflect-metadata';
import { injectable } from 'tsyringe';
import type { PropertyEntity, PropertySearchParams } from '../entities';
import type { IPropertyRepository } from '../interfaces';

export const MOCK_PROPERTIES: PropertyEntity[] = [
  {
    id: '1',
    name: 'Property 1',
    title: 'Whitefish Estate',
    type: 'Entire rental unit',
    description: 'Luxurious mountain estate with stunning views of the Rocky Mountains. Perfect for families and groups looking for a premium getaway experience.',
    location: {
      city: 'Whitefish',
      state: 'Montana',
      country: 'United States',
      coordinates: { lat: 48.4, lng: -114.3 },
    },
    host: { name: 'Sarah', image: '/avatar1.jpg', isSuperhost: true },
    stats: { rating: 5.0, reviewCount: 42 },
    amenities: ['4 beds', 'Wi-Fi', 'Kitchen', 'Pool', 'Hot tub', 'Fireplace'],
    pricing: { amount: 10000, currency: 'USD', frequency: 'night' },
    images: ['/images/Screenshot 2026-02-01 121156.png', '/images/Screenshot 2026-02-01 121241.png', '/images/Screenshot 2026-02-01 121300.png', '/images/Screenshot 2026-02-01 121314.png'],
    bedrooms: 4,
    beds: 4,
    bathrooms: 3,
  },
  {
    id: '2',
    name: 'Property 2',
    title: 'Luxury stay in Weston, Saint James, Barbados',
    type: 'Entire apartment',
    description: 'Beachfront paradise with direct ocean access. Modern amenities and tropical luxury combined.',
    location: { city: 'Weston', state: 'Saint James', country: 'Barbados' },
    host: { name: 'Caitlyn', image: '/avatar2.jpg', isSuperhost: false },
    stats: { rating: 4.9, reviewCount: 82 },
    amenities: ['2 beds', 'Wi-Fi', 'Pool', 'Beach access', 'Kitchen'],
    pricing: { amount: 1500, currency: 'USD', frequency: 'night' },
    images: ['/images/Screenshot 2026-02-01 121324.png', '/images/Screenshot 2026-02-01 121331.png', '/images/Screenshot 2026-02-01 121341.png'],
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
  },
  {
    id: '3',
    name: 'Property 3',
    title: 'Just a 5-Minute Walk from the University of Melbourne',
    type: 'Entire rental unit',
    description: 'Modern apartment perfect for students and academics. Close to campus and city amenities.',
    location: {
      city: 'Carlton',
      state: 'VIC',
      country: 'Australia',
      coordinates: { lat: -37.8, lng: 144.96 },
    },
    host: { name: 'Michael', image: '/avatar3.jpg', isSuperhost: true },
    stats: { rating: 4.7, reviewCount: 82 },
    amenities: ['1 bed', 'Wi-Fi', 'Kitchen', 'Study desk'],
    pricing: { amount: 490, currency: 'AUD', frequency: 'night' },
    images: ['/images/Screenshot 2026-02-01 121351.png', '/images/Screenshot 2026-02-01 121545.png', '/images/Screenshot 2026-02-01 121156.png'],
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
  },
  {
    id: '4',
    name: 'Property 4',
    title: 'Cozy Treehouse in the Redwoods',
    type: 'Unique stay',
    description: 'Experience nature in this beautifully crafted treehouse surrounded by ancient redwoods.',
    location: {
      city: 'Guernville',
      state: 'California',
      country: 'United States',
      coordinates: { lat: 38.5, lng: -123.0 },
    },
    host: { name: 'Emma', image: '/avatar4.jpg', isSuperhost: true },
    stats: { rating: 4.8, reviewCount: 156 },
    amenities: ['1 bed', 'Kitchen', 'Deck', 'Fire pit'],
    pricing: { amount: 280, currency: 'USD', frequency: 'night' },
    images: ['/property4-1.jpg', '/property4-2.jpg', '/property4-3.jpg'],
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
  },
  {
    id: '5',
    name: 'Property 5',
    title: 'Historic Castle in Scotland',
    type: 'Historic property',
    description: 'Stay in a real Scottish castle with modern amenities and rich history.',
    location: {
      city: 'Inverness',
      state: 'Highlands',
      country: 'Scotland',
      coordinates: { lat: 57.5, lng: -4.2 },
    },
    host: { name: 'Lord William', image: '/avatar5.jpg', isSuperhost: false },
    stats: { rating: 4.6, reviewCount: 93 },
    amenities: ['6 beds', 'Library', 'Dining hall', 'Garden', 'Wi-Fi'],
    pricing: { amount: 2200, currency: 'GBP', frequency: 'night' },
    images: ['/property5-1.jpg', '/property5-2.jpg', '/property5-3.jpg'],
    bedrooms: 6,
    beds: 8,
    bathrooms: 4,
  },
  {
    id: '6',
    name: 'Property 6',
    title: 'Beach Villa in Bali',
    type: 'Entire villa',
    description: 'Private villa with infinity pool and ocean views. Perfect for romantic getaways.',
    location: {
      city: 'Seminyak',
      state: 'Bali',
      country: 'Indonesia',
      coordinates: { lat: -8.7, lng: 115.2 },
    },
    host: { name: 'Made', image: '/avatar6.jpg', isSuperhost: true },
    stats: { rating: 4.9, reviewCount: 201 },
    amenities: ['2 beds', 'Private pool', 'Beach access', 'Kitchen', 'Staff'],
    pricing: { amount: 450, currency: 'USD', frequency: 'night' },
    images: ['/property6-1.jpg', '/property6-2.jpg', '/property6-3.jpg'],
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
  },
  {
    id: '7',
    name: 'Property 7',
    title: 'Modern Loft in Tokyo',
    type: 'Apartment',
    description: 'Minimalist Japanese design with modern conveniences in the heart of Shibuya.',
    location: {
      city: 'Tokyo',
      state: 'Tokyo',
      country: 'Japan',
      coordinates: { lat: 35.7, lng: 139.7 },
    },
    host: { name: 'Yuki', image: '/avatar7.jpg', isSuperhost: true },
    stats: { rating: 4.8, reviewCount: 127 },
    amenities: ['Studio', 'Wi-Fi', 'Kitchenette', 'City view'],
    pricing: { amount: 180, currency: 'USD', frequency: 'night' },
    images: ['/property7-1.jpg', '/property7-2.jpg'],
    bedrooms: 0,
    beds: 1,
    bathrooms: 1,
  },
  {
    id: '8',
    name: 'Property 8',
    title: 'Ski Chalet in the Alps',
    type: 'Entire chalet',
    description: 'Luxury ski-in/ski-out chalet with mountain views and spa facilities.',
    location: {
      city: 'Chamonix',
      state: 'Auvergne-Rhône-Alpes',
      country: 'France',
      coordinates: { lat: 45.9, lng: 6.9 },
    },
    host: { name: 'Pierre', image: '/avatar8.jpg', isSuperhost: false },
    stats: { rating: 4.7, reviewCount: 68 },
    amenities: ['4 beds', 'Sauna', 'Hot tub', 'Fireplace', 'Ski storage'],
    pricing: { amount: 890, currency: 'EUR', frequency: 'night' },
    images: ['/property8-1.jpg', '/property8-2.jpg', '/property8-3.jpg'],
    bedrooms: 4,
    beds: 6,
    bathrooms: 3,
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
