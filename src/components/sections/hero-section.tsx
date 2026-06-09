"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Star, Zap } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

const HERO_CARDS = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80",
    alt: "Beachside house",
    location: "Bondi Beach · House",
    name: "Bondi Beachside House",
    price: "$189",
    meta: "★ 4.7 · 203 reviews",
    badge: null,
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
    alt: "City penthouse",
    location: "Melbourne · Penthouse",
    name: "Inner City Penthouse",
    price: "$310",
    meta: "★ 4.9 · 87 reviews",
    badge: "Superhost",
  },
] as const;

const TRUST_STATS = [
  ["10K+", "Properties"],
  ["4.8 ★", "Avg. rating"],
  ["50+", "Cities"],
] as const;

const SHADOW_BASE =
  "0 2px 4px rgba(0,0,0,0.04), 0 8px 16px rgba(0,0,0,0.08), 0 24px 48px rgba(0,0,0,0.12), 0 40px 80px rgba(61,111,142,0.16)";
const SHADOW_HOVER =
  "0 4px 8px rgba(0,0,0,0.06), 0 14px 28px rgba(0,0,0,0.11), 0 36px 72px rgba(0,0,0,0.13), 0 60px 110px rgba(61,111,142,0.22)";
const SHADOW_BASE2 =
  "0 2px 4px rgba(0,0,0,0.04), 0 8px 16px rgba(0,0,0,0.08), 0 20px 40px rgba(0,0,0,0.12), 0 36px 72px rgba(61,111,142,0.16)";
const SHADOW_HOVER2 =
  "0 4px 8px rgba(0,0,0,0.06), 0 14px 28px rgba(0,0,0,0.11), 0 32px 64px rgba(0,0,0,0.13), 0 52px 96px rgba(61,111,142,0.22)";
const SHADOW_BADGE =
  "0 2px 4px rgba(0,0,0,0.04), 0 6px 12px rgba(0,0,0,0.07), 0 16px 32px rgba(61,111,142,0.13)";
const SHADOW_BADGEH =
  "0 4px 8px rgba(0,0,0,0.06), 0 10px 20px rgba(0,0,0,0.10), 0 24px 48px rgba(61,111,142,0.20)";

const SPRING = { type: "spring", stiffness: 280, damping: 20 } as const;

const EASE_OUT = "easeOut" as const;

function fadeUpProps(delay = 0) {
  return {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, ease: EASE_OUT, delay },
  };
}

export function HeroSection() {
  return (
    <section className="relative pt-16 pb-14 overflow-hidden bg-white">
      {/* Content */}
      <div className="relative z-10 max-w-310 mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-[54%_46%] gap-10 items-center">
        {/* Left: Headline + Search + Stats */}
        <div>
          {/* Trust pill */}
          <motion.div {...fadeUpProps(0)}>
            <Badge
              variant="outline"
              className="inline-flex items-center gap-2 bg-white/70 border-[#D6C4A8]/60 text-[#8A6F4E] rounded-full px-4 py-1.5 mb-7 text-[11px] font-bold uppercase tracking-[0.7px] shadow-sm backdrop-blur-sm"
            >
              <span className="w-2 h-2 rounded-full bg-[#C4956A] block shrink-0" />
              500+ verified properties
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            {...fadeUpProps(0.08)}
            className="text-[clamp(36px,5vw,58px)] leading-[1.08] text-foreground mb-5"
            style={{ letterSpacing: "-1.5px" }}
          >
            Stay somewhere
            <br />
            <em className="text-primary">you&apos;ll come back to</em>
          </motion.h1>

          <motion.p
            {...fadeUpProps(0.16)}
            className="text-muted-foreground text-base leading-[1.65] mb-9 max-w-100"
          >
            Hand-picked properties from trusted hosts. Book direct with zero
            hidden fees.
          </motion.p>

          {/* Trust stats */}
          <motion.div
            {...fadeUpProps(0.32)}
            className="flex items-center gap-0 mt-7 pl-0.5"
          >
            {TRUST_STATS.map(([value, label], i) => (
              <div key={label} className="flex items-center">
                <div className="px-5 first:pl-0">
                  <div className="text-[18px] font-bold text-foreground tracking-tight">
                    {value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {label}
                  </div>
                </div>
                {i < TRUST_STATS.length - 1 && (
                  <Separator
                    orientation="vertical"
                    className="h-8 bg-border/60"
                  />
                )}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: Floating cards */}
        <div className="relative h-120 hidden lg:block" aria-hidden>
          {/* Warm blob behind cards */}
          <div
            className="absolute top-4 right-4 w-80 h-80 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(210,175,130,0.18) 0%, rgba(61,111,142,0.08) 60%, transparent 80%)",
              filter: "blur(32px)",
            }}
          />

          {/* Card 1 — top right */}
          <motion.div
            className="absolute top-0 right-0 w-68 rounded-2xl overflow-hidden ring-[3px] ring-white z-10 bg-white cursor-default"
            style={{ boxShadow: SHADOW_BASE }}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
              delay: 0.35,
            }}
            whileHover={{ scale: 1.02, y: -4, boxShadow: SHADOW_HOVER }}
          >
            <div className="h-46 relative overflow-hidden">
              <Image
                src={HERO_CARDS[0].image}
                alt={HERO_CARDS[0].alt}
                fill
                className="object-cover"
                sizes="272px"
              />
            </div>
            <div className="px-4 py-3.5">
              <div className="text-[11px] text-muted-subtle mb-1">
                {HERO_CARDS[0].location}
              </div>
              <div className="text-[15px] font-semibold text-foreground">
                {HERO_CARDS[0].name}
              </div>
              <div className="flex justify-between items-center mt-2.5">
                <span className="text-[16px] font-bold text-primary">
                  {HERO_CARDS[0].price}
                  <span className="text-xs font-normal text-muted-subtle">
                    /night
                  </span>
                </span>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Star className="size-3 fill-amber-400 stroke-amber-400" />
                  4.7 · 203
                </span>
              </div>
            </div>
          </motion.div>

          {/* Card 2 — lower left */}
          <motion.div
            className="absolute top-48.75 left-2.5 w-62 rounded-2xl overflow-hidden ring-[3px] ring-white z-20 bg-white cursor-default"
            style={{ boxShadow: SHADOW_BASE2 }}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
              delay: 0.5,
            }}
            whileHover={{ scale: 1.02, y: -4, boxShadow: SHADOW_HOVER2 }}
          >
            <div className="h-41 relative overflow-hidden">
              <Image
                src={HERO_CARDS[1].image}
                alt={HERO_CARDS[1].alt}
                fill
                className="object-cover"
                sizes="248px"
              />
            </div>
            <div className="px-4 py-3.5">
              <div className="text-[11px] text-muted-subtle mb-1">
                {HERO_CARDS[1].location}
              </div>
              <div className="text-[15px] font-semibold text-foreground">
                {HERO_CARDS[1].name}
              </div>
              <div className="flex justify-between items-center mt-2.5">
                <span className="text-[16px] font-bold text-primary">
                  {HERO_CARDS[1].price}
                  <span className="text-xs font-normal text-muted-subtle">
                    /night
                  </span>
                </span>
                {HERO_CARDS[1].badge && (
                  <Badge className="text-[11px] bg-primary-subtle text-primary border-0 px-2.5 py-1 rounded-full font-bold shadow-none">
                    {HERO_CARDS[1].badge}
                  </Badge>
                )}
              </div>
            </div>
          </motion.div>

          {/* Instant Book badge */}
          <motion.div
            className="absolute bottom-8 right-2 bg-white rounded-xl px-4 py-3 border border-border flex items-center gap-2.5 z-30 cursor-default"
            style={{ boxShadow: SHADOW_BADGE }}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
              delay: 0.65,
            }}
            whileHover={{ scale: 1.03, y: -3, boxShadow: SHADOW_BADGEH }}
          >
            <div className="w-9 h-9 rounded-lg bg-primary-subtle flex items-center justify-center shrink-0">
              <Zap className="size-4 text-primary fill-primary/20" />
            </div>
            <div>
              <div className="text-[12px] font-bold text-foreground">
                Instant Book
              </div>
              <div className="text-[11px] text-muted-subtle mt-0.5">
                Confirm in seconds
              </div>
            </div>
          </motion.div>

          {/* Review snippet */}
          <motion.div
            className="absolute top-9.5 left-0 bg-white rounded-xl px-3.5 py-2.5 border border-border flex items-center gap-2.5 z-30 cursor-default"
            style={{ boxShadow: SHADOW_BADGE }}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
              delay: 0.75,
            }}
          >
            <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
            <div>
              <div className="text-[11px] font-bold text-foreground">
                Verified host
              </div>
              <div className="text-[10px] text-muted-subtle">
                ID &amp; background checked
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
