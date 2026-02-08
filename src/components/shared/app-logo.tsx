import Link from "next/link";

const AppLogo = () => {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 text-xl font-semibold text-foreground"
      aria-label="Home"
    >
      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
        <span className="text-white font-bold">B</span>
      </div>
      <span className="hidden sm:inline text-2xl">booking</span>
    </Link>
  );
};

export default AppLogo;
