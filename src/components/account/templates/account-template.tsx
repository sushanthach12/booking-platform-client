// src/components/account/templates/account-template.tsx
// Async Server Component — resolves data, passes serialisable props to AccountView

import { AccountView } from '@/components/account/account-view';
import { GuestBookingsSummary, GuestProfile } from '@/domain/interfaces';

// ---------------------------------------------------------------------------
// Mock data (swap for real use-case calls when the API is wired)
// ---------------------------------------------------------------------------
const MOCK_PROFILE: GuestProfile = {
  id: 'usr_01',
  firstName: 'Alex',
  lastName: 'Morgan',
  email: 'alex.morgan@example.com',
  phone: '+1 (555) 012-3456',
  avatarUrl: null,
  memberSince: '2022-03-15',
  bio: 'Passionate traveller. Always chasing the next horizon.',
  location: 'San Francisco, CA',
  isVerified: true,
};

const MOCK_BOOKINGS_SUMMARY: GuestBookingsSummary = {
  upcoming: [
    {
      id: 'bk_01',
      propertyName: 'Oia Cliffside Villa',
      location: 'Santorini, Greece',
      checkIn: '2025-08-10',
      checkOut: '2025-08-17',
      guests: 2,
      totalAmount: 2240,
      currency: 'USD',
      status: 'confirmed',
      coverImage:
        'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'bk_02',
      propertyName: 'Jungle Retreat',
      location: 'Ubud, Bali',
      checkIn: '2025-10-03',
      checkOut: '2025-10-10',
      guests: 2,
      totalAmount: 1260,
      currency: 'USD',
      status: 'pending',
      coverImage:
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    },
  ],
  past: [
    {
      id: 'bk_03',
      propertyName: 'Alpine Lodge',
      location: 'Chamonix, France',
      checkIn: '2024-12-22',
      checkOut: '2024-12-29',
      guests: 4,
      totalAmount: 665,
      currency: 'USD',
      status: 'completed',
      coverImage:
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
      reviewLeft: false,
    },
    {
      id: 'bk_04',
      propertyName: 'Coastal Cottage',
      location: 'Amalfi, Italy',
      checkIn: '2024-07-01',
      checkOut: '2024-07-08',
      guests: 2,
      totalAmount: 1470,
      currency: 'USD',
      status: 'completed',
      coverImage:
        'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80',
      reviewLeft: true,
    },
  ],
  stats: {
    totalTrips: 6,
    countriesVisited: 4,
    nightsStayed: 38,
    totalSpent: 7420,
  },
};

export async function AccountTemplate() {
  // When AuthUseCase has a getCurrentUser method, call it here:
  // const authUseCase = getAuthUseCase();
  // const profile = await authUseCase.getCurrentUser() ?? MOCK_PROFILE;

  return (
    <AccountView
      profile={MOCK_PROFILE}
      bookingsSummary={MOCK_BOOKINGS_SUMMARY}
    />
  );
}
