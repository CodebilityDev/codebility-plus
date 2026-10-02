"use client";

import { useEffect, useRef } from "react";

export function useRevealOnView(
  container: React.RefObject<HTMLElement | null>,
  selector: string,
  visible: string[],
  hidden: string[],
) {
  const classes = useRef({ visible, hidden });
  const key = JSON.stringify({ selector, visible, hidden });

  useEffect(() => {
    classes.current = JSON.parse(key) as { visible: string[]; hidden: string[] };

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
              card.classList.add(...classes.current.visible);
              card.classList.remove(...classes.current.hidden);
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
  }, [container, selector, key]);
}
