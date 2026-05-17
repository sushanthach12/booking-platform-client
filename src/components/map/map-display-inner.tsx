'use client';

import { cn } from '@/lib/utils';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const L = require('leaflet') as typeof import('leaflet');
// @ts-expect-error – internal
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export interface MapDisplayInnerProps {
  latitude: number;
  longitude: number;
  className?: string;
  height?: string;
  zoom?: number;
}

export function MapDisplayInner({
  latitude,
  longitude,
  className,
  height = '320px',
  zoom = 15,
}: MapDisplayInnerProps) {
  // Suppress Leaflet's ResizeObserver loop warning in dev
  useEffect(() => {}, []);

  return (
    <div
      className={cn('rounded-xl overflow-hidden border border-border', className)}
      style={{ height }}
    >
      <MapContainer
        center={[latitude, longitude]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        attributionControl={true}
      >
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
        />
        <Marker position={[latitude, longitude]} />
      </MapContainer>
    </div>
  );
}
