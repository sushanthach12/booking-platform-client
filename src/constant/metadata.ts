import { Metadata } from 'next';

export const BASE_METADATA: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://stayly.sushanthh.com',
  ),

  // Title template: child pages set title: "Santorini Villas" → renders as
  // "Santorini Villas | Stayly"
  title: {
    default: 'Stayly | Find Your Perfect Place to Stay',
    template: '%s | Stayly',
  },

  description:
    'Search 150,000+ verified homes, villas, and boutique hotels worldwide. Instant confirmation, best price guarantee, 24/7 support.',

  keywords: [
    'vacation rentals',
    'hotel booking',
    'holiday accommodation',
    'villas',
    'boutique hotels',
    'short-term rentals',
  ],

  authors: [{ name: 'Stayly' }],

  // Canonical URL handled per-page via alternates.canonical — root default:
  alternates: {
    canonical: '/',
  },

  openGraph: {
    type: 'website',
    siteName: 'Stayly',
    title: 'Stayly | Find Your Perfect Place to Stay',
    description:
      'Search 150,000+ verified homes, villas, and boutique hotels worldwide.',
    url: '/',
    images: [
      {
        url: '/og-image.png', // 1200×630, place in /public
        width: 1200,
        height: 630,
        alt: 'Stayly | Find Your Perfect Place to Stay',
      },
    ],
    locale: 'en_US',
  },

  twitter: {
    card: 'summary_large_image',
    site: '@stayly', // update to real handle
    creator: '@stayly',
    title: 'Stayly | Find Your Perfect Place to Stay',
    description:
      'Search 150,000+ verified homes, villas, and boutique hotels worldwide.',
    images: ['/og-image.png'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
