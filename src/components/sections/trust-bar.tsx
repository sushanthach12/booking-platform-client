import { Award, CreditCard, Headphones, ShieldCheck } from 'lucide-react';

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    label: 'Verified listings',
    desc: 'Every property reviewed',
  },
  {
    icon: Headphones,
    label: '24/7 support',
    desc: 'Always here to help',
  },
  {
    icon: CreditCard,
    label: 'Secure payments',
    desc: 'End-to-end encrypted',
  },
  {
    icon: Award,
    label: 'Best price guarantee',
    desc: 'No hidden fees, ever',
  },
] as const;

export function TrustBar() {
  return (
    <section className='border-t border-border py-10 px-6 lg:px-10 bg-white'>
      <div className='max-w-310 mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6'>
        {TRUST_ITEMS.map(({ icon: Icon, label, desc }) => (
          <div key={label} className='flex items-start gap-3.5'>
            <div className='w-9 h-9 rounded-xl bg-primary-subtle flex items-center justify-center shrink-0 mt-0.5'>
              <Icon className='size-4 text-primary' aria-hidden />
            </div>
            <div>
              <p className='text-sm font-semibold text-foreground'>{label}</p>
              <p className='text-xs text-muted-foreground mt-0.5'>{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
