export type Page<T> = {
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
  /**
   * When the server produced this page, as epoch ms. The client seeds its query
   * cache with `rows` and must know how old that seed is: without this it either
   * treats the seed as fresh forever (stale filters) or as instantly stale (a
   * pointless refetch of data already on screen).
   */
  fetchedAt: number;
};

export type PageArgs = {
  page?: number;
  pageSize?: number;
};

export const DEFAULT_PAGE_SIZE = 50;

export const resolvePageArgs = ({ page, pageSize }: PageArgs = {}) => {
  const size = Math.min(Math.max(Math.trunc(pageSize ?? DEFAULT_PAGE_SIZE), 1), 100);
  const current = Math.max(Math.trunc(page ?? 1), 1);
  return { page: current, pageSize: size, from: (current - 1) * size, to: current * size - 1 };
};

export const toPage = <T>(
  rows: T[] | null,
  total: number | null,
  page: number,
  pageSize: number,
): Page<T> => ({
  rows: rows ?? [],
  total: total ?? 0,
  page,
  pageSize,
  fetchedAt: Date.now(),
});
