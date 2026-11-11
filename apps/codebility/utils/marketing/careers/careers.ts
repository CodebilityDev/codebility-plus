export { applicationSchema } from "@/utils/global/job-application";

export function careersHref(
  filters: { department?: string; type?: string; level?: string },
  page = 1,
): string {
  const params = new URLSearchParams();
  if (filters.department) params.set("department", filters.department);
  if (filters.type) params.set("type", filters.type);
  if (filters.level) params.set("level", filters.level);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/careers?${query}` : "/careers";
}

export function pageCacheKey(
  department: string,
  type: string,
  level: string,
  page: number,
  pageSize: number,
) {
  return `${department}:${type}:${level}:${page}:${pageSize}`;
}

export function filterCacheKey(
  department: string,
  type: string,
  level: string,
  pageSize: number,
) {
  return `${department}:${type}:${level}:${pageSize}`;
}

export function getLevelColor(level: string) {
  switch (level) {
    case "Entry":
      return "bg-green-500/10 text-green-400 border-green-500/20";
    case "Mid":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "Senior":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "Lead":
      return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
}

export function getTypeColor(type: string) {
  switch (type) {
    case "Full-time":
      return "bg-customTeal/10 text-customTeal border-customTeal/20";
    case "Part-time":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    case "Contract":
      return "bg-pink-500/10 text-pink-400 border-pink-500/20";
    case "Internship":
      return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
}
