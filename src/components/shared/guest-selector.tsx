'use client';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ChevronDownIcon, Minus, Plus, Users } from 'lucide-react';
import * as React from 'react';

interface GuestCount {
  adults: number;
  children: number;
  infants: number;
}

interface GuestSelectorProps {
  value?: GuestCount;
  onChange?: (guestCount: GuestCount) => void;
  maxGuests?: number;
  className?: string;
  showUserIcon?: boolean;
  /** "block" = single row with GUESTS label + value + chevron, for combined date+guest block */
  variant?: 'default' | 'block';
}

export function GuestSelector({
  value = { adults: 1, children: 0, infants: 0 },
  onChange,
  maxGuests = 16,
  className,
  showUserIcon = true,
  variant = 'default',
}: GuestSelectorProps) {
  const [guestCount, setGuestCount] = React.useState<GuestCount>(value);

  const updateGuestCount = (type: keyof GuestCount, delta: number) => {
    const newCount = { ...guestCount };
    newCount[type] = Math.max(0, Math.min(maxGuests, guestCount[type] + delta));

    // Ensure at least one adult
    if (type === 'adults' && newCount.adults === 0) {
      newCount.adults = 1;
      return;
    }

    // Check total guests limit
    const totalGuests = newCount.adults + newCount.children;
    if (totalGuests > maxGuests) {
      return;
    }

    setGuestCount(newCount);
    onChange?.(newCount);
  };

  const totalGuests = guestCount.adults + guestCount.children;
  let displayText = totalGuests === 1 ? '1 guest' : `${totalGuests} guests`;
  if (guestCount.infants > 0) {
    displayText += `, ${guestCount.infants} infant${
      guestCount.infants > 1 ? 's' : ''
    }`;
  }

  const triggerContent =
    variant === 'block' ? (
      <>
        <div className='flex flex-1 flex-col items-start text-left'>
          <span className='text-xs font-medium uppercase tracking-wide text-muted-foreground lg:text-sm'>
            GUESTS
          </span>
          <span className='text-sm mt-0.5 lg:text-base'>{displayText}</span>
        </div>
        <ChevronDownIcon className='size-4 shrink-0 text-muted-foreground lg:size-5' />
      </>
    ) : (
      <>
        <div className='flex items-center gap-2'>
          {showUserIcon && <Users className='size-4' />}
          <span>{displayText}</span>
        </div>
        <div className='w-4' />
      </>
    );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={variant === 'block' ? 'ghost' : 'outline'}
          className={cn(
            'w-full justify-between text-left font-normal',
            variant === 'block' &&
              'h-auto py-3 px-4 rounded-none border-0 rounded-b-lg hover:bg-muted/50',
            className,
          )}
        >
          {triggerContent}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-80' align='start'>
        <div className='space-y-4'>
          {/* Adults */}
          <div className='flex items-center justify-between'>
            <div>
              <div className='font-medium'>Adults</div>
              <div className='text-sm text-muted-foreground'>
                Ages 13 or above
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='icon'
                className='size-8'
                onClick={() => updateGuestCount('adults', -1)}
                disabled={guestCount.adults <= 1}
              >
                <Minus className='size-3' />
              </Button>
              <span className='w-8 text-center'>{guestCount.adults}</span>
              <Button
                variant='outline'
                size='icon'
                className='size-8'
                onClick={() => updateGuestCount('adults', 1)}
                disabled={totalGuests >= maxGuests}
              >
                <Plus className='size-3' />
              </Button>
            </div>
          </div>

          {/* Children */}
          <div className='flex items-center justify-between'>
            <div>
              <div className='font-medium'>Children</div>
              <div className='text-sm text-muted-foreground'>Ages 2-12</div>
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='icon'
                className='size-8'
                onClick={() => updateGuestCount('children', -1)}
                disabled={guestCount.children <= 0}
              >
                <Minus className='size-3' />
              </Button>
              <span className='w-8 text-center'>{guestCount.children}</span>
              <Button
                variant='outline'
                size='icon'
                className='size-8'
                onClick={() => updateGuestCount('children', 1)}
                disabled={totalGuests >= maxGuests}
              >
                <Plus className='size-3' />
              </Button>
            </div>
          </div>

          {/* Infants */}
          <div className='flex items-center justify-between'>
            <div>
              <div className='font-medium'>Infants</div>
              <div className='text-sm text-muted-foreground'>Under 2</div>
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='icon'
                className='size-8'
                onClick={() => updateGuestCount('infants', -1)}
                disabled={guestCount.infants <= 0}
              >
                <Minus className='size-3' />
              </Button>
              <span className='w-8 text-center'>{guestCount.infants}</span>
              <Button
                variant='outline'
                size='icon'
                className='size-8'
                onClick={() => updateGuestCount('infants', 1)}
                disabled={guestCount.infants >= 5}
              >
                <Plus className='size-3' />
              </Button>
            </div>
          </div>

          <div className='pt-2 border-t text-xs text-muted-foreground'>
            {maxGuests} guests maximum. Infants don&apos;t count toward the
            number of guests.
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
