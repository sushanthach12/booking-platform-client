'use client';

import { PropertyListingCard } from '@/components/property/property-listing-card';
import type { PropertyEntity } from '@/domain/entities';
import { SearchX } from 'lucide-react';
import { SearchListingSkeleton } from './search-listing-skeleton';

interface SearchListingProps {
  properties: PropertyEntity[];
  /** Optional query string (e.g. checkIn & checkOut) for property links */
  queryString?: string;
  isLoading?: boolean;
  error?: string | null;
}

export function SearchListing({
  properties,
  queryString,
  isLoading,
  error,
}: SearchListingProps) {
  if (isLoading) {
    return <SearchListingSkeleton />;
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center h-full min-h-64 gap-3 text-muted-foreground px-6 text-center'>
        <SearchX className='size-10 opacity-40' />
        <p className='font-semibold text-foreground'>Something went wrong</p>
        <p className='text-sm'>{error}</p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center h-full min-h-64 gap-3 text-muted-foreground px-6 text-center'>
        <SearchX className='size-10 opacity-40' />
        <p className='font-semibold text-foreground'>No properties found</p>
        <p className='text-sm'>
          Try adjusting your dates, location, or filters.
        </p>
      </div>
    );
  }

  return (
    <div
      className='p-4 sm:p-6 grid grid-cols-1 gap-6 lg:gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
      role='list'
    >
      {properties.map((property) => (
        <div key={property.id} role='listitem'>
          <PropertyListingCard property={property} queryString={queryString} />
        </div>
      ))}
    </div>
  );
}
