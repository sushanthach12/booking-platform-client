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
    <div className='min-h-screen flex bg-background'>
      {/* Desktop sidebar */}
      <div className='hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 lg:w-64'>
        <DashboardSidebar isHost={isHost} />
      </div>

      {/* Main area */}
      <div className='flex-1 lg:pl-64 flex flex-col min-h-screen'>
        {/* Mobile topbar */}
        <header className='lg:hidden sticky top-0 z-40 flex items-center gap-3 h-14 px-4 bg-card border-b border-border'>
          <DashboardMobileNav isHost={isHost} />
          <span className='text-base font-bold text-foreground'>Stayly</span>
        </header>

        <main className='flex-1 w-full'>{children}</main>
      </div>
    </div>
  );
}
