// ─────────────────────────────────────────────────────────────────
// components/sections/cta-banner.tsx
// ─────────────────────────────────────────────────────────────────
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <section className="py-20 px-6 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-linear-to-r from-rose-500 via-orange-500 to-amber-400 p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 size-64 bg-white/10 rounded-full pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 size-48 bg-black/10 rounded-full pointer-events-none" />

          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-3">
              Ready to start exploring?
            </h2>
            <p className="text-white/80 text-lg max-w-lg">
              Join over 2 million travellers who&apos;ve found their perfect stay. Your next adventure is just a search away.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-3 shrink-0">
            <Link href="/search">
              <Button className="bg-white text-rose-600 hover:bg-white/90 font-bold px-7 h-12 rounded-xl shadow-lg gap-2">
                Browse properties
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
