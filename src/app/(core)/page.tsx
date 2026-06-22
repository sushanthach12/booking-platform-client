import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HomeSections } from "@/components/sections/home-sections";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* 1. Header */}
      <Header />

      {/* 2-5. Hero + data rails — fetched client-side (see HomeSections). The
          API's CDN blocks server-to-server requests from the deploy host, so
          the homepage data is loaded in the browser instead. */}
      <main className="flex-1">
        <HomeSections />
      </main>

      {/* 6. Footer */}
      <Footer />
    </div>
  );
}
