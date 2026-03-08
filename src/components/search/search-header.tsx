'use client';

import { HeaderUserMenu } from '@/components/header/header-user-menu';
import AppLogo from '@/components/shared/app-logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu, Search } from 'lucide-react';
import Link from 'next/link';

const NAV_LINKS = [
  { href: '/search', label: 'Stays', active: true },
  { href: '/experiences', label: 'Experiences', active: false },
  { href: '/online-experiences', label: 'Online Experiences', active: false },
];

const SEARCH_PLACEHOLDER = 'Where are you going?';

export interface SearchHeaderProps {
  /** Current location query from search filter state; when provided with onLocationQueryChange, the bar becomes a controlled input */
  locationQuery?: string;
  /** Called when the user types in the header search; persists into search filter state */
  onLocationQueryChange?: (value: string) => void;
}

export function SearchHeader({
  locationQuery = '',
  onLocationQueryChange,
}: SearchHeaderProps = {}) {
  const isControlled = onLocationQueryChange !== undefined;

  return (
    <header
      className='sticky top-0 z-40 shrink-0 bg-white border-b border-stone-200'
      data-header
    >
      <div className='h-16 flex items-center justify-between px-4 md:px-8 gap-4'>
        {/* Left: logo + nav */}
        <div className='flex items-center gap-8'>
          <AppLogo />

          <nav className='hidden lg:flex items-center gap-1'>
            {NAV_LINKS.map(({ href, label, active }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  active
                    ? 'bg-stone-100 text-stone-900'
                    : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50',
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Centre: compact search bar (controlled when locationQuery + onLocationQueryChange provided) */}
        <div className='hidden md:flex flex-1 max-w-md'>
          <div className='w-full flex items-center gap-2 bg-stone-100 hover:bg-stone-200/70 border border-stone-200 rounded-2xl px-4 py-2.5 transition-colors group focus-within:bg-white focus-within:border-stone-300 focus-within:ring-2 focus-within:ring-orange-500/20'>
            <div className='flex-1 min-w-0'>
              {isControlled ? (
                <input
                  type='text'
                  value={locationQuery}
                  onChange={(e) => onLocationQueryChange(e.target.value)}
                  placeholder={SEARCH_PLACEHOLDER}
                  className='w-full bg-transparent text-sm font-medium text-stone-700 placeholder:text-stone-500 outline-none truncate'
                  aria-label={SEARCH_PLACEHOLDER}
                />
              ) : (
                <p className='text-sm font-medium text-stone-700 truncate'>
                  {SEARCH_PLACEHOLDER}
                </p>
              )}
            </div>
            <Search className='size-4 text-stone-400 group-hover:text-orange-500 shrink-0 transition-colors pointer-events-none' />
          </div>
        </div>

        {/* Right: user menu + mobile hamburger */}
        <div className='flex items-center gap-3'>
          <HeaderUserMenu becomeHostButtonClassName='rounded-lg text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 px-3 py-2 hidden md:flex transition-colors' />
          <Button
            variant='ghost'
            size='icon'
            className='rounded-lg lg:hidden text-stone-600 hover:bg-stone-100'
          >
            <Menu className='size-5' />
          </Button>
        </div>
      </div>
    </header>
  );
}
