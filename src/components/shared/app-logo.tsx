import Link from "next/link";
import { cn } from "@/lib/utils";

interface AppLogoProps {
  /** When true, logo text uses white (e.g. over dark/hero background). Default false. */
  light?: boolean;
  className?: string;
}

const AppLogo = ({ light = false, className }: AppLogoProps) => {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 text-xl font-semibold transition-colors",
        light ? "text-white hover:text-white/90" : "text-foreground",
        className,
      )}
      aria-label="Home"
    >
      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shrink-0">
        <span className="text-white font-bold">B</span>
      </div>
      <span className="hidden sm:inline text-2xl">booking</span>
    </Link>
  );
};

export default AppLogo;
