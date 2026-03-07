// ─────────────────────────────────────────────────────────────────
// components/sections/featured-destinations.tsx
// ─────────────────────────────────────────────────────────────────
import Link from "next/link";

const DESTINATIONS = [
  {
    name: "Santorini",
    country: "Greece",
    properties: "240+ stays",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
    span: "col-span-2 row-span-2",
  },
  {
    name: "Kyoto",
    country: "Japan",
    properties: "180+ stays",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
    span: "col-span-1",
  },
  {
    name: "Amalfi Coast",
    country: "Italy",
    properties: "320+ stays",
    image:
      "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?auto=format&fit=crop&w=600&q=80",
    span: "col-span-1",
  },
  {
    name: "Bali",
    country: "Indonesia",
    properties: "510+ stays",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80",
    span: "col-span-1",
  },
  {
    name: "Maldives",
    country: "Indian Ocean",
    properties: "95+ stays",
    image:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80",
    span: "col-span-1",
  },
] as const;

export function FeaturedDestinations() {
  return (
    <section className="py-20 px-6 lg:px-24">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-rose-500 mb-2">
              Top picks
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Popular destinations
            </h2>
          </div>
          <Link
            href="/search"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-rose-500 transition-colors"
          >
            View all →
          </Link>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 grid-rows-2 gap-3 h-[480px]">
          {DESTINATIONS.map((dest) => (
            <Link
              key={dest.name}
              href={`/search?location=${encodeURIComponent(dest.name)}`}
              className={`relative rounded-2xl overflow-hidden group cursor-pointer ${dest.span}`}
            >
              {/* Image */}
              <img
                src={dest.image}
                alt={dest.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
              {/* Text */}
              <div className="absolute bottom-0 left-0 p-4">
                <div className="text-white font-bold text-lg leading-tight">{dest.name}</div>
                <div className="text-white/70 text-sm">{dest.country}</div>
                <div className="mt-1.5 inline-block text-[11px] font-semibold text-white/90 bg-white/15 backdrop-blur-sm rounded-full px-2.5 py-0.5 border border-white/20">
                  {dest.properties}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
