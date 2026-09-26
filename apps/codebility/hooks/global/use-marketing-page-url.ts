"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

function readPageParam(param: string, fallback: number): number {
  if (typeof window === "undefined") {
    return fallback;
  }

  const raw = new URLSearchParams(window.location.search).get(param);
  const parsed = Number.parseInt(raw ?? "", 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
}

function buildPathWithPage(
  pathname: string,
  currentSearch: string,
  param: string,
  page: number,
  defaultPage = 1,
): string {
  const params = new URLSearchParams(currentSearch);

  if (page <= defaultPage) {
    params.delete(param);
  } else {
    params.set(param, String(page));
  }

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

/**
 * Keeps ?page= in sync with client pagination state.
 * Uses history.replaceState so Next.js searchParams (and Suspense) are not
 * re-triggered on every page change.
 */
export function useMarketingPageUrl(
  page: number,
  setPage: (page: number) => void,
  options?: { param?: string; defaultPage?: number },
) {
  const pathname = usePathname();
  const param = options?.param ?? "page";
  const defaultPage = options?.defaultPage ?? 1;
  const hydratedRef = useRef(false);
  const setPageRef = useRef(setPage);

  setPageRef.current = setPage;

  useEffect(() => {
    if (hydratedRef.current) {
      return;
    }

    hydratedRef.current = true;
    const urlPage = readPageParam(param, defaultPage);

    if (urlPage !== page) {
      setPageRef.current(urlPage);
    }
  }, [defaultPage, page, param]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const next = buildPathWithPage(
      pathname,
      window.location.search,
      param,
      page,
      defaultPage,
    );
    const current = `${window.location.pathname}${window.location.search}`;

    if (next !== current) {
      window.history.replaceState(window.history.state, "", next);
    }
  }, [defaultPage, page, param, pathname]);

  useEffect(() => {
    const onPopState = () => {
      setPageRef.current(readPageParam(param, defaultPage));
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [defaultPage, param]);
}
