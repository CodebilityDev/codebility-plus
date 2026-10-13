import { useEffect, useState } from "react";

import { searchAssignees } from "@/actions/home/kanban/assignees";
import type { AssigneeOption } from "@/types/home/kanban/kanban";

const DEBOUNCE_MS = 300;
const CACHE_TTL_MS = 5 * 60 * 1000;

const cache = new Map<string, { rows: AssigneeOption[]; at: number }>();

function readFreshCache(term: string): AssigneeOption[] | undefined {
  const entry = cache.get(term);

  if (!entry) return undefined;
  if (Date.now() - entry.at >= CACHE_TTL_MS) return undefined;

  return entry.rows;
}

export function useAssigneeCandidates(
  query: string,
  projectId: string,
): {
  candidates: AssigneeOption[];
  isLoading: boolean;
  error: string | null;
} {
  const [entry, setEntry] = useState<{
    term: string;
    rows: AssigneeOption[];
    error: string | null;
  } | null>(null);

  const term = query.trim();
  const cacheKey = `${projectId}:${term}`;
  const cached = readFreshCache(cacheKey);
  const current = entry?.term === cacheKey ? entry : null;
  const candidates = cached ?? current?.rows ?? [];
  const error = current?.error ?? null;
  const isLoading = cached === undefined && current === null;

  useEffect(() => {
    if (readFreshCache(cacheKey)) return;

    let active = true;

    const timer = setTimeout(() => {
      searchAssignees(term, projectId)
        .then((rows) => {
          cache.set(cacheKey, { rows, at: Date.now() });
          if (!active) return;
          setEntry({ term: cacheKey, rows, error: null });
        })
        .catch((caught) => {
          if (!active) return;
          setEntry({
            term: cacheKey,
            rows: [],
            error:
              caught instanceof Error
                ? caught.message
                : "Could not search assignees.",
          });
        });
    }, DEBOUNCE_MS);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [cacheKey, projectId, term]);

  return { candidates, isLoading, error };
}
