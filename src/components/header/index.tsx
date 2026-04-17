'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { AuthDialog } from '@/components/auth/auth-dialog';
import { getAuthUseCase } from '@/domain/di';
import { useAuth } from '@/hooks/use-auth';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import AppLogo from '../shared/app-logo';
import UserAvatar from '../shared/user-avatar';
import { Button } from '../ui/button';
import { HeaderUserMenu } from './header-user-menu';

const NAV_LINKS = [
  { href: '/search', label: 'Stays' },
  { href: '/search?category=hotels', label: 'Hotels' },
  { href: '/search?category=apartments', label: 'Apartments' },
];

export function Header({ hostDashboard = false }: { hostDashboard?: boolean }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { requireAuth, authOpen, setAuthOpen } = useAuthGuard();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleBecomeAHost = () =>
    requireAuth('/become-host', () => router.push('/become-host'));

  const handleMobileLogout = async () => {
    setMobileOpen(false);
    const authUseCase = getAuthUseCase();
    await authUseCase.logout();
    router.push('/');
    router.refresh();
  };

  const becomeHostClass =
    'text-muted-foreground hover:text-foreground hover:bg-muted';
  const authButtonClass =
    'bg-primary hover:bg-primary-dark text-white shadow-sm shadow-primary/20';

  const displayName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : 'Account';

  return (
    <>
      <header className='bg-background-muted py-2 3xl:py-3' data-header>
        <div className='max-w-350 mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-6'>
          <AppLogo light={false} />

          {!hostDashboard && (
            <nav className='hidden md:flex items-center gap-1'>
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors group text-muted-foreground hover:text-foreground hover:bg-muted`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          )}

          <div className='hidden md:flex items-center gap-2'>
            <HeaderUserMenu
              onBecomeHost={handleBecomeAHost}
              onOpenAuth={() => setAuthOpen(true)}
              becomeHostButtonClassName={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${becomeHostClass}`}
              authButtonClassName={`text-sm font-bold rounded-lg transition-all duration-200 ${authButtonClass}`}
            />
          </div>

          <button
            type='button'
            className='md:hidden p-2 rounded-lg transition-colors text-muted-foreground hover:bg-muted'
            onClick={() => setMobileOpen((v) => !v)}
            aria-label='Toggle menu'
          >
            {mobileOpen ? (
              <X className='size-5' />
            ) : (
              <Menu className='size-5' />
            )}
          </button>
        </div>

        {/* Mobile drawer */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-t border-border ${
            mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className='px-6 py-5 flex flex-col gap-1'>
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className='px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors'
              >
                {label}
              </Link>
            ))}
            {!user?.isHost && (
              <>
                <div className='h-px bg-border my-2' />
                <Button
                  variant='ghost'
                  size='lg'
                  onClick={() => {
                    handleBecomeAHost();
                    setMobileOpen(false);
                  }}
                  className='px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg text-left transition-colors w-full'
                >
                  Become a host
                </Button>
              </>
            )}

            {isAuthenticated && user ? (
              <>
                <div className='flex items-center gap-3 px-3 py-2'>
                  <UserAvatar
                    image={user.avatar ?? ''}
                    name={displayName}
                    size='sm'
                  />
                  <div className='min-w-0'>
                    <p className='text-sm font-semibold text-foreground truncate'>
                      {displayName}
                    </p>
                    <p className='text-xs text-muted-foreground truncate'>
                      {user.email}
                    </p>
                  </div>
                </div>
                <Link
                  href='/account'
                  onClick={() => setMobileOpen(false)}
                  className='px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors'
                >
                  My account
                </Link>
                <Button
                  variant='ghost'
                  size='lg'
                  onClick={handleMobileLogout}
                  className='px-3 py-3 text-sm font-medium text-destructive hover:text-destructive hover:bg-red-50 rounded-lg text-left transition-colors w-full'
                >
                  Log out
                </Button>
              </>
            ) : (
              <Button
                variant='default'
                size='lg'
                onClick={() => {
                  setAuthOpen(true);
                  setMobileOpen(false);
                }}
                className='w-full py-3 text-sm font-bold rounded-xl bg-primary hover:bg-primary-dark text-white transition-all shadow-md shadow-primary/20'
              >
                Log in
              </Button>
            )}
          </div>
        </div>
      </header>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}
