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

export function useAssigneeCandidates(query: string): {
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
  const cached = readFreshCache(term);
  const current = entry?.term === term ? entry : null;
  const candidates = cached ?? current?.rows ?? [];
  const error = current?.error ?? null;
  const isLoading = cached === undefined && current === null;

  useEffect(() => {
    if (readFreshCache(term)) return;

    let active = true;

    const timer = setTimeout(() => {
      searchAssignees(term)
        .then((rows) => {
          cache.set(term, { rows, at: Date.now() });
          if (!active) return;
          setEntry({ term, rows, error: null });
        })
        .catch((caught) => {
          if (!active) return;
          setEntry({
            term,
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
  }, [term]);

  return { candidates, isLoading, error };
}
