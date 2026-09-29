import type { ServicesCategorySlug } from "@/types/global/constants";
export const SERVICES_CATEGORY_SLUGS = [
  "all",
  "web-application",
  "mobile-application",
  "product-design",
  "ai-development",
  "cms",
] as const;

export const SERVICES_CATEGORY_TABS: {
  slug: ServicesCategorySlug;
  label: string;
}[] = [
  { slug: "all", label: "All" },
  { slug: "web-application", label: "Web Application" },
  { slug: "mobile-application", label: "Mobile Application" },
  { slug: "product-design", label: "Product Design" },
  { slug: "ai-development", label: "AI Development" },
  { slug: "cms", label: "CMS" },
];
