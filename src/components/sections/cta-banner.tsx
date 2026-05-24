import { Separator } from "@/components/ui/separator";
import { CalendarCheck, DollarSign, Headphones, Percent } from "lucide-react";

const HOST_STATS = [
  {
    icon: DollarSign,
    value: "$2,400",
    label: "Avg. monthly earnings",
  },
  {
    icon: CalendarCheck,
    value: "3 days",
    label: "To get first booking",
  },
  {
    icon: Percent,
    value: "0% fees",
    label: "First 3 months free",
  },
  {
    icon: Headphones,
    value: "24/7",
    label: "Dedicated host support",
  },
] as const;

export function CtaBanner() {
  return (
    <section className="py-16 px-6 lg:px-10">
      <div
        className="max-w-290 mx-auto rounded-3xl overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #1B3D52 0%, #25567A 40%, #2E6E94 75%, #3D7EA0 100%)",
        }}
      >
        {/* Subtle texture overlay */}
        <div
          className="pointer-events-none opacity-[0.04] hidden"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 80%, #C4956A 0%, transparent 50%), radial-gradient(circle at 80% 20%, #EAF3F9 0%, transparent 50%)",
          }}
        />

        <div className="relative px-10 py-14 lg:px-16 lg:py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: copy */}
          <div>
            {/* Pill */}
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6 border border-white/15">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C4956A] block shrink-0" />
              <span className="text-[11px] font-bold text-white/80 uppercase tracking-[0.8px]">
                For hosts
              </span>
            </div>

            {/* Headline */}
            <h2
              className="text-[clamp(28px,3.5vw,42px)] leading-[1.15] text-white mb-4"
              style={{ letterSpacing: "-0.5px" }}
            >
              Your space could earn
              <br />
              <em
                style={{ color: "#C4DFF0" }}
              >
                while you&apos;re away
              </em>
            </h2>

            <p className="text-white/65 text-[15px] leading-[1.7] max-w-90">
              Join thousands of hosts earning on their own terms — no long-term
              commitments, full calendar control.
            </p>

            {/* TODO: Become a host CTAs — disabled, will improve in future */}
          </div>

          {/* Right: stats 2×2 */}
          <div className="grid grid-cols-2 gap-3">
            {HOST_STATS.map(({ icon: Icon, value, label }, i) => (
              <div
                key={label}
                className="rounded-2xl p-5 border border-white/10 flex flex-col gap-3"
                style={{ background: "rgba(255,255,255,0.07)" }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "rgba(196,149,106,0.22)" }}
                >
                  <Icon className="size-4 text-[#C4956A]" />
                </div>
                <div>
                  <div
                    className="text-[26px] font-bold text-white"
                    style={{ letterSpacing: "-0.5px" }}
                  >
                    {value}
                  </div>
                  <div className="text-[12px] text-white/55 leading-normal mt-0.5">
                    {label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom strip */}
        <div className="border-t border-white/8 px-10 lg:px-16 py-4 flex flex-wrap items-center gap-x-8 gap-y-2">
          {[
            "No long-term commitment",
            "Full calendar control",
            "Instant payouts",
          ].map((item, i) => (
            <div key={item} className="flex items-center gap-5">
              <span className="text-[12px] text-white/50 font-medium">
                {item}
              </span>
              {i < 2 && (
                <Separator
                  orientation="vertical"
                  className="hidden sm:block h-3 bg-white/15"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
