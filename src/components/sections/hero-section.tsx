'use client';

import { CustomDatePicker } from '@/components/shared/custom-date-picker';
import { GuestSelector } from '@/components/shared/guest-selector';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  selectSearchFilters,
  setDates,
  setGuests,
  setLocation,
} from '@/store/slices/search-slice';
import { MapPin, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const QUICK_FILTERS = [
  { label: '🏖️ Beach', value: 'beach' },
  { label: '🏔️ Mountains', value: 'mountains' },
  { label: '🌆 City', value: 'city' },
  { label: '🏡 Countryside', value: 'countryside' },
  { label: '🏝️ Islands', value: 'islands' },
  { label: '🎿 Ski', value: 'ski' },
] as const;

export function HeroSection() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const filters = useAppSelector(selectSearchFilters);

  const [checkInDate, setCheckInDate] = useState<Date | undefined>(
    filters.checkIn ?? undefined,
  );
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(
    filters.checkOut ?? undefined,
  );

  const handleCheckInChange = (date: Date | undefined) => {
    setCheckInDate(date);
    dispatch(
      setDates({ checkIn: date ?? null, checkOut: checkOutDate ?? null }),
    );
  };

  const handleCheckOutChange = (date: Date | undefined) => {
    setCheckOutDate(date);
    dispatch(
      setDates({ checkIn: checkInDate ?? null, checkOut: date ?? null }),
    );
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.location && filters.location !== 'Anywhere')
      params.set('location', filters.location);
    if (filters.checkIn)
      params.set('checkIn', filters.checkIn.toISOString().split('T')[0]);
    if (filters.checkOut)
      params.set('checkOut', filters.checkOut.toISOString().split('T')[0]);
    const totalGuests =
      filters.guests.adults + filters.guests.children + filters.guests.infants;
    if (totalGuests > 1) params.set('guests', totalGuests.toString());
    router.push(params.size ? `/search?${params}` : '/search');
  };

  const handleQuickFilter = (value: string) => {
    router.push(`/search?category=${encodeURIComponent(value)}`);
  };

  return (
    <section className='relative bg-slate-950 pt-16 overflow-hidden'>
      {/* Subtle radial glow */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 opacity-40'
        style={{
          backgroundImage:
            'radial-gradient(ellipse 80% 60% at 50% -10%, #be123c22 0%, transparent 70%)',
        }}
      />

      <div className='relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-0'>
        {/* Headline */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-3'>
            Where do you want to{' '}
            <span className='text-transparent bg-clip-text bg-linear-to-r from-rose-400 to-orange-400'>
              stay?
            </span>
          </h1>
          <p className='text-slate-400 text-base sm:text-lg'>
            Search 150,000+ homes, villas, and boutique hotels worldwide.
          </p>
        </div>

        {/* Search card */}
        <div className='w-full bg-white rounded-2xl shadow-2xl shadow-black/40 p-1.5'>
          <div className='flex flex-col md:flex-row items-stretch gap-0.5'>
            {/* Location — uses shadcn Input */}
            <div className='flex-2 min-w-0 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors'>
              <MapPin className='size-4 text-rose-500 shrink-0' />
              <div className='min-w-0 flex-1'>
                <p className='text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5'>
                  Where
                </p>
                {/* Input from shadcn/ui — styled to strip its default border/shadow for inline use */}
                <Input
                  value={filters.location ?? ''}
                  onChange={(e) => dispatch(setLocation(e.target.value))}
                  placeholder='City, region, or property name'
                  className='h-auto p-0 border-0 shadow-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm font-semibold text-slate-900 placeholder:text-slate-400 bg-transparent'
                  suppressHydrationWarning
                />
              </div>
            </div>

            <div className='hidden md:block w-px self-stretch bg-slate-100 my-2' />

            {/* Check-in */}
            <div className='flex-1 min-w-0 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors'>
              <p className='text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5'>
                Check in
              </p>
              <CustomDatePicker
                value={checkInDate}
                onChange={handleCheckInChange}
                placeholder='Add date'
                className='text-sm font-semibold text-slate-900'
              />
            </div>

            <div className='hidden md:block w-px self-stretch bg-slate-100 my-2' />

            {/* Check-out */}
            <div className='flex-1 min-w-0 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors'>
              <p className='text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5'>
                Check out
              </p>
              <CustomDatePicker
                value={checkOutDate}
                onChange={handleCheckOutChange}
                placeholder='Add date'
                className='text-sm font-semibold text-slate-900'
              />
            </div>

            <div className='hidden md:block w-px self-stretch bg-slate-100 my-2' />

            {/* Guests */}
            <div className='flex-1 min-w-0 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors'>
              <p className='text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5'>
                Guests
              </p>
              <GuestSelector
                value={filters.guests}
                onChange={(guests) => dispatch(setGuests(guests))}
                maxGuests={16}
                className='border-0 shadow-none p-0 h-auto text-sm font-semibold text-slate-900 hover:bg-transparent justify-start w-full'
                showUserIcon={false}
              />
            </div>

            {/* Search — shadcn Button */}
            <div className='flex items-center p-1'>
              <Button
                onClick={handleSearch}
                size='lg'
                className='w-full md:w-auto rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold px-6 gap-2 shadow-lg shadow-rose-500/30 transition-all duration-200 active:scale-95'
              >
                <Search className='size-4' />
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Quick category filters — shadcn Badge as buttons */}
        <div className='flex flex-wrap items-center justify-center gap-2 mt-5 pb-0'>
          {QUICK_FILTERS.map((f) => (
            <Badge
              key={f.value}
              variant='outline'
              onClick={() => handleQuickFilter(f.value)}
              className='cursor-pointer text-slate-300 border-white/10 bg-white/5 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-150 px-3.5 py-1.5 text-xs font-medium'
            >
              {f.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Wave into white content */}
      <div className='relative mt-8 h-10 overflow-hidden'>
        <svg
          viewBox='0 0 1440 40'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='absolute bottom-0 w-full'
          preserveAspectRatio='none'
          aria-hidden
        >
          <path
            d='M0 40L60 34C120 28 240 16 360 13.3C480 10.7 600 17.3 720 20C840 22.7 960 21.3 1080 18.7C1200 16 1320 12 1380 10.7L1440 9.3V40H0Z'
            fill='white'
          />
        </svg>
      </div>
    </section>
  );
}
