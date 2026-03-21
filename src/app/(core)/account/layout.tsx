import { Footer } from '@/components/footer';
import { SimpleHeader } from '@/components/header/simple-header';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen flex flex-col bg-background'>
      {/*
        SimpleHeader already accepts showUserMenu — perfect for account pages
        where you want the user menu visible but not the full nav/search chrome
      */}
      <SimpleHeader showUserMenu />
      <main className='flex-1'>{children}</main>
      <Footer />
    </div>
  );
}
