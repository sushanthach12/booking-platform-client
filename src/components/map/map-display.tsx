'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

export type { MapDisplayInnerProps as MapDisplayProps } from './map-display-inner';

const MapDisplayInner = dynamic(
  () => import('./map-display-inner').then((m) => m.MapDisplayInner),
  { ssr: false },
);

interface FallbackProps {
  className?: string;
  height?: string;
}

function MapFallback({ className, height = '320px' }: FallbackProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-2 rounded-xl border border-border bg-muted text-muted-foreground text-sm',
        className,
      )}
      style={{ height }}
    >
      <Loader2 className='size-5 animate-spin' />
      <span>Loading map…</span>
    </div>
  );
}

export function MapDisplay(props: {
  latitude: number;
  longitude: number;
  className?: string;
  height?: string;
  zoom?: number;
}) {
  return <MapDisplayInner {...props} />;
}

export { MapFallback };
