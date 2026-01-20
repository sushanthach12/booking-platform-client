import { PropertyListingTemplate } from "@/components/property";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1>Welcome to Booking Platform</h1>
      <PropertyListingTemplate />
    </div>
  );
}

