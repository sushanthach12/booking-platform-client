'use client';

import { HeaderUserMenu } from '@/components/header/header-user-menu';
import AppLogo from '@/components/shared/app-logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

export interface SearchHeaderProps {
  locationQuery?: string;
  categoryQuery?: string;
  onLocationQueryChange?: (value: string) => void;
}

export function SearchHeader({ categoryQuery = '' }: SearchHeaderProps = {}) {
  const NAV_LINKS = useMemo(
    () => [
      { href: '/search', label: 'All stays', active: categoryQuery === '' },
      {
        href: '/search?category=hotels',
        label: 'Hotels',
        active: categoryQuery === 'hotels',
      },
      {
        href: '/search?category=apartments',
        label: 'Apartments',
        active: categoryQuery === 'apartments',
      },
    ],
    [categoryQuery],
  );

  return (
    <header
      className='sticky top-0 z-40 shrink-0 bg-white border-b border-border'
      data-header
    >
      <div className='h-16 flex items-center justify-between px-4 md:px-8 gap-4'>
        {/* Left: logo + nav */}
        <div className='flex items-center gap-8'>
          <AppLogo />

          <nav className='hidden lg:flex items-center gap-0.5'>
            {NAV_LINKS.map(({ href, label, active }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'relative px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  active
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                )}
              >
                {label}
                {active && (
                  <span className='absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-warm-accent' />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: user menu + mobile hamburger */}
        <div className='flex items-center gap-2'>
          <HeaderUserMenu becomeHostButtonClassName='rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted px-3 py-2 hidden md:flex transition-colors' />
          <Button
            variant='ghost'
            size='icon'
            className='rounded-lg lg:hidden text-muted-foreground hover:bg-muted'
          >
            <Menu className='size-5' />
          </Button>
        </div>
      </div>
    </header>
  );
}
