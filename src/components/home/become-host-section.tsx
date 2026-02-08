"use client";

import { ArrowRight, Home, Shield, DollarSign } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function BecomeHostSection() {
  return (
    <section className="bg-muted py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-foreground">
                Become a Host
              </h2>
              <p className="text-xl text-muted-foreground">
                Share your space, earn extra income, and create unforgettable
                experiences for travelers around the world.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <DollarSign className="size-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Earn money</h3>
                  <p className="text-muted-foreground">
                    Set your own price and earn extra income from your spare
                    space
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Shield className="size-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    Host with confidence
                  </h3>
                  <p className="text-muted-foreground">
                    Get $1M USD in property damage protection and 24/7 support
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Home className="size-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    Your space, your rules
                  </h3>
                  <p className="text-muted-foreground">
                    Decide when you're available and how you want to host
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <Button
                size="lg"
                className="rounded-full bg-primary px-8 py-3 text-primary-foreground hover:bg-primary/90"
                asChild
              >
                <Link href="/become-host">
                  Try hosting
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Image/Visual */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 lg:aspect-square">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Home className="mx-auto size-16 text-primary" />
                <p className="mt-4 text-lg font-medium text-foreground">
                  Start your hosting journey
                </p>
                <p className="text-sm text-muted-foreground">
                  Join millions of hosts worldwide
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
