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
