'use client';

import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

export type { MapLocation } from './map-picker-inner';
export type { MapPickerInnerProps as MapPickerProps } from './map-picker-inner';

const MapPickerInner = dynamic(
  () => import('./map-picker-inner').then((m) => m.MapPickerInner),
  {
    ssr: false,
    loading: () => (
      <div className='flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-muted text-muted-foreground text-sm h-40'>
        <Loader2 className='size-6 animate-spin' />
        <p>Loading map…</p>
      </div>
    ),
  },
);

export { MapPickerInner as MapPicker };
