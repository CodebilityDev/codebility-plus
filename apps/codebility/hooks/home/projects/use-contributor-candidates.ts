import { useCallback, useEffect, useRef, useState } from "react";

import { searchContributorCandidates } from "@/actions/home/projects/contributors";
import type { ContributorCandidate } from "@/types/home/projects/projects";

const DEBOUNCE_MS = 300;
const CACHE_TTL_MS = 5 * 60 * 1000;

const cache = new Map<
  string,
  { page: number; rows: ContributorCandidate[]; hasMore: boolean; at: number }
>();

interface CandidateEntry {
  term: string;
  page: number;
  rows: ContributorCandidate[];
  hasMore: boolean;
}

function readFreshCache(term: string) {
  const entry = cache.get(term);

  if (!entry) return undefined;
  if (Date.now() - entry.at >= CACHE_TTL_MS) return undefined;

  return entry;
}

export function useContributorCandidates(query: string): {
  candidates: ContributorCandidate[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  sentinelRef: (node: HTMLDivElement | null) => void;
} {
  const [term, setTerm] = useState(() => query.trim());
  const [entry, setEntry] = useState<CandidateEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inView, setInView] = useState(false);
  const requestIdRef = useRef(0);
  const loadingMoreRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const termRef = useRef(term);

  termRef.current = term;

  const sentinelRef = useCallback((node: HTMLDivElement | null) => {
    observerRef.current?.disconnect();
    observerRef.current = null;

    if (!node) return;

    const observer = new IntersectionObserver(([observed]) => {
      setInView(observed?.isIntersecting ?? false);
    });

    observer.observe(node);
    observerRef.current = observer;
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setTerm(query.trim()), DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const requestId = ++requestIdRef.current;

    setIsLoading(true);
    setError(null);

    const cached = readFreshCache(term);

    if (cached) {
      setEntry({
        term,
        page: cached.page,
        rows: cached.rows,
        hasMore: cached.hasMore,
      });
      setIsLoading(false);
      return;
    }

    let active = true;

    searchContributorCandidates(term, 0)
      .then((page) => {
        cache.set(term, {
          page: 0,
          rows: page.rows,
          hasMore: page.hasMore,
          at: Date.now(),
        });

        if (!active || requestIdRef.current !== requestId) return;

        setEntry({ term, page: 0, rows: page.rows, hasMore: page.hasMore });
      })
      .catch((caught) => {
        if (!active || requestIdRef.current !== requestId) return;

        setEntry({ term, page: 0, rows: [], hasMore: false });
        setError(
          caught instanceof Error
            ? caught.message
            : "Could not search contributors.",
        );
      })
      .finally(() => {
        if (!active || requestIdRef.current !== requestId) return;

        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [term]);

  const loadMore = useCallback(async () => {
    const current = entry;

    if (!current) return;
    if (current.term !== termRef.current || !current.hasMore) return;
    if (loadingMoreRef.current) return;

    loadingMoreRef.current = true;
    setIsLoadingMore(true);
    setError(null);

    const requestedTerm = termRef.current;

    try {
      const page = await searchContributorCandidates(
        requestedTerm,
        current.page + 1,
      );
      const rows = [...current.rows, ...page.rows];

      cache.set(requestedTerm, {
        page: current.page + 1,
        rows,
        hasMore: page.hasMore,
        at: Date.now(),
      });

      if (termRef.current !== requestedTerm) return;

      setEntry({
        term: requestedTerm,
        page: current.page + 1,
        rows,
        hasMore: page.hasMore,
      });
    } catch (caught) {
      if (termRef.current !== requestedTerm) return;

      setError(
        caught instanceof Error
          ? caught.message
          : "Could not search contributors.",
      );
    } finally {
      loadingMoreRef.current = false;
      setIsLoadingMore(false);
    }
  }, [entry]);

  useEffect(() => {
    if (!inView || isLoading || isLoadingMore) return;
    if (!entry) return;
    if (entry.term !== term || !entry.hasMore) return;

    void loadMore();
  }, [inView, isLoading, isLoadingMore, entry, term, loadMore]);

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return {
    candidates: entry?.term === term ? entry.rows : [],
    isLoading,
    isLoadingMore,
    hasMore: entry?.term === term ? entry.hasMore : false,
    error,
    sentinelRef,
  };
}
