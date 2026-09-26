import type { LevelMap } from "@/types/marketing/profiles/profiles";

export function getFilteredLevel(level?: LevelMap): LevelMap {
  if (!level) return {};

  return Object.fromEntries(
    Object.entries(level).filter(([_, value]) => value > 0),
  );
}

export function pageCacheKey(position: string, page: number, pageSize: number) {
  return `${position}:${page}:${pageSize}`;
}

export function filterCacheKey(position: string, pageSize: number) {
  return `${position}:${pageSize}`;
}
