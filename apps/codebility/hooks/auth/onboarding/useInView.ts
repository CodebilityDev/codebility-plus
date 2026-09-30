"use client";

import { useIntersection } from "@/hooks/global/useIntersection";

export function useInView<T extends HTMLElement>(threshold = 0.2) {
  return useIntersection<T>({ threshold });
}
