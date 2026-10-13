"use client";

import { useEffect, useState } from "react";

export function useAsyncValue<T>(load: () => Promise<T>, fallback: T, deps: unknown[]) {
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
    // The caller owns the dependency list; the load function is recreated per render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return value;
}