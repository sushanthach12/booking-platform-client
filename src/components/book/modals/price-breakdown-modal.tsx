'use client';

import { Modal } from '@/components/shared/modal';

export interface PriceBreakdownLine {
  label: string;
  value: number;
  /** e.g. "text-green-600" for discount */
  valueClassName?: string;
}

interface PriceBreakdownModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lines: PriceBreakdownLine[];
  totalLabel: string;
  totalValue: string;
  tip?: React.ReactNode;
}

export function PriceBreakdownModal({
  open,
  onOpenChange,
  lines,
  totalLabel,
  totalValue,
  tip,
}: PriceBreakdownModalProps) {
  const formatAmount = (n: number) => {
    const sign = n < 0 ? '−' : '';
    return `${sign}₹${Math.abs(n).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <Modal.Header>Price breakdown</Modal.Header>
      <Modal.Body className='mb-4'>
        <div className='space-y-3'>
          {lines.map(({ label, value, valueClassName }, i) => (
            <div key={i} className='flex justify-between items-center'>
              <span className='text-md text-foreground'>{label}</span>
              <span className={valueClassName ?? 'text-md text-foreground'}>
                {formatAmount(value)}
              </span>
            </div>
          ))}
        </div>
        <div className='flex justify-between items-center mt-4 pt-4 border-t border-border'>
          <span className='text-md font-bold text-foreground'>
            {totalLabel}
          </span>
          <span className='text-md font-bold text-foreground'>
            {totalValue}
          </span>
        </div>
        {tip && (
          <div className='mt-3 p-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800'>
            {tip}
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}
