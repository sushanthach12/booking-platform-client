'use client';

import { CustomDatePicker } from '@/components/shared/custom-date-picker';
import { GuestSelector } from '@/components/shared/guest-selector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  selectSearchFilters,
  setDates,
  setGuests,
  setLocation,
} from '@/store/slices/search-slice';
import { CheckCircle2, Search } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

/* ── Decorative property cards shown in the hero right panel ── */
const HERO_CARDS = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80',
    alt: 'Beachside house',
    location: 'Bondi Beach · House',
    name: 'Bondi Beachside House',
    price: '$189',
    meta: '★ 4.7 · 203',
    badge: null,
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80',
    alt: 'City penthouse',
    location: 'Melbourne · Penthouse',
    name: 'Inner City Penthouse',
    price: '$310',
    meta: null,
    badge: 'Superhost',
  },
] as const;

const TRUST_STATS = [
  ['10K+', 'Properties'],
  ['4.8 ★', 'Avg. rating'],
  ['50+', 'Cities'],
] as const;

const SHADOW_BASE =
  '0 2px 4px rgba(0,0,0,0.04), 0 8px 16px rgba(0,0,0,0.08), 0 24px 48px rgba(0,0,0,0.12), 0 40px 80px rgba(61,111,142,0.16)';
const SHADOW_HOVER =
  '0 4px 8px rgba(0,0,0,0.06), 0 14px 28px rgba(0,0,0,0.11), 0 36px 72px rgba(0,0,0,0.13), 0 60px 110px rgba(61,111,142,0.22)';

const SHADOW_BASE_2 =
  '0 2px 4px rgba(0,0,0,0.04), 0 8px 16px rgba(0,0,0,0.08), 0 20px 40px rgba(0,0,0,0.12), 0 36px 72px rgba(61,111,142,0.16)';
const SHADOW_HOVER_2 =
  '0 4px 8px rgba(0,0,0,0.06), 0 14px 28px rgba(0,0,0,0.11), 0 32px 64px rgba(0,0,0,0.13), 0 52px 96px rgba(61,111,142,0.22)';

const SHADOW_BADGE =
  '0 2px 4px rgba(0,0,0,0.04), 0 6px 12px rgba(0,0,0,0.07), 0 16px 32px rgba(61,111,142,0.13)';
const SHADOW_BADGE_HOVER =
  '0 4px 8px rgba(0,0,0,0.06), 0 10px 20px rgba(0,0,0,0.10), 0 24px 48px rgba(61,111,142,0.20)';

const SPRING = { type: 'spring', stiffness: 280, damping: 20 } as const;

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

  return (
    <section className='bg-background-muted pt-16 pb-14 overflow-hidden'>
      <div className='max-w-[1240px] mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-[54%_46%] gap-10 items-center'>
        {/* ══════════════════════════════════════
            Left: Headline + Search + Stats
        ══════════════════════════════════════ */}
        <div>
          {/* Trust pill */}
          <div className='inline-flex items-center gap-2 bg-primary-subtle rounded-full px-4 py-1.5 mb-7'>
            <span className='w-2 h-2 rounded-full bg-primary block shrink-0' />
            <span className='text-[11px] font-bold text-primary uppercase tracking-[0.7px]'>
              10,000+ verified properties
            </span>
          </div>

          {/* Headline — Fraunces display font */}
          <h1
            className='text-[clamp(36px,5vw,58px)] leading-[1.08] text-foreground mb-5'
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '-1.5px',
            }}
          >
            Stay somewhere
            <br />
            <em
              className='text-primary'
              style={{ fontFamily: 'var(--font-display)' }}
            >
              you&apos;ll come back to
            </em>
          </h1>

          <p className='text-muted-foreground text-base leading-[1.65] mb-9 max-w-[400px]'>
            Hand-picked properties from trusted hosts. Book direct with zero
            hidden fees.
          </p>

          {/* ── Inline search bar ── */}
          <div className='flex items-stretch bg-white rounded-xl border border-border shadow-[0_4px_24px_rgba(61,111,142,0.09)] max-w-[580px]'>
            {/* Where */}
            <div className='flex-[1.4] min-w-0 px-4 py-3 border-r border-border/60'>
              <p className='text-[10px] font-bold uppercase tracking-[0.7px] text-primary mb-1'>
                Where
              </p>
              <Input
                value={filters.location ?? ''}
                onChange={(e) => dispatch(setLocation(e.target.value))}
                placeholder='City or suburb…'
                className='h-auto p-0 border-0 shadow-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm font-semibold text-foreground placeholder:text-muted-subtle bg-transparent'
                suppressHydrationWarning
              />
            </div>

            {/* Check-in */}
            <div className='flex-1 min-w-0 px-4 py-3 border-r border-border/60'>
              <p className='text-[10px] font-bold uppercase tracking-[0.7px] text-primary mb-1'>
                Check in
              </p>
              <CustomDatePicker
                value={checkInDate}
                onChange={handleCheckInChange}
                placeholder='Add date'
                className='text-sm font-semibold text-foreground border-0 shadow-none p-0 h-auto hover:bg-transparent'
              />
            </div>

            {/* Check-out */}
            <div className='flex-1 min-w-0 px-4 py-3 border-r border-border/60'>
              <p className='text-[10px] font-bold uppercase tracking-[0.7px] text-primary mb-1'>
                Check out
              </p>
              <CustomDatePicker
                value={checkOutDate}
                onChange={handleCheckOutChange}
                placeholder='Add date'
                className='text-sm font-semibold text-foreground border-0 shadow-none p-0 h-auto hover:bg-transparent'
              />
            </div>

            {/* Guests */}
            <div className='w-[90px] shrink-0 px-4 py-3'>
              <p className='text-[10px] font-bold uppercase tracking-[0.7px] text-primary mb-1'>
                Guests
              </p>
              <GuestSelector
                value={filters.guests}
                onChange={(guests) => dispatch(setGuests(guests))}
                maxGuests={16}
                className='border-0 shadow-none p-0 h-auto text-sm font-semibold text-foreground hover:bg-transparent justify-start w-full'
                showUserIcon={false}
              />
            </div>

            {/* Search button */}
            <div className='p-1.5 flex items-stretch'>
              <Button
                onClick={handleSearch}
                className='bg-primary hover:bg-primary-dark text-white font-semibold px-5 gap-2 rounded-lg transition-colors duration-150 h-full'
              >
                <Search className='size-4 shrink-0' />
                <span className='hidden sm:inline'>Search</span>
              </Button>
            </div>
          </div>

          {/* Trust stats */}
          <div className='flex gap-7 mt-7 pl-0.5'>
            {TRUST_STATS.map(([value, label]) => (
              <div key={label}>
                <div className='text-[18px] font-bold text-foreground tracking-tight'>
                  {value}
                </div>
                <div className='text-xs text-muted-subtle mt-0.5'>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════
            Right: Floating property cards
        ══════════════════════════════════════ */}
        <div className='relative h-[460px] hidden lg:block' aria-hidden>
          {/* Soft background blob */}
          <div className='absolute top-5 right-2 w-[300px] h-[300px] rounded-full bg-primary-subtle opacity-55 pointer-events-none' />

          {/* Card 1 — top right */}
          <motion.div
            className='absolute top-0 right-0 w-[272px] rounded-2xl overflow-hidden ring-[3px] ring-white z-10 bg-white cursor-default'
            style={{ boxShadow: SHADOW_BASE }}
            whileHover={{ scale: 1.01, y: -1, boxShadow: SHADOW_HOVER }}
            transition={SPRING}
          >
            <div className='h-[185px] relative overflow-hidden'>
              <Image
                src={HERO_CARDS[0].image}
                alt={HERO_CARDS[0].alt}
                fill
                className='object-cover'
                sizes='272px'
              />
            </div>
            <div className='px-4 py-3.5'>
              <div className='text-[11px] text-muted-subtle mb-1'>
                {HERO_CARDS[0].location}
              </div>
              <div className='text-[15px] font-semibold text-foreground'>
                {HERO_CARDS[0].name}
              </div>
              <div className='flex justify-between items-center mt-2.5'>
                <span className='text-[16px] font-bold text-primary'>
                  {HERO_CARDS[0].price}
                  <span className='text-xs font-normal text-muted-subtle'>
                    /night
                  </span>
                </span>
                <span className='text-[12px] text-muted-foreground'>
                  {HERO_CARDS[0].meta}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Card 2 — lower left */}
          <motion.div
            className='absolute top-[185px] left-2.5 w-[248px] rounded-2xl overflow-hidden ring-[3px] ring-white z-20 bg-white cursor-default'
            style={{ boxShadow: SHADOW_BASE_2 }}
            whileHover={{ scale: 1.01, y: -1, boxShadow: SHADOW_HOVER_2 }}
            transition={SPRING}
          >
            <div className='h-41.25 relative overflow-hidden'>
              <Image
                src={HERO_CARDS[1].image}
                alt={HERO_CARDS[1].alt}
                fill
                className='object-cover'
                sizes='248px'
              />
            </div>
            <div className='px-4 py-3.5'>
              <div className='text-[11px] text-muted-subtle mb-1'>
                {HERO_CARDS[1].location}
              </div>
              <div className='text-[15px] font-semibold text-foreground'>
                {HERO_CARDS[1].name}
              </div>
              <div className='flex justify-between items-center mt-2.5'>
                <span className='text-[16px] font-bold text-primary'>
                  {HERO_CARDS[1].price}
                  <span className='text-xs font-normal text-muted-subtle'>
                    /night
                  </span>
                </span>
                {HERO_CARDS[1].badge && (
                  <span className='text-[11px] bg-primary-subtle text-primary px-2.5 py-1 rounded-full font-bold'>
                    {HERO_CARDS[1].badge}
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Instant Book floating badge */}
          <motion.div
            className='absolute bottom-3 right-2 bg-white rounded-xl px-4 py-3 border border-border flex items-center gap-2.5 z-30 cursor-default'
            style={{ boxShadow: SHADOW_BADGE }}
            whileHover={{ scale: 1.01, y: -1, boxShadow: SHADOW_BADGE_HOVER }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <div className='w-9 h-9 rounded-lg bg-primary-subtle flex items-center justify-center shrink-0'>
              <CheckCircle2 className='size-4 text-primary' />
            </div>
            <div>
              <div className='text-[12px] font-bold text-foreground'>
                Instant Book
              </div>
              <div className='text-[11px] text-muted-subtle mt-0.5'>
                Confirm in seconds
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
