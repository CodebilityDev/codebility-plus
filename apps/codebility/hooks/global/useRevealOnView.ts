"use client";

import { useEffect } from "react";

export function useRevealOnView(
  container: React.RefObject<HTMLElement | null>,
  selector: string,
  visible: string[],
  hidden: string[],
) {
  useEffect(() => {
    const root = container.current;
    if (!root) return;

    const cards = root.querySelectorAll<HTMLElement>(selector);
    if (!cards.length) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const card = entry.target as HTMLElement;
          timers.push(
            setTimeout(() => {
              card.classList.add(...visible);
              card.classList.remove(...hidden);
            }, Number(card.dataset.delay ?? 0)),
          );
          observer.unobserve(card);
        });
      },
      { threshold: 0.15 },
    );

    cards.forEach((card) => observer.observe(card));

    return () => {
      timers.forEach(clearTimeout);
      observer.disconnect();
    };
  }, [container, selector, visible, hidden]);
}
