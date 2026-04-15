"use client";

import { getBookingUseCase } from "@/domain/di";
import type {
  HostBookingSummary,
  HostDashboardStats,
  HostListingSummary,
} from "@/domain/entities";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { HostAvailabilityTab } from "./host-availability-tab";
import { HostBookingsTab } from "./host-bookings-tab";
import { HostListingsTab } from "./host-listings-tab";
import { HostMessagesTab } from "./host-messages-tab";
import { HostOverviewTab } from "./host-overview-tab";
import { HostProfileTab } from "./host-profile-tab";

type HostTabId = "overview" | "listings" | "bookings" | "calendar" | "profile" | "messages";

const TABS: { id: HostTabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "listings", label: "Listings" },
  { id: "bookings", label: "Bookings" },
  { id: "calendar", label: "Availability" },
  { id: "profile", label: "Profile" },
  { id: "messages", label: "Messages" },
];

export interface HostDashboardViewProps {
  listings: HostListingSummary[];
  draftListings: HostListingSummary[];
  bookings: HostBookingSummary[];
  stats: HostDashboardStats;
  currentUserId: string;
  currentUserName: string;
  currentUserEmail: string;
  currentUserAvatar?: string;
}

export function HostDashboardView({
  listings,
  draftListings,
  bookings,
  stats,
  currentUserId,
  currentUserName,
  currentUserEmail,
  currentUserAvatar,
}: HostDashboardViewProps) {
  const [activeTab, setActiveTab] = useState<HostTabId>("overview");
  const [propertyFilter, setPropertyFilter] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [localBookings, setLocalBookings] = useState(bookings);

  const handleViewBookings = (propertyId: string) => {
    setPropertyFilter(propertyId);
    setActiveTab("bookings");
  };

  const handleCancelBooking = async (id: string) => {
    setCancellingId(id);
    try {
      await getBookingUseCase().cancelBooking(id);
      setLocalBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)),
      );
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 pt-10">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-slate-900">Host dashboard</h1>
          {currentUserName && (
            <p className="text-sm text-slate-500 mt-0.5">Welcome back, {currentUserName.split(" ")[0]}</p>
          )}
        </div>

        {/* Tab bar */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto pb-px scrollbar-none">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors",
                  activeTab === tab.id
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-700",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <HostOverviewTab
            stats={stats}
            draftListings={draftListings}
            recentBookings={localBookings.slice(0, 5)}
            onViewBookings={() => setActiveTab("bookings")}
          />
        )}

        {activeTab === "listings" && (
          <HostListingsTab listings={listings} onViewBookings={handleViewBookings} />
        )}

        {activeTab === "bookings" && (
          <HostBookingsTab
            bookings={localBookings}
            propertyFilter={propertyFilter}
            onClearPropertyFilter={() => setPropertyFilter(null)}
            cancellingId={cancellingId}
            onCancel={handleCancelBooking}
          />
        )}

        {activeTab === "calendar" && (
          <HostAvailabilityTab listings={listings} />
        )}

        {activeTab === "profile" && (
          <HostProfileTab
            currentUserId={currentUserId}
            currentUserName={currentUserName}
            currentUserEmail={currentUserEmail}
            currentUserAvatar={currentUserAvatar}
          />
        )}

        {activeTab === "messages" && <HostMessagesTab />}
      </div>
    </div>
  );
}
