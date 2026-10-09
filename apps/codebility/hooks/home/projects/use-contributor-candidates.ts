import { useEffect, useState } from "react";

import { searchContributorCandidates } from "@/actions/home/projects/contributors";
import type { ContributorCandidate } from "@/types/home/projects/projects";

const DEBOUNCE_MS = 300;
const CACHE_TTL_MS = 5 * 60 * 1000;

const cache = new Map<string, { rows: ContributorCandidate[]; at: number }>();

interface CandidateEntry {
  query: string;
  rows: ContributorCandidate[];
  error: string | null;
}

function readFreshCache(query: string): ContributorCandidate[] | undefined {
  const entry = cache.get(query);

  if (!entry) return undefined;
  if (Date.now() - entry.at >= CACHE_TTL_MS) return undefined;

  return entry.rows;
}

export function useContributorCandidates(query: string): {
  candidates: ContributorCandidate[];
  isLoading: boolean;
  error: string | null;
} {
  const [entry, setEntry] = useState<CandidateEntry | null>(null);

  const cached = readFreshCache(query);
  const current = entry?.query === query ? entry : null;
  const candidates = cached ?? current?.rows ?? [];
  const error = current?.error ?? null;
  const isLoading = cached === undefined && current === null;

  useEffect(() => {
    if (readFreshCache(query)) return;

    let active = true;

    const timer = setTimeout(() => {
      searchContributorCandidates(query)
        .then((rows) => {
          cache.set(query, { rows, at: Date.now() });
          if (!active) return;
          setEntry({ query, rows, error: null });
        })
        .catch((caught) => {
          if (!active) return;
          setEntry({
            query,
            rows: [],
            error:
              caught instanceof Error
                ? caught.message
                : "Could not search contributors.",
          });
        });
    }, DEBOUNCE_MS);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  return { candidates, isLoading, error };
}
