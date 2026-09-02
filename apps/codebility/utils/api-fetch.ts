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

function errorMessageFromBody(body: unknown, fallback: string): string {
  if (typeof body === "string" && body.trim()) return body;
  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    if (typeof record.error === "string") return record.error;
    if (typeof record.message === "string") return record.message;
  }
  return fallback;
}

function resolveFetchInput(input: RequestInfo | URL): RequestInfo | URL {
  if (typeof input !== "string" || !input.startsWith("/")) return input;
  if (typeof window !== "undefined") return input;

  const base =
    process.env.NEXT_PUBLIC_APP_BASE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    "http://localhost:3000";

  return `${base.replace(/\/$/, "")}${input}`;
}

export async function parseApiJson<T>(
  response: Response,
): Promise<ApiResult<T>> {
  let body: unknown = null;

  try {
    const text = await response.text();
    body = text ? JSON.parse(text) : null;
  } catch {
    return {
      ok: false,
      error: `Invalid JSON (${response.status})`,
      status: response.status,
    };
  }

  if (!response.ok) {
    return {
      ok: false,
      error: errorMessageFromBody(
        body,
        `Request failed (${response.status})`,
      ),
      status: response.status,
    };
  }

  return { ok: true, data: body as T };
}

export async function fetchApiJson<T>(
  input: RequestInfo | URL,
  init?: FetchApiInit,
): Promise<ApiResult<T>> {
  try {
    const response = await fetch(resolveFetchInput(input), init);
    return parseApiJson<T>(response);
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}
