"use client";

import { API_CONSTANTS, apiUrl } from "@/domain/constants/api.constant";
import type { HostListingSummary } from "@/domain/entities";
import { getJsonHeaders } from "@/lib/utils/auth-headers";
import { useCallback, useEffect, useState } from "react";

export interface CalendarEntry {
  date: string;
  available: boolean;
  blockReason?: string | null;
}

export function useHostCalendar() {
  const [listings, setListings] = useState<HostListingSummary[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null,
  );
  const [calendarEntries, setCalendarEntries] = useState<CalendarEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [calendarLoading, setCalendarLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(
          apiUrl(API_CONSTANTS.ENDPOINTS.PROPERTIES.HOST_ME),
          {
            headers: getJsonHeaders(),
          },
        );
        if (res.ok) {
          const json: { data?: { properties?: HostListingSummary[] } } =
            await res.json();
          const data = Array.isArray(json.data?.properties)
            ? json.data.properties
            : [];
          if (!cancelled) {
            setListings(data);
            if (data.length > 0) setSelectedPropertyId(data[0].id);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const fetchCalendar = useCallback(
    async (propertyId: string, from?: string, to?: string) => {
      setCalendarLoading(true);
      try {
        const params = new URLSearchParams();
        if (from) params.set("from", from);
        if (to) params.set("to", to);
        const res = await fetch(
          `${apiUrl(API_CONSTANTS.ENDPOINTS.PROPERTY_CALENDAR(propertyId))}${params.toString() ? `?${params}` : ""}`,
          { headers: getJsonHeaders() },
        );
        if (res.ok) {
          const json: { data?: CalendarEntry[] } = await res.json();
          setCalendarEntries(Array.isArray(json.data) ? json.data : []);
        }
      } finally {
        setCalendarLoading(false);
      }
    },
    [],
  );

  const blockDates = useCallback(
    async (
      propertyId: string,
      startDate: string,
      endDate: string,
      reason?: string,
    ) => {
      await fetch(
        apiUrl(API_CONSTANTS.ENDPOINTS.PROPERTY_CALENDAR_BLOCK(propertyId)),
        {
          method: "POST",
          headers: getJsonHeaders(),
          body: JSON.stringify({ startDate, endDate, reason }),
        },
      );
    },
    [],
  );

  const unblockDate = useCallback(
    async (propertyId: string, blockId: string) => {
      await fetch(
        apiUrl(
          API_CONSTANTS.ENDPOINTS.PROPERTY_CALENDAR_UNBLOCK(
            propertyId,
            blockId,
          ),
        ),
        {
          method: "DELETE",
          headers: getJsonHeaders(),
        },
      );
    },
    [],
  );

  return {
    listings,
    selectedPropertyId,
    setSelectedPropertyId,
    calendarEntries,
    loading,
    calendarLoading,
    fetchCalendar,
    blockDates,
    unblockDate,
  };
}
