'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export type PaymentMethodId = 'upi_qr' | 'upi' | 'card' | 'netbank' | null;

export interface PaymentOption {
  id: PaymentMethodId;
  label: string;
  icon: React.ReactNode;
  cards?: boolean;
}

export interface BookingStepsProps {
  /** Controlled open step: "step-1" | "step-2" */
  value: string;
  onValueChange: (val: string) => void;
  /** Selected payment method label when step 1 is completed (shown in trigger when collapsed) */
  completedPayment: string | null;
  /** Payment step props */
  selectedPaymentId: PaymentMethodId;
  onSelectPayment: (id: PaymentMethodId) => void;
  currency: string;
  paymentOptions: PaymentOption[];
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
  upiId?: string;
  onUpiIdChange?: (v: string) => void;
  onPaymentNext: () => void;
  /** Review step props */
  cancellationDate?: string;
  agreed: boolean;
  onAgreedChange: (v: boolean) => void;
  onConfirm: () => void;
}

export function BookingSteps({
  value,
  onValueChange,
  completedPayment,
  selectedPaymentId,
  onSelectPayment,
  currency,
  paymentOptions,
  card,
  upiId = '',
  onUpiIdChange,
  onPaymentNext,
  cancellationDate = '2 April',
  agreed,
  onAgreedChange,
  onConfirm,
}: BookingStepsProps) {
  return (
    <Accordion
      type='single'
      collapsible={false}
      value={value}
      onValueChange={onValueChange}
      className='space-y-4'
    >
      {/* Step 1: Payment */}
      <AccordionItem
        value='step-1'
        className='border border-[#DDDDDD] rounded-2xl overflow-hidden shadow-none px-6 last:border-b! last:border-b-[#DDDDDD]!'
      >
        <AccordionTrigger className='hover:no-underline py-5 [&>svg]:hidden'>
          <div className='flex justify-between items-center w-full'>
            <div className='text-left'>
              <h3 className='text-lg font-semibold text-foreground'>
                1. Add a payment method
              </h3>
              {value !== 'step-1' && completedPayment && (
                <p className='text-sm text-muted-foreground mt-1'>
                  {completedPayment}
                </p>
              )}
            </div>
            {value !== 'step-1' && completedPayment && (
              <Button
                variant='outline'
                size='sm'
                onClick={(e) => {
                  e.stopPropagation();
                  onValueChange('step-1');
                }}
                className='rounded-lg text-foreground font-semibold shrink-0'
              >
                Change
              </Button>
            )}
          </div>
        </AccordionTrigger>

        <AccordionContent className='pb-6 pt-0'>
          <div className='space-y-4'>
            <p className='text-sm text-muted-foreground'>
              Available payment methods for <strong>{currency}</strong>.{' '}
              <span className='underline cursor-pointer text-foreground'>
                Switch currency
              </span>
            </p>
            <div className='rounded-xl border border-border overflow-hidden'>
              {paymentOptions.map((opt) => (
                <button
                  key={opt.id ?? 'none'}
                  type='button'
                  className={cn(
                    'w-full flex items-center justify-between px-5 py-4 text-left transition-colors border-b border-border last:border-b-0',
                    selectedPaymentId === opt.id && 'bg-muted/50',
                  )}
                  onClick={() => onSelectPayment(opt.id)}
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
                      'size-5 rounded-full border-2 shrink-0',
                      selectedPaymentId === opt.id
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground/40',
                    )}
                  />
                </button>
              ))}
            </div>
            {selectedPaymentId === 'card' && card && (
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
            {selectedPaymentId === 'upi' && onUpiIdChange && (
              <Input
                placeholder='Enter UPI ID (e.g. name@upi)'
                value={upiId}
                onChange={(e) => onUpiIdChange(e.target.value)}
              />
            )}
            <Button
              className='w-full'
              size='lg'
              disabled={!selectedPaymentId}
              onClick={onPaymentNext}
            >
              Next
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Step 2: Review */}
      <AccordionItem
        value='step-2'
        className='border border-[#DDDDDD] rounded-2xl overflow-hidden shadow-none px-6 last:border-b! last:border-b-[#DDDDDD]!'
      >
        <AccordionTrigger className='hover:no-underline py-5 [&>svg]:hidden'>
          <div className='text-left'>
            <h3 className='text-lg font-semibold text-foreground'>
              2. Review your reservation
            </h3>
          </div>
        </AccordionTrigger>

        <AccordionContent className='pb-6 pt-0'>
          <div className='space-y-5'>
            <div className='rounded-lg bg-muted/50 p-4'>
              <p className='text-sm font-semibold text-foreground mb-1'>
                Free cancellation
              </p>
              <p className='text-sm text-muted-foreground'>
                Cancel before {cancellationDate} for a full refund.{' '}
                <span className='underline cursor-pointer text-foreground font-medium'>
                  Full policy
                </span>
              </p>
            </div>
            <div>
              <h4 className='text-base font-semibold text-foreground mb-2'>
                Ground rules
              </h4>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                We ask every guest to remember a few simple things: follow the
                house rules, treat the host&apos;s home like your own, and
                communicate openly.
              </p>
            </div>
            <div className='h-px bg-border' />
            <div className='flex gap-3 items-start'>
              <Checkbox
                id='booking-terms'
                checked={agreed}
                onCheckedChange={(c) => onAgreedChange(c === true)}
                className='mt-0.5'
              />
              <label
                htmlFor='booking-terms'
                className='text-sm text-muted-foreground leading-relaxed cursor-pointer'
              >
                By selecting the button, I agree to the{' '}
                <span className='underline text-foreground font-medium'>
                  booking terms
                </span>
                .
              </label>
            </div>
            <Button
              className='w-full bg-primary hover:bg-primary/90'
              size='lg'
              disabled={!agreed}
              onClick={onConfirm}
            >
              Confirm and pay
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
