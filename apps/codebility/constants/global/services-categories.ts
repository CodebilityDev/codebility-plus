export const SERVICES_CATEGORY_SLUGS = [
  "all",
  "web-application",
  "mobile-application",
  "product-design",
  "ai-development",
  "cms",
] as const;

export type ServicesCategorySlug = (typeof SERVICES_CATEGORY_SLUGS)[number];

export const SERVICES_CATEGORY_TABS: Array<{
  slug: ServicesCategorySlug;
  label: string;
}> = [
  { slug: "all", label: "All" },
  { slug: "web-application", label: "Web Application" },
  { slug: "mobile-application", label: "Mobile Application" },
  { slug: "product-design", label: "Product Design" },
  { slug: "ai-development", label: "AI Development" },
  { slug: "cms", label: "CMS" },
];
