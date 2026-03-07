// ─────────────────────────────────────────────────────────────────
// components/sections/why-us-section.tsx
// ─────────────────────────────────────────────────────────────────
import { Compass, Star, Clock, Users } from "lucide-react";

const FEATURES = [
  {
    icon: Compass,
    color: "bg-violet-50 text-violet-500",
    title: "Curated by experts",
    description:
      "Our travel specialists handpick every property. No spam listings, no surprises — just exceptional places.",
  },
  {
    icon: Star,
    color: "bg-amber-50 text-amber-500",
    title: "Genuine reviews",
    description:
      "Only verified guests can leave reviews. What you read is exactly what you'll experience.",
  },
  {
    icon: Clock,
    color: "bg-sky-50 text-sky-500",
    title: "Instant confirmation",
    description:
      "Most properties confirm within minutes. Plan your trip with certainty, not uncertainty.",
  },
  {
    icon: Users,
    color: "bg-emerald-50 text-emerald-500",
    title: "Group-friendly",
    description:
      "From solo escapes to family reunions — find spaces that fit every group size and travel style.",
  },
] as const;

export function WhyUsSection() {
  return (
    <section className="py-20 px-6 lg:px-24 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute top-0 left-1/4 size-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 size-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-rose-400 mb-2">Why choose us</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Travel smarter, stay better
          </h2>
          <p className="mt-4 text-slate-400 text-lg max-w-xl mx-auto">
            We built the platform we always wished existed — transparent, personal, and genuinely helpful.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(({ icon: Icon, color, title, description }) => (
            <div
              key={title}
              className="bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200 group"
            >
              <div className={`size-11 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="size-5" />
              </div>
              <div>
                <div className="font-semibold text-white mb-1.5 group-hover:text-rose-300 transition-colors">
                  {title}
                </div>
                <div className="text-slate-400 text-sm leading-relaxed">{description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
