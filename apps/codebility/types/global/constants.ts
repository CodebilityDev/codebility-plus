import type { SERVICES_CATEGORY_SLUGS } from "@/constants/global/services-categories";
// Define types for each dataset
export interface AboutUsData {
  id: string;
  title: string;
  href: string;
}

export interface ConnectUsData {
  id: string;
  href: string;
  icon: React.FC<React.SVGProps<SVGElement>>;
}

export interface FeaturedSectionData {
  title: string;
  description: string;
  src: string;
  alt: string;
}

export interface ServicesCard {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
}

export interface MarketingCard {
  title: string;
  description: string;
  url: string;
  category?: string;
}

export interface Service {
  id: string;
  title: string;
  starColor: "violet" | "teal"; // Limited to specific colors
}

export type ServicesCategorySlug = (typeof SERVICES_CATEGORY_SLUGS)[number];
