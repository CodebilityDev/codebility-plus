"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Calls `onOutside` on a mousedown outside `ref` while `active` is true.
 * Encapsulates the document listener so it is written once; `useEffect` is the
 * right tool here (synchronising with a DOM event source outside React).
 *
 * `onOutside` is held in a ref so callers can pass an inline closure without
 * re-subscribing the listener on every render.
 */
export function useOutsideClick(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  onOutside: () => void,
) {
  const handlerRef = useRef(onOutside);
  handlerRef.current = onOutside;

  useEffect(() => {
    if (!active) return;

    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handlerRef.current();
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, active]);
}
