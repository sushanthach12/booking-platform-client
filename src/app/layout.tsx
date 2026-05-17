import { ReduxProvider } from "@/components/providers/redux-provider";
import { BASE_METADATA } from "@/constant/metadata";
import type { Metadata } from "next";
import { Fraunces, Poppins } from "next/font/google";
import { Toaster } from "sonner";
import "../lib/utils/reflect-metadata";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "600", "700"],
});
const sans = Poppins({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  ...BASE_METADATA,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${sans.variable} ${sans.className} antialiased`}
      >
        <ReduxProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </ReduxProvider>
      </body>
    </html>
  );
}
