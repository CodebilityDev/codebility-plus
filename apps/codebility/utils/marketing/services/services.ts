import type { ServicesCategorySlug } from "@/types/global/constants";
import { defaultAvatar } from "@/public/assets/images/index";

export function formatDate(dateString?: string) {
  if (!dateString) return "Not specified";
  return new Date(dateString).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export function getImageUrl(mainImage?: string) {
  if (mainImage) {
    return mainImage.startsWith("public")
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/services-image/${mainImage}`
      : mainImage;
  }
  return defaultAvatar;
}

export function pageCacheKey(
  category: ServicesCategorySlug,
  page: number,
  pageSize: number,
) {
  return `${category}:${page}:${pageSize}`;
}

export function filterCacheKey(category: ServicesCategorySlug, pageSize: number) {
  return `${category}:${pageSize}`;
}

export function resolveSkeletonCount(
  page: number,
  pageSize: number,
  total: number,
) {
  if (total <= 0) {
    return pageSize;
  }

  const remaining = total - (page - 1) * pageSize;
  return Math.min(pageSize, Math.max(1, remaining));
}
