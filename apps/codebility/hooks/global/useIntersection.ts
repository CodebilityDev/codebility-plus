"use client";

import { useCallback, useEffect, useState } from "react";

interface UseIntersectionOptions extends IntersectionObserverInit {
  rootRef?: React.RefObject<Element | null>;
}

export function useIntersection<T extends Element>(
  options: UseIntersectionOptions = {},
) {
  const [inView, setInView] = useState(false);
  const [element, setElement] = useState<T | null>(null);
  const { root, rootMargin, rootRef, threshold } = options;

  const setElementRef = useCallback((node: T | null) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      {
        root: rootRef?.current ?? root ?? null,
        rootMargin,
        threshold,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [element, root, rootMargin, rootRef, threshold]);

  return { ref: setElementRef, inView };
}
