import { DashboardMobileNav } from '@/components/dashboard/dashboard-mobile-nav';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import type { User } from '@/domain/entities';
import { COOKIE_KEYS } from '@/lib/utils/cookies';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_KEYS.AUTH_TOKEN)?.value;
  if (!token) redirect('/signin');

  const authUserRaw = cookieStore.get(COOKIE_KEYS.AUTH_USER)?.value;
  let isHost = false;
  if (authUserRaw) {
    try {
      const user = JSON.parse(authUserRaw) as User;
      isHost = !!(
        user.isHost || (user as unknown as { role?: string }).role === 'host'
      );
    } catch {
      // ignore
    }
  }

  return (
    <div className='h-screen flex overflow-hidden bg-background'>
      {/* Desktop sidebar */}
      <div className='hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0'>
        <DashboardSidebar isHost={isHost} />
      </div>

      {/* Main area */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Mobile topbar */}
        <header className='lg:hidden sticky top-0 z-40 flex items-center gap-3 h-14 px-4 bg-card border-b border-border shrink-0'>
          <DashboardMobileNav isHost={isHost} />
          <span className='text-base font-bold text-foreground'>Stayly</span>
        </header>

        <main className='flex flex-col flex-1 overflow-y-auto'>{children}</main>
      </div>
    </div>
  );
}
