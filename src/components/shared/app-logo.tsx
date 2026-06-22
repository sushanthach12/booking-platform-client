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
      {/* <Image
        src={"/icon/app_logo.png"}
        alt="App Logo"
        width={28}
        height={28}
        className="rounded-full shrink-0"
      /> */}
      <span
        className={cn(
          "pl-1 text-2xl font-extrabold",
          light ? "text-white" : "text-foreground",
        )}
        style={{ letterSpacing: "-0.045em" }}
      >
        stayly
      </span>
    </Link>
  );
};

export default AppLogo;
