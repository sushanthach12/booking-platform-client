"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GuestProfile } from "@/domain/entities";
import { cn } from "@/lib/utils";
import {
  DollarSign,
  Globe,
  Mail,
  Moon,
  Phone,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

interface Stats {
  totalTrips: number;
  countriesVisited: number;
  nightsStayed: number;
  totalSpent: number;
}

interface StatsSidebarProps {
  stats: Stats;
  profile: GuestProfile;
}

function StatCard({
  icon: Icon,
  value,
  label,
  accent = false,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl p-4 flex flex-col gap-1.5",
        accent ? "bg-rose-500 text-white" : "bg-slate-50 border border-slate-100",
      )}
    >
      <Icon className={cn("size-4", accent ? "text-white/80" : "text-slate-400")} />
      <div className={cn("text-2xl font-bold tracking-tight", accent ? "text-white" : "text-slate-900")}>
        {value}
      </div>
      <div className={cn("text-xs font-medium", accent ? "text-white/70" : "text-slate-500")}>
        {label}
      </div>
    </div>
  );
}

export function StatsSidebar({ stats, profile }: StatsSidebarProps) {
  return (
    <div className="space-y-5 lg:sticky lg:top-24">
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
          Travel stats
        </h2>
        <div className="grid grid-cols-2 gap-2.5">
          <StatCard icon={TrendingUp} value={String(stats.totalTrips)} label="Total trips" accent />
          <StatCard icon={Globe} value={String(stats.countriesVisited)} label="Countries" />
          <StatCard icon={Moon} value={String(stats.nightsStayed)} label="Nights stayed" />
          <StatCard
            icon={DollarSign}
            value={`$${(stats.totalSpent / 1000).toFixed(1)}k`}
            label="Total spent"
          />
        </div>
      </div>

      <Separator className="bg-slate-100" />

      <Card className="rounded-2xl border-slate-100 shadow-none bg-white">
        <CardContent className="pt-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Contact info
          </h3>
          <div className="space-y-2.5">
            <div className="flex items-center gap-3 text-sm">
              <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                <Mail className="size-3.5 text-slate-400" />
              </div>
              <span className="text-slate-700 truncate">{profile.email}</span>
            </div>
            {profile.phone && (
              <div className="flex items-center gap-3 text-sm">
                <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                  <Phone className="size-3.5 text-slate-400" />
                </div>
                <span className="text-slate-700">{profile.phone}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="rounded-2xl bg-linear-to-br from-slate-900 to-slate-800 p-5 text-white">
        <p className="font-bold text-sm mb-1">Become a host</p>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Share your space and earn extra income with Stayly.
        </p>
        <Button
          asChild
          size="sm"
          className="w-full rounded-xl bg-white text-slate-900 hover:bg-slate-50 font-semibold text-xs"
        >
          <Link href="/become-host">Get started</Link>
        </Button>
      </div>
    </div>
  );
}
