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

export function parseServicesCategory(
  value: string | string[] | undefined | null,
): ServicesCategorySlug {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw || raw === "all") return "all";
  if (
    (SERVICES_CATEGORY_SLUGS as readonly string[]).includes(raw) &&
    raw !== "all"
  ) {
    return raw as ServicesCategorySlug;
  }
  return "all";
}

export function servicesHref(options?: {
  category?: ServicesCategorySlug | null;
  project?: string | null;
}): string {
  const params = new URLSearchParams();
  const category = options?.category ?? "all";
  if (category !== "all") params.set("category", category);
  if (options?.project) params.set("project", options.project);
  const query = params.toString();
  return query ? `/services?${query}` : "/services";
}

export function categoryHref(slug: ServicesCategorySlug): string {
  return servicesHref({ category: slug });
}
