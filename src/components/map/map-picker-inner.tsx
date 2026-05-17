'use client';

import { cn } from '@/lib/utils';
import type { LatLng, Marker as LeafletMarker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Loader2, Search, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const L = require('leaflet') as typeof import('leaflet');
// @ts-expect-error – _getIconUrl is internal
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export interface MapLocation {
  latitude: number;
  longitude: number;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface MapPickerInnerProps {
  value: MapLocation;
  onChange: (location: MapLocation) => void;
  className?: string;
  mapHeight?: string;
}

interface Suggestion {
  placeId: string;
  mainText: string;
  secondaryText: string;
  lat: number;
  lng: number;
  raw: NominatimResult;
}

interface NominatimResult {
  osm_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address: {
    house_number?: string;
    road?: string;
    suburb?: string;
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

function parseNominatim(r: NominatimResult): Partial<MapLocation> {
  const a = r.address;
  const addressLine1 = [a.house_number, a.road].filter(Boolean).join(' ');
  const city = a.city ?? a.town ?? a.village ?? a.county ?? '';
  return {
    addressLine1,
    city,
    state: a.state ?? '',
    country: a.country ?? '',
    postalCode: a.postcode ?? '',
  };
}

function nominatimMainText(r: NominatimResult): string {
  const a = r.address;
  return (
    [a.house_number, a.road].filter(Boolean).join(' ') ||
    r.display_name.split(',')[0]
  );
}

function nominatimSecondaryText(r: NominatimResult): string {
  return r.display_name
    .split(',')
    .slice(1)
    .map((s) => s.trim())
    .slice(0, 3)
    .join(', ');
}

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';

async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<Partial<MapLocation>> {
  const res = await fetch(
    `${NOMINATIM_BASE}/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
    { headers: { 'Accept-Language': 'en' } },
  );
  if (!res.ok) return {};
  return parseNominatim(await res.json());
}

async function searchPlaces(query: string): Promise<Suggestion[]> {
  const res = await fetch(
    `${NOMINATIM_BASE}/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=6`,
    { headers: { 'Accept-Language': 'en' } },
  );
  if (!res.ok) return [];
  const data: NominatimResult[] = await res.json();
  return data.map((r) => ({
    placeId: String(r.osm_id),
    mainText: nominatimMainText(r),
    secondaryText: nominatimSecondaryText(r),
    lat: parseFloat(r.lat),
    lng: parseFloat(r.lon),
    raw: r,
  }));
}

function MapSync({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), { animate: true });
  }, [lat, lng, map]);
  return null;
}

function DraggableMarker({
  position,
  onMove,
}: {
  position: [number, number];
  onMove: (lat: number, lng: number) => void;
}) {
  const markerRef = useRef<LeafletMarker>(null);
  useMapEvents({
    click(e) {
      onMove(e.latlng.lat, e.latlng.lng);
    },
  });
  return (
    <Marker
      position={position}
      draggable
      ref={markerRef}
      eventHandlers={{
        dragend() {
          const pos: LatLng | undefined = markerRef.current?.getLatLng();
          if (pos) onMove(pos.lat, pos.lng);
        },
      }}
    />
  );
}

export function MapPickerInner({
  value,
  onChange,
  className,
  mapHeight = '320px',
}: MapPickerInnerProps) {
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onChangeRef = useRef(onChange);
  const valueRef = useRef(value);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const handleMarkerMove = useCallback(async (lat: number, lng: number) => {
    setIsGeocoding(true);
    try {
      const parsed = await reverseGeocode(lat, lng);
      onChangeRef.current({
        ...valueRef.current,
        ...parsed,
        latitude: lat,
        longitude: lng,
      });
      if (parsed.addressLine1) setSearchValue(parsed.addressLine1);
    } finally {
      setIsGeocoding(false);
    }
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setSearchValue(v);
    setActiveIdx(-1);
    setSuggestions([]);
    setSearchAttempted(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (v.length < 3) {
      setShowDropdown(false);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    setShowDropdown(true);
    debounceRef.current = setTimeout(async () => {
      const results = await searchPlaces(v);
      setSuggestions(results);
      setIsSearching(false);
      setSearchAttempted(true);
    }, 350);
  };

  const selectSuggestion = useCallback((s: Suggestion) => {
    setSuggestions([]);
    setShowDropdown(false);
    setIsSearching(false);
    setSearchAttempted(false);
    setActiveIdx(-1);
    setSearchValue(s.mainText);
    const parsed = parseNominatim(s.raw);
    onChangeRef.current({
      ...valueRef.current,
      ...parsed,
      latitude: s.lat,
      longitude: s.lng,
    });
  }, []);

  const clearSearch = () => {
    setSearchValue('');
    setSuggestions([]);
    setShowDropdown(false);
    setIsSearching(false);
    setSearchAttempted(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || !suggestions.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[activeIdx]);
    } else if (e.key === 'Escape') setShowDropdown(false);
  };

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none z-10' />
        <input
          ref={inputRef}
          type='text'
          value={searchValue}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          onFocus={() => (suggestions.length > 0 || isSearching || searchAttempted) && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          placeholder='Search for your property address…'
          autoComplete='off'
          className={cn(
            'w-full pl-10 pr-10 py-3 text-sm rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground',
            'focus:outline-none focus:border-primary transition-all',
          )}
        />
        {isGeocoding ? (
          <Loader2 className='absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground animate-spin' />
        ) : searchValue ? (
          <button
            type='button'
            onClick={clearSearch}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
          >
            <X className='size-4' />
          </button>
        ) : null}

        {showDropdown && (
          <div className='absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-2000 overflow-hidden'>
            {isSearching ? (
              /* Loading skeleton */
              <div className='px-4 py-3 space-y-3'>
                {[1, 2, 3].map((n) => (
                  <div key={n} className='flex flex-col gap-1.5 animate-pulse'>
                    <div className='h-3 w-3/5 bg-muted rounded' />
                    <div className='h-2.5 w-4/5 bg-muted/60 rounded' />
                  </div>
                ))}
              </div>
            ) : suggestions.length > 0 ? (
              /* Results list */
              suggestions.map((s, i) => (
                <button
                  key={s.placeId}
                  type='button'
                  onMouseDown={() => selectSuggestion(s)}
                  className={cn(
                    'w-full text-left px-4 py-3 flex flex-col gap-0.5 transition-colors border-b border-border/50 last:border-0',
                    i === activeIdx ? 'bg-primary/10' : 'hover:bg-muted',
                  )}
                >
                  <span className='text-sm font-medium text-foreground truncate'>
                    {s.mainText}
                  </span>
                  <span className='text-xs text-muted-foreground truncate'>
                    {s.secondaryText}
                  </span>
                </button>
              ))
            ) : searchAttempted ? (
              /* No results */
              <div className='px-4 py-4 text-center'>
                <p className='text-sm font-medium text-foreground'>No results found</p>
                <p className='text-xs text-muted-foreground mt-0.5'>Try a different address or city</p>
              </div>
            ) : null}

            {!isSearching && (suggestions.length > 0 || searchAttempted) && (
              <div className='px-4 py-1.5 bg-muted/60 border-t border-border/50'>
                <p className='text-[10px] text-muted-foreground'>
                  ©{' '}
                  <a
                    href='https://www.openstreetmap.org/copyright'
                    target='_blank'
                    rel='noreferrer'
                    className='underline underline-offset-2'
                  >
                    OpenStreetMap
                  </a>{' '}
                  contributors
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div
        className='relative rounded-xl overflow-hidden border border-border'
        style={{ height: mapHeight }}
      >
        <MapContainer
          center={[value.latitude, value.longitude]}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          attributionControl={true}
        >
          <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            maxZoom={19}
          />
          <MapSync lat={value.latitude} lng={value.longitude} />
          <DraggableMarker
            position={[value.latitude, value.longitude]}
            onMove={handleMarkerMove}
          />
        </MapContainer>
        <div className='absolute bottom-3 left-1/2 -translate-x-1/2 bg-foreground/80 text-background text-xs px-3 py-1.5 rounded-full pointer-events-none whitespace-nowrap z-1000'>
          Drag the pin or click to set location
        </div>
      </div>

      <p className='text-xs text-muted-foreground text-right'>
        {value.latitude.toFixed(6)}, {value.longitude.toFixed(6)}
      </p>
    </div>
  );
}
