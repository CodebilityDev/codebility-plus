export type Page<T> = {
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
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
});
