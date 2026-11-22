"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "@codevs/ui";
import type { LegalTocProps } from "@/types/global/legal-documents";

const ACTIVE_OFFSET = 120;
const USER_SCROLL_EVENTS = ["wheel", "touchstart", "keydown", "pointerdown"];

function sectionInView(sectionIds: readonly string[]) {
  const firstId = sectionIds[0] ?? "";
  const lastId = sectionIds[sectionIds.length - 1] ?? "";
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

export function LegalToc({ sections }: LegalTocProps) {
  const sectionIds = useMemo(
    () => sections.map((section) => section.id),
    [sections],
  );
  const [active, setActive] = useState(sectionIds[0] ?? "");
  const pinned = useRef(false);
  const selectId = useId();

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (pinned.current) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setActive(sectionInView(sectionIds)));
    };
    const release = () => {
      pinned.current = false;
    };
    const hashId = decodeURIComponent(window.location.hash.slice(1));
    pinned.current = sectionIds.includes(hashId);
    frame = requestAnimationFrame(() =>
      setActive(pinned.current ? hashId : sectionInView(sectionIds)),
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
  }, [sectionIds]);

  const select = (id: string) => {
    pinned.current = true;
    setActive(id);
  };

  return (
    <>
      <div className="flex flex-col gap-[var(--cb-space-12)] lg:hidden">
        <label
          htmlFor={selectId}
          className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--cb-text-decorative)]"
        >
          On this page
        </label>
        <select
          id={selectId}
          value={active}
          onChange={(event) => {
            select(event.target.value);
            window.location.hash = event.target.value;
          }}
          className="w-full rounded-[var(--cb-radius-12)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)] p-[var(--cb-space-12)] text-sm text-[color:var(--cb-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)]"
        >
          {sections.map((section, index) => (
            <option key={section.id} value={section.id}>
              {String(index + 1).padStart(2, "0")} · {section.title}
            </option>
          ))}
        </select>
      </div>
      <nav aria-label="On this page" className="hidden lg:block">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--cb-text-decorative)]">
          On this page
        </p>
        <ol className="mt-[var(--cb-space-16)] flex flex-col gap-[var(--cb-space-2)]">
          {sections.map((section, index) => {
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
                      "w-5 shrink-0 text-xs tabular-nums",
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
    </>
  );
}
