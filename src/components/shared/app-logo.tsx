import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
      <Image
        src={"/icon/app_logo.png"}
        alt="App Logo"
        width={28}
        height={28}
        className="rounded-full shrink-0"
      />
      <span
        className={cn(
          "hidden pl-1 sm:inline text-2xl uppercase font-bold tracking-tighter",
          light ? "text-white" : "text-primary",
        )}
      >
        stayly
      </span>
    </Link>
  );
};

export default AppLogo;
