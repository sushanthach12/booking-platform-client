'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export type PaymentMethodId = 'upi_qr' | 'upi' | 'card' | 'netbank' | null;

interface PaymentOption {
  id: PaymentMethodId;
  label: string;
  icon: React.ReactNode;
  cards?: boolean;
}

interface PaymentAccordionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedId: PaymentMethodId;
  onSelect: (id: PaymentMethodId) => void;
  currency: string;
  options: PaymentOption[];
  /** Card fields when method is "card" */
  card?: {
    number: string;
    name: string;
    expiry: string;
    cvv: string;
    onNumberChange: (v: string) => void;
    onNameChange: (v: string) => void;
    onExpiryChange: (v: string) => void;
    onCvvChange: (v: string) => void;
  };
  /** UPI ID when method is "upi" */
  upiId?: string;
  onUpiIdChange?: (v: string) => void;
  onNext: () => void;
}

export function PaymentAccordion({
  open,
  onOpenChange,
  selectedId,
  onSelect,
  currency,
  options,
  card,
  upiId = '',
  onUpiIdChange,
  onNext,
}: PaymentAccordionProps) {
  const isStepDone = selectedId != null;
  const payLabel = options.find((o) => o.id === selectedId)?.label;

  return (
    <Card className={cn('transition-shadow', open && 'shadow-md')}>
      <Button
        variant='ghost'
        className='w-full text-left p-5'
        onClick={() => onOpenChange(!open)}
      >
        <div className='flex justify-between items-start'>
          <div>
            <p className='text-xs text-muted-foreground mb-1'>1.</p>
            <h3 className='text-lg font-semibold text-foreground'>
              Add a payment method
            </h3>
            {!open && payLabel && (
              <p className='text-sm text-muted-foreground mt-1'>{payLabel}</p>
            )}
          </div>
          {isStepDone && !open && (
            <Button
              type='button'
              variant='outline'
              size='sm'
              className='rounded-lg'
              onClick={(e) => {
                e.stopPropagation();
                onOpenChange(true);
              }}
            >
              Change
            </Button>
          )}
        </div>
      </Button>
      {open && (
        <CardContent className='pt-0 px-5 pb-5 space-y-4'>
          <p className='text-sm text-muted-foreground'>
            Available payment methods for <strong>{currency}</strong>.{' '}
            <span className='underline cursor-pointer text-foreground'>
              Switch currency
            </span>
          </p>
          <div className='rounded-xl border border-border overflow-hidden'>
            {options.map((opt, i) => (
              <button
                key={opt.id ?? 'none'}
                type='button'
                className={cn(
                  'w-full flex items-center justify-between px-5 py-4 text-left transition-colors border-b border-border last:border-b-0',
                  selectedId === opt.id && 'bg-muted/50',
                )}
                onClick={() => onSelect(opt.id)}
              >
                <div className='flex items-center gap-3'>
                  {opt.icon}
                  <span className='text-sm font-medium text-foreground'>
                    {opt.label}
                  </span>
                  {opt.cards && (
                    <span className='text-xs text-muted-foreground'>
                      VISA · MC · AMEX · RuPay
                    </span>
                  )}
                </div>
                <div
                  className={cn(
                    'size-5 rounded-full border-2 flex-shrink-0',
                    selectedId === opt.id
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground/40',
                  )}
                />
              </button>
            ))}
          </div>
          {selectedId === 'card' && card && (
            <div className='grid gap-3'>
              <Input
                placeholder='Card number'
                value={card.number}
                onChange={(e) => card.onNumberChange(e.target.value)}
                maxLength={19}
              />
              <Input
                placeholder='Name on card'
                value={card.name}
                onChange={(e) => card.onNameChange(e.target.value)}
              />
              <div className='grid grid-cols-2 gap-3'>
                <Input
                  placeholder='MM / YY'
                  value={card.expiry}
                  onChange={(e) => card.onExpiryChange(e.target.value)}
                  maxLength={7}
                />
                <Input
                  type='password'
                  placeholder='CVV'
                  value={card.cvv}
                  onChange={(e) => card.onCvvChange(e.target.value)}
                  maxLength={4}
                />
              </div>
            </div>
          )}
          {selectedId === 'upi' && onUpiIdChange && (
            <Input
              placeholder='Enter UPI ID (e.g. name@upi)'
              value={upiId}
              onChange={(e) => onUpiIdChange(e.target.value)}
            />
          )}
          <Button
            className='w-full'
            size='lg'
            disabled={!selectedId}
            onClick={onNext}
          >
            Next
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
