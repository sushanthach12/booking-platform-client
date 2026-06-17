export type DestTheme = "image-hero" | "image" | "image-left" | "image-right" | "sand" | "forest" | "amber";

export interface Destination {
  city: string;
  region: string;
  regionTag: string;
  slug: string;
  fromPrice: number;
  coverImage: string | null;
  label: string;
  sublabel?: string;
  span: { col: number; row: number };
  theme: DestTheme;
  showPrice?: boolean;
}

export const DESTINATIONS: Destination[] = [
  {
    city: "Goa",
    region: "Coastal",
    regionTag: "GOA · COASTAL",
    slug: "goa",
    fromPrice: 4200,
    coverImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80",
    label: "North Goa, slow",
    sublabel: "villas · homestays",
    span: { col: 6, row: 3 },
    theme: "image-hero",
    showPrice: true,
  },
  {
    city: "Jaipur",
    region: "Rajasthan",
    regionTag: "RAJASTHAN · HERITAGE",
    slug: "jaipur",
    fromPrice: 3800,
    coverImage: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80",
    label: "Jaipur",
    span: { col: 3, row: 2 },
    theme: "image",
  },
  {
    city: "Udaipur",
    region: "Rajasthan",
    regionTag: "RAJASTHAN · LAKES",
    slug: "udaipur",
    fromPrice: 5500,
    coverImage: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80",
    label: "Udaipur",
    span: { col: 3, row: 2 },
    theme: "image",
  },
  {
    city: "Pondicherry",
    region: "Tamil Nadu",
    regionTag: "TAMIL NADU · FRENCH",
    slug: "pondicherry",
    fromPrice: 2800,
    coverImage: null,
    label: "Pondicherry",
    span: { col: 3, row: 1 },
    theme: "sand",
  },
  {
    city: "Ladakh",
    region: "Himalayan",
    regionTag: "LADAKH · MOUNTAINS",
    slug: "ladakh",
    fromPrice: 3200,
    coverImage: null,
    label: "Leh & Nubra",
    span: { col: 3, row: 1 },
    theme: "forest",
  },
  {
    city: "Alleppey",
    region: "Kerala",
    regionTag: "KERALA · BACKWATERS",
    slug: "alleppey",
    fromPrice: 3600,
    coverImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&q=80",
    label: "Alleppey",
    span: { col: 4, row: 1 },
    theme: "image-left",
  },
  {
    city: "Coorg",
    region: "Karnataka",
    regionTag: "KARNATAKA · COFFEE HILLS",
    slug: "coorg",
    fromPrice: 2900,
    coverImage: null,
    label: "Coorg & Chikmagalur",
    span: { col: 4, row: 1 },
    theme: "amber",
  },
  {
    city: "Rishikesh",
    region: "Uttarakhand",
    regionTag: "UTTARAKHAND · GANGES",
    slug: "rishikesh",
    fromPrice: 2400,
    coverImage: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=900&q=80",
    label: "Rishikesh",
    span: { col: 4, row: 1 },
    theme: "image-right",
  },
];
