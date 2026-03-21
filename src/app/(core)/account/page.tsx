import { AccountTemplate } from '@/components/account/templates/account-template';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Account',
  robots: { index: false, follow: false }, // private page
};

export default function AccountPage() {
  return <AccountTemplate />;
}
