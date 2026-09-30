"use client";

import { useEffect, useRef, useState } from "react";

export function useIntersection<T extends Element>(
  options: IntersectionObserverInit = {},
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const threshold = JSON.stringify(options);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry?.isIntersecting ?? false);
    }, JSON.parse(threshold) as IntersectionObserverInit);

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export function useIntersectionOnce<T extends Element>(
  options: IntersectionObserverInit = {},
) {
  const { ref, inView } = useIntersection<T>(options);
  const seen = useRef(false);
  if (inView) seen.current = true;
  return { ref, inView: seen.current };
}
