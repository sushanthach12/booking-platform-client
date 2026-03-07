"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { addDays, format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { useCallback, useEffect } from "react";
import { SearchFilterSidebar, SearchFiltersState, SearchListing, useSearch, useSearchFilters } from "..";

export const SearchTemplate = () => {
  const locationLabel = "Melbourne";

  const { filters, updateFilters, clearFilters } = useSearchFilters();

  const { properties, totalCount, fetchProperties } = useSearch();

  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFiltersChange = useCallback(
    (next: SearchFiltersState) => {
      updateFilters(next);
    },
    [updateFilters],
  );

  return (
    <div className="flex w-full h-[calc(100vh-4.1rem)] overflow-hidden bg-background">
      <div className="hidden lg:block shrink-0 sticky top-0 h-[calc(100vh-4rem)]">
        <SearchFilterSidebar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={clearFilters}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <header className="shrink-0 border-b border-border bg-background px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                {totalCount} stays in {locationLabel}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {format(new Date(), "MMM d")} – {format(addDays(new Date(), 7), "MMM d")}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="default"
                  className="mt-2 w-fit gap-2 bg-background"
                  aria-label="Sort by price"
                >
                  {filters.sortBy === "price_asc"
                    ? "Price (low to high)"
                    : "Price (high to low)"}
                  <ChevronDownIcon className="size-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-44">
                <DropdownMenuCheckboxItem
                  checked={filters.sortBy === "price_asc"}
                  onCheckedChange={() => handleFiltersChange({ sortBy: "price_asc" })}
                >
                  Price (low to high)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filters.sortBy === "price_desc"}
                  onCheckedChange={() => handleFiltersChange({ sortBy: "price_desc" })}
                >
                  Price (high to low)
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="flex-1 min-h-0 overflow-y-auto">
          <SearchListing properties={properties} />
        </div>
      </div>
    </div>
  );
}

export default SearchTemplate;