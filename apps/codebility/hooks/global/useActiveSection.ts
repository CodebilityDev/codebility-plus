"use client";

import { useEffect, useState } from "react";

export function useActiveSection(ids: string[], fallback: string) {
  const [active, setActive] = useState(fallback);
  const key = ids.join("|");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );

    key
      .split("|")
      .map((id) => document.getElementById(id))
      .forEach((element) => element && observer.observe(element));

    return () => observer.disconnect();
  }, [key]);

  return active;
}
