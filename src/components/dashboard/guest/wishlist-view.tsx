"use client";

import { Button } from "@/components/ui/button";
import { useWishlist } from "@/domain/hooks/dashboard/use-wishlist";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function WishlistView() {
  const { items, loading, error, removeFromWishlist } = useWishlist();

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Wishlist</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl bg-slate-100 h-48 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Wishlist</h1>
        <div className="text-center py-16 text-slate-400">
          <p className="font-semibold text-slate-600">
            Failed to load wishlist
          </p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Wishlist</h1>
        <div className="text-center py-16 text-slate-400">
          <Heart className="size-10 mx-auto mb-3 opacity-30" />
          <p className="font-semibold text-slate-600">Your wishlist is empty</p>
          <p className="text-sm mt-1">
            Save properties you love and find them here.
          </p>
          <Button
            asChild
            className="mt-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white"
          >
            <Link href="/search">Explore properties</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        Wishlist{" "}
        <span className="text-slate-400 font-normal text-lg">
          ({items.length})
        </span>
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const { propertyId, property } = item;
          const title = property?.title ?? "Property";
          const coverImage = property?.coverImage ?? null;
          const location = [property?.city, property?.state]
            .filter(Boolean)
            .join(", ");

          return (
            <div
              key={propertyId}
              className="relative rounded-2xl overflow-hidden border border-slate-100 bg-white shadow-none group"
            >
              <Link href={`/properties/${propertyId}`}>
                <div className="relative w-full h-40 bg-slate-100">
                  {coverImage ? (
                    <Image
                      src={coverImage}
                      alt={title}
                      fill
                      className="object-cover group-hover:opacity-90 transition-opacity"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-slate-300">
                      <Heart className="size-8 opacity-30" />
                    </div>
                  )}
                </div>
              </Link>
              <button
                onClick={() => removeFromWishlist(propertyId)}
                className="absolute top-2 right-2 size-8 flex items-center justify-center bg-white rounded-full shadow-sm border border-slate-100 hover:bg-rose-50 transition-colors"
                aria-label="Remove from wishlist"
              >
                <Heart className="size-4 fill-rose-500 text-rose-500" />
              </button>
              <div className="p-3">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {title}
                </p>
                {location && (
                  <p className="text-xs text-slate-400 truncate">{location}</p>
                )}
                {property?.basePrice != null && (
                  <p className="text-xs font-semibold text-slate-700 mt-1">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: property.currency ?? "INR",
                      maximumFractionDigits: 0,
                    }).format(property.basePrice)}
                    <span className="font-normal text-slate-400"> / night</span>
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
