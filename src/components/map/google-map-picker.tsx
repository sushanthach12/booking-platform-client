"use client";

import { cn } from "@/lib/utils";
import { Loader2, MapPin, Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

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

interface GoogleMapPickerProps {
  /** Current location state */
  value: MapLocation;
  /** Called whenever the user picks a new location or drags the pin */
  onChange: (location: MapLocation) => void;
  className?: string;
  mapHeight?: string;
}

declare global {
  interface Window {
    google: typeof google;
    initGoogleMaps?: () => void;
  }
}

function extractAddressComponent(
  components: google.maps.GeocoderAddressComponent[],
  types: string[],
  useShort = false,
): string {
  const found = components.find((c) =>
    types.some((t) => c.types.includes(t)),
  );
  if (!found) return "";
  return useShort ? found.short_name : found.long_name;
}

function parsePlace(place: google.maps.places.PlaceResult): Partial<MapLocation> {
  const components = place.address_components ?? [];

  const streetNumber = extractAddressComponent(components, ["street_number"]);
  const route = extractAddressComponent(components, ["route"]);
  const addressLine1 = [streetNumber, route].filter(Boolean).join(" ");

  const city =
    extractAddressComponent(components, ["locality"]) ||
    extractAddressComponent(components, ["postal_town"]) ||
    extractAddressComponent(components, ["sublocality_level_1"]) ||
    extractAddressComponent(components, ["administrative_area_level_2"]);

  const state = extractAddressComponent(
    components,
    ["administrative_area_level_1"],
    true,
  );
  const country = extractAddressComponent(components, ["country"]);
  const postalCode = extractAddressComponent(components, ["postal_code"]);

  const lat = place.geometry?.location?.lat() ?? 0;
  const lng = place.geometry?.location?.lng() ?? 0;

  return { addressLine1, city, state, country, postalCode, latitude: lat, longitude: lng };
}

let mapsPromise: Promise<void> | null = null;

function loadGoogleMaps(apiKey: string): Promise<void> {
  if (mapsPromise) return mapsPromise;

  if (
    typeof window !== "undefined" &&
    window.google?.maps?.places
  ) {
    mapsPromise = Promise.resolve();
    return mapsPromise;
  }

  mapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });

  return mapsPromise;
}

export function GoogleMapPicker({
  value,
  onChange,
  className,
  mapHeight = "320px",
}: GoogleMapPickerProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState(value.addressLine1);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Pan map + move marker to new coords
  const updateMapPosition = useCallback((lat: number, lng: number) => {
    const pos = { lat, lng };
    mapRef.current?.panTo(pos);
    markerRef.current?.setPosition(pos);
  }, []);

  // Reverse geocode a LatLng and call onChange
  const reverseGeocode = useCallback(
    async (lat: number, lng: number) => {
      if (!window.google?.maps) return;
      setIsGeocoding(true);
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        setIsGeocoding(false);
        if (status !== "OK" || !results?.[0]) {
          onChange({ ...value, latitude: lat, longitude: lng });
          return;
        }
        const parsed = parsePlace(results[0] as unknown as google.maps.places.PlaceResult);
        onChange({ ...value, ...parsed, latitude: lat, longitude: lng });
        setSearchValue(parsed.addressLine1 ?? "");
      });
    },
    [onChange, value],
  );

  // Initialize map and autocomplete once SDK is ready
  const initMap = useCallback(() => {
    if (!mapContainerRef.current || !inputRef.current) return;

    const center = { lat: value.latitude, lng: value.longitude };

    const map = new google.maps.Map(mapContainerRef.current, {
      center,
      zoom: 14,
      disableDefaultUI: false,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        { featureType: "poi", stylers: [{ visibility: "off" }] },
        { featureType: "transit", stylers: [{ visibility: "off" }] },
      ],
    });

    const marker = new google.maps.Marker({
      position: center,
      map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      title: "Drag to adjust location",
    });

    marker.addListener("dragend", () => {
      const pos = marker.getPosition();
      if (!pos) return;
      reverseGeocode(pos.lat(), pos.lng());
    });

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      fields: ["address_components", "geometry", "formatted_address"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry?.location) return;

      const parsed = parsePlace(place);
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      onChange({ ...value, ...parsed, latitude: lat, longitude: lng });
      setSearchValue(parsed.addressLine1 ?? "");

      map.panTo({ lat, lng });
      map.setZoom(16);
      marker.setPosition({ lat, lng });
    });

    mapRef.current = map;
    markerRef.current = marker;
    autocompleteRef.current = autocomplete;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!apiKey || apiKey === "YOUR_KEY_HERE") {
      setLoadError("Google Maps API key is not configured.");
      return;
    }

    loadGoogleMaps(apiKey)
      .then(() => {
        setIsLoaded(true);
      })
      .catch(() => setLoadError("Failed to load Google Maps."));
  }, [apiKey]);

  useEffect(() => {
    if (isLoaded && mapContainerRef.current && !mapRef.current) {
      initMap();
    }
  }, [isLoaded, initMap]);

  // Sync map if parent changes lat/lng externally
  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      updateMapPosition(value.latitude, value.longitude);
    }
  }, [value.latitude, value.longitude, updateMapPosition]);

  const clearSearch = () => {
    setSearchValue("");
    inputRef.current?.focus();
  };

  if (loadError) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-muted text-muted-foreground text-sm",
          className,
        )}
        style={{ height: mapHeight }}
      >
        <MapPin className="size-6 opacity-40" />
        <p>{loadError}</p>
        <p className="text-xs opacity-60">
          Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search for your property address…"
          className={cn(
            "w-full pl-10 pr-10 py-3 text-sm rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:border-primary transition-all",
          )}
        />
        {isGeocoding ? (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground animate-spin" />
        ) : searchValue ? (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      {/* Map container */}
      <div className="relative rounded-xl overflow-hidden border border-border">
        {!isLoaded && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted text-muted-foreground text-sm z-10"
            style={{ height: mapHeight }}
          >
            <Loader2 className="size-6 animate-spin" />
            <p>Loading map…</p>
          </div>
        )}
        <div
          ref={mapContainerRef}
          style={{ height: mapHeight, width: "100%" }}
          className={cn(!isLoaded && "invisible")}
        />
        {/* Drag hint */}
        {isLoaded && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-foreground/80 text-background text-xs px-3 py-1.5 rounded-full pointer-events-none">
            Drag the pin to fine-tune location
          </div>
        )}
      </div>

      {/* Coordinates display */}
      {isLoaded && (
        <p className="text-xs text-muted-foreground text-right">
          {value.latitude.toFixed(6)}, {value.longitude.toFixed(6)}
        </p>
      )}
    </div>
  );
}
