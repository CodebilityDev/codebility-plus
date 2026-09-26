export type ApiOk<T> = { ok: true; data: T };

export type ApiFail = { ok: false; error: string; status?: number };

export type ApiResult<T> = ApiOk<T> | ApiFail;

export type NextFetchRequestConfig = {
  revalidate?: number | false;
  tags?: string[];
};

export type FetchApiInit = RequestInit & {
  next?: NextFetchRequestConfig;
  cache?: RequestCache;
};

export interface RateLimitEntry {
  attempts: number;
  resetAt: number;
}
