'use client';

import AppLogo from '@/components/shared/app-logo';
import { HeaderUserMenu } from './header-user-menu';

interface SimpleHeaderProps {
  showUserMenu?: boolean;
}

export function SimpleHeader({ showUserMenu = true }: SimpleHeaderProps) {
  return (
    <header className='sticky top-0 z-40 shrink-0 bg-background p-2'>
      <div className='flex h-16 items-center justify-between px-4 md:px-10'>
        <AppLogo />
        {showUserMenu && <HeaderUserMenu />}
      </div>
    </header>
  );
}
