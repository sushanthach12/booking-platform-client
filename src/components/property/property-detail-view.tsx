"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { PropertyDetailViewState } from "@/lib/utils/map-property";

interface PropertyDetailViewProps {
  /** All state from PropertyDetailsTemplate; no fetching in this component. */
  state: PropertyDetailViewState;
}

export function PropertyDetailView({ state }: PropertyDetailViewProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-muted">
            <img
              src={state.imageUrl}
              alt={state.title}
              className="size-full object-cover"
            />
          </div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{state.title}</h1>
              <p className="text-muted-foreground">{state.location}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="flex items-center gap-1 text-sm font-medium">
                  ★ {state.rating.toFixed(1)}
                </span>
                {state.reviewCount != null && (
                  <span className="text-sm text-muted-foreground">
                    · {state.reviewCount} reviews
                  </span>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="secondary">{state.type}</Badge>
              </div>
            </div>
            <p className="text-lg font-semibold">{state.priceLabel}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg border border-border p-3 text-center">
              <p className="text-sm text-muted-foreground">Bedrooms</p>
              <p className="font-medium">{state.bedrooms ?? "—"}</p>
            </div>
            <div className="rounded-lg border border-border p-3 text-center">
              <p className="text-sm text-muted-foreground">Beds</p>
              <p className="font-medium">{state.beds ?? "—"}</p>
            </div>
            <div className="rounded-lg border border-border p-3 text-center">
              <p className="text-sm text-muted-foreground">Bathrooms</p>
              <p className="font-medium">{state.bathrooms ?? "—"}</p>
            </div>
            <div className="rounded-lg border border-border p-3 text-center">
              <p className="text-sm text-muted-foreground">Guests</p>
              <p className="font-medium">—</p>
            </div>
          </div>
          {state.description && (
            <section>
              <h2 className="mb-2 font-semibold">Description</h2>
              <p className="text-muted-foreground">{state.description}</p>
              <button
                type="button"
                className="mt-2 text-sm font-medium text-primary hover:underline"
              >
                Read more
              </button>
            </section>
          )}
          <div className="flex gap-4">
            <Button className="rounded-full">Check Dates</Button>
            <button
              type="button"
              className="text-sm font-medium text-foreground hover:underline"
            >
              Add to favourite
            </button>
          </div>
        </div>
        <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardHeader>
              <h2 className="font-semibold">Your Host</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="size-12">
                  <AvatarImage src={state.hostImage} alt={state.hostName} />
                  <AvatarFallback>{state.hostName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{state.hostName}</p>
                  {state.isSuperhost && (
                    <Badge variant="guestFavorite" className="mt-1">
                      Superhost
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Host bio placeholder.
              </p>
              <Button variant="outline" className="w-full">
                Contact Host
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <h2 className="font-semibold">Booking</h2>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Date picker and Reserve CTA (sticky booking widget).
              </p>
              <Button className="mt-4 w-full rounded-full">Reserve</Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
