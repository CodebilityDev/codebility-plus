"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@codevs/ui";

import { TERMS_SECTIONS } from "@/constants/global/terms-and-conditions";

const sectionIds = TERMS_SECTIONS.map((section) => section.id);
const firstId = sectionIds[0] ?? "";
const lastId = sectionIds[sectionIds.length - 1] ?? "";
const ACTIVE_OFFSET = 120;
const USER_SCROLL_EVENTS = ["wheel", "touchstart", "keydown", "pointerdown"];

function sectionInView() {
  const { scrollY, innerHeight } = window;
  if (scrollY + innerHeight >= document.documentElement.scrollHeight - 2) {
    return lastId;
  }
  let current = firstId;
  for (const id of sectionIds) {
    const top = document.getElementById(id)?.getBoundingClientRect().top;
    if (top !== undefined && top <= ACTIVE_OFFSET) current = id;
  }
  return current;
}

export function TermsToc() {
  const [active, setActive] = useState(firstId);
  const pinned = useRef(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (pinned.current) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setActive(sectionInView()));
    };
    const release = () => {
      pinned.current = false;
    };

    const hashId = decodeURIComponent(window.location.hash.slice(1));
    pinned.current = sectionIds.includes(hashId);
    frame = requestAnimationFrame(() =>
      setActive(pinned.current ? hashId : sectionInView()),
    );

    window.addEventListener("scroll", onScroll, { passive: true });
    USER_SCROLL_EVENTS.forEach((type) =>
      window.addEventListener(type, release, { passive: true }),
    );
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      USER_SCROLL_EVENTS.forEach((type) =>
        window.removeEventListener(type, release),
      );
    };
  }, []);

  const select = (id: string) => {
    pinned.current = true;
    setActive(id);
  };

  return (
    <nav aria-label="On this page">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--cb-text-decorative)]">
        On this page
      </p>
      <ol className="mt-[var(--cb-space-16)] flex flex-col gap-[var(--cb-space-2)]">
        {TERMS_SECTIONS.map((section, index) => {
          const isActive = section.id === active;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={() => select(section.id)}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "flex items-center gap-[var(--cb-space-12)] rounded-[var(--cb-radius-8)] px-[var(--cb-space-12)] py-[var(--cb-space-8)] text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)]",
                  isActive
                    ? "bg-[color:var(--cb-selected-fill)] text-[color:var(--cb-text)]"
                    : "text-[color:var(--cb-text-muted)] hover:bg-[color:var(--cb-glass)] hover:text-[color:var(--cb-text)]",
                )}
              >
                <span
                  className={cn(
                    "w-5 text-xs tabular-nums",
                    isActive
                      ? "text-[color:var(--cb-accent-text)]"
                      : "text-[color:var(--cb-text-decorative)]",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                {section.title}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
