"use client";

import { inView } from "framer-motion/dom";

const ALREADY_IN_VIEW_MS = 150;

export function isElementIntersecting(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return (
    rect.bottom > 0 &&
    rect.top < window.innerHeight &&
    rect.right > 0 &&
    rect.left < window.innerWidth
  );
}

export function attachProgressiveInView(
  element: HTMLElement,
  onEnter: (alreadyVisible: boolean) => void,
  amount: number | "some" | "all" = 0.2,
) {
  let cancelled = false;
  let stopInView: (() => void) | undefined;
  const startedAt = performance.now();

  const attach = () => {
    if (cancelled) return;

    if (isElementIntersecting(element)) {
      onEnter(true);
      return;
    }

    stopInView = inView(
      element,
      (entry) => {
        const immediate =
          performance.now() - startedAt < ALREADY_IN_VIEW_MS ||
          entry.time - startedAt < ALREADY_IN_VIEW_MS;
        onEnter(immediate);
      },
      { amount },
    );
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(attach);
  });

  return () => {
    cancelled = true;
    stopInView?.();
  };
}
