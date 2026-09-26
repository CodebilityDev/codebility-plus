export function parsePositiveInt(
  value: string | null,
  fallback: number,
  max?: number,
): number {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  if (max !== undefined) return Math.min(parsed, max);
  return parsed;
}

export function emptyPage(
  department: string,
  type: string,
  level: string,
  page: number,
  limit: number,
) {
  return {
    jobs: [],
    pagination: { page, limit, total: 0, totalPages: 0 },
    department,
    type,
    level,
  };
}
