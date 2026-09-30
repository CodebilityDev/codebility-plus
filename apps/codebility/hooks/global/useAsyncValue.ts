"use client";

import { useEffect, useState } from "react";

export function useAsyncValue<T>(
  load: () => Promise<T>,
  deps: unknown[],
  fallback: T,
): T {
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    let active = true;

    load().then(
      (next) => {
        if (active) setValue(next);
      },
      (error) => {
        console.error("useAsyncValue failed:", error);
      },
    );

    return () => {
      active = false;
    };
  }, deps);

  return value;
}
