import { SERVICES_CATEGORY_SLUGS } from "@/constants/global/services-categories";
import type { ServicesCategorySlug } from "@/types/global/constants";

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
  page?: number;
}): string {
  const params = new URLSearchParams();
  const category = options?.category ?? "all";
  if (category !== "all") params.set("category", category);
  if (options?.page && options.page > 1) params.set("page", String(options.page));
  if (options?.project) params.set("project", options.project);
  const query = params.toString();
  return query ? `/services?${query}` : "/services";
}

export function categoryHref(slug: ServicesCategorySlug): string {
  return servicesHref({ category: slug });
}
