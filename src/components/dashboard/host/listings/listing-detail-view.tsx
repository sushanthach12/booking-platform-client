"use client";

import { PathBreadcrumb } from "@/components/shared/path-breadcrumb";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ListingDetailSkeleton } from "./components/listing-detail-skeleton";
import { ListingHero } from "./components/listing-hero";
import { BookingsTab } from "./components/tabs/bookings-tab";
import { OverviewTab } from "./components/tabs/overview-tab";
import { PerformanceTab } from "./components/tabs/performance-tab";
import { ReviewsTab } from "./components/tabs/reviews-tab";
import { useListingDetail } from "./hooks/use-listing-detail";

type TabKey = "overview" | "reviews" | "bookings" | "performance";

interface ListingDetailViewProps {
  propertyId: string;
}

export function ListingDetailView({ propertyId }: ListingDetailViewProps) {
  const { form, summary, bookings, reviews, loading, error, toggleStatus } =
    useListingDetail(propertyId);
  const [tab, setTab] = useState<TabKey>("overview");

  if (loading) return <ListingDetailSkeleton />;

  if (error || !form) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
          <PathBreadcrumb
            items={[
              { label: "Listings", href: "/dashboard/host/listings" },
              { label: "Not found" },
            ]}
          />
          <p className="mt-10 text-center text-sm text-slate-500">
            {error ?? "This listing could not be loaded."}
          </p>
        </div>
      </div>
    );
  }

  const reviewCount = summary?.reviewCount ?? reviews.length;

  const TABS: { key: TabKey; label: string; count?: number }[] = [
    { key: "overview", label: "Overview" },
    { key: "reviews", label: "Reviews", count: reviewCount },
    { key: "bookings", label: "Bookings", count: bookings.length },
    { key: "performance", label: "Performance" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <PathBreadcrumb
          items={[
            { label: "Listings", href: "/dashboard/host/listings" },
            { label: form.title },
          ]}
        />

        <ListingHero
          propertyId={propertyId}
          form={form}
          summary={summary}
          bookingCount={bookings.length}
          reviewCount={reviewCount}
          onToggleStatus={toggleStatus}
        />

        {/* Tab bar */}
        <div className="flex items-center gap-6 border-b border-slate-200">
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={cn(
                  "relative -mb-px flex items-center gap-2 border-b-2 pb-3 text-sm font-medium transition-colors",
                  active
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800",
                )}
              >
                {t.label}
                {t.count != null && t.count > 0 && (
                  <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-xs font-semibold text-slate-500">
                    {t.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {tab === "overview" && (
          <OverviewTab propertyId={propertyId} form={form} />
        )}
        {tab === "reviews" && <ReviewsTab reviews={reviews} />}
        {tab === "bookings" && <BookingsTab bookings={bookings} />}
        {tab === "performance" && (
          <PerformanceTab
            bookings={bookings}
            rating={summary?.rating ?? 0}
            reviewCount={reviewCount}
            currency={form.currency || "USD"}
          />
        )}
      </div>
    </div>
  );
}
