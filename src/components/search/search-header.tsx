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

export function SearchHeader() {
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
                  'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
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

        {/* Centre: compact search bar */}
        <div className='hidden md:flex flex-1 max-w-md'>
          <div className='w-full flex items-center gap-2 bg-stone-100 hover:bg-stone-200/70 border border-stone-200 rounded-2xl px-4 py-2.5 cursor-pointer transition-colors group'>
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-medium text-stone-700 truncate'>
                Where are you going?
              </p>
            </div>
            <Search className='size-4 text-stone-400 group-hover:text-orange-500 shrink-0 transition-colors' />
          </div>
        </div>

        {/* Right: user menu + mobile hamburger */}
        <div className='flex items-center gap-3'>
          <HeaderUserMenu
            becomeHostButtonClassName='rounded-xl text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 px-3 py-2 hidden md:flex transition-colors'
            userButtonLabel='User 1'
            userButtonClassName='rounded-xl border border-stone-200 hover:border-stone-300 flex items-center gap-2 px-3 py-2 text-sm font-medium text-stone-700 transition-colors'
          />
          <Button
            variant='ghost'
            size='icon'
            className='rounded-xl lg:hidden text-stone-600 hover:bg-stone-100'
          >
            <Menu className='size-5' />
          </Button>
        </div>
      </div>
    </header>
  );
}
