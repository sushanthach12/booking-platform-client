"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/redux";
import { setLocation, setDates, setGuests } from "@/store/search-slice";
import { SearchViewNew } from "./search-view";
import type { PropertyEntity } from "@/domain/entities";

interface SearchPageWrapperProps {
  properties: PropertyEntity[];
  totalCount: number;
  locationLabel: string;
  searchParams?: { [key: string]: string | string[] | undefined };
}

export function SearchPageWrapper({
  properties,
  totalCount,
  locationLabel,
  searchParams,
}: SearchPageWrapperProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Update Redux store with URL parameters
    if (searchParams) {
      // Set location
      if (searchParams.location && typeof searchParams.location === "string") {
        dispatch(setLocation(searchParams.location));
      }

      // Set dates
      if (searchParams.checkIn && typeof searchParams.checkIn === "string") {
        const checkIn = new Date(searchParams.checkIn);
        if (!isNaN(checkIn.getTime())) {
          const checkOutDate =
            searchParams.checkOut && typeof searchParams.checkOut === "string"
              ? new Date(searchParams.checkOut)
              : null;
          dispatch(
            setDates({
              checkIn,
              checkOut:
                checkOutDate && !isNaN(checkOutDate.getTime())
                  ? checkOutDate
                  : null,
            }),
          );
        }
      }

      // Set guests
      if (searchParams.guests && typeof searchParams.guests === "string") {
        const guestCount = parseInt(searchParams.guests, 10);
        if (!isNaN(guestCount) && guestCount > 0) {
          dispatch(
            setGuests({
              adults: Math.max(1, guestCount),
              children: 0,
              infants: 0,
            }),
          );
        }
      }
    }
  }, [searchParams, dispatch]);

  return (
    <SearchViewNew
      properties={properties}
      totalCount={totalCount}
      locationLabel={locationLabel}
    />
  );
}
