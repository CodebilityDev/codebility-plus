"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Eyebrow } from "@/components/global/design-system/Eyebrow";
import { LandingContainer } from "@/components/global/layout/LandingContainer";
import {
  portfolioProjectDetailCopy,
} from "@/constants/landing/services/content";
import type {
  PortfolioScreen,
  PortfolioScreenTab,
} from "@/types/landing/services/portfolio";

const tabs: PortfolioScreenTab[] = ["Web", "Mobile", "Cards"];

export function ProjectScreens({
  screens,
  imageSrc,
  name,
  domain,
}: {
  screens: PortfolioScreen[];
  imageSrc?: string;
  name: string;
  domain?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const activeTab = screens[activeIndex]?.tab ?? "Web";

  function scrollToIndex(index: number) {
    const track = trackRef.current;
    const child = track?.children[index] as HTMLElement | undefined;

    if (!track || !child) return;

    setActiveIndex(index);
    track.scrollTo({
      left: child.offsetLeft - track.offsetLeft,
      behavior: "smooth",
    });
  }

  function selectTab(tab: PortfolioScreenTab) {
    const index = screens.findIndex((screen) => screen.tab === tab);
    if (index >= 0) scrollToIndex(index);
  }

  return (
    <section className="relative overflow-hidden border-t border-[color:var(--cb-border)] py-[7rem]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(ellipse_62%_80%_at_20%_0%,color-mix(in_srgb,var(--cb-primary)_22%,transparent)_0%,transparent_70%)]"
      />
      <LandingContainer className="relative">
        <div className="flex flex-col gap-[var(--cb-space-20)] lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow variant="outline" className="tracking-[0.12em]">
              {portfolioProjectDetailCopy.screensEyebrow}
            </Eyebrow>
            <h2 className="mt-[var(--cb-space-16)] text-[32px] font-bold leading-9 tracking-tight text-[color:var(--cb-text)] md:text-[44px] md:leading-[48px]">
              {portfolioProjectDetailCopy.screensTitle}
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Screen types"
            className="flex w-fit items-center gap-[var(--cb-space-4)] rounded-[var(--cb-radius-full)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)] p-[var(--cb-space-4)]"
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                aria-controls="project-screens-track"
                onClick={() => selectTab(tab)}
                className={
                  "inline-flex h-[var(--cb-size-36)] items-center justify-center rounded-[var(--cb-radius-full)] px-[var(--cb-space-16)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)] " +
                  (activeTab === tab
                    ? "bg-[color:var(--cb-primary)] text-[color:var(--cb-text)] shadow-[0_8px_24px_-10px_rgba(151,71,255,0.7)]"
                    : "text-[color:var(--cb-text-secondary)] hover:text-[color:var(--cb-text)]")
                }
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div
          ref={trackRef}
          id="project-screens-track"
          role="tabpanel"
          aria-label="Project screens"
          className="scrollbar-hide mt-[var(--cb-space-32)] flex snap-x snap-mandatory gap-[var(--cb-space-16)] overflow-x-auto pb-[var(--cb-space-2)]"
        >
          {screens.map((screen, index) => (
            <button
              key={screen.id}
              type="button"
              aria-label={`Show ${screen.label}`}
              aria-pressed={activeIndex === index}
              onClick={() => {
                const child = trackRef.current?.children[index] as
                  | HTMLElement
                  | undefined;
                if (child) {
                  trackRef.current?.scrollTo({
                    left: child.offsetLeft - trackRef.current.offsetLeft,
                    behavior: "smooth",
                  });
                }
                setActiveIndex(index);
              }}
              className={
                "group w-[82%] shrink-0 snap-start text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cb-bg)] sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)]"
              }
            >
              <span
                className={
                  "block overflow-hidden rounded-[var(--cb-radius-24)] border bg-[#0B0B0D] transition-colors " +
                  (activeIndex === index
                    ? "border-[color:color-mix(in_srgb,var(--cb-primary)_60%,transparent)]"
                    : "border-[color:var(--cb-border)] group-hover:border-[color:color-mix(in_srgb,var(--cb-primary)_40%,transparent)]")
                }
              >
                {screen.mode === "browser" ? (
                  <span className="flex h-[var(--cb-size-36)] items-center gap-[var(--cb-space-6)] border-b border-[color:var(--cb-border)] bg-[#0A0A0A] px-[var(--cb-space-12)]">
                    <span className="h-2 w-2 rounded-full bg-[#FF5F57]" />
                    <span className="h-2 w-2 rounded-full bg-[#FEBC2E]" />
                    <span className="h-2 w-2 rounded-full bg-[#28C840]" />
                    <span className="mx-auto min-w-0 truncate rounded-[var(--cb-radius-full)] bg-[color:var(--cb-glass)] px-[var(--cb-space-12)] py-[var(--cb-space-2)] text-[10px] leading-4 text-[color:var(--cb-text-muted)]">
                      {domain ?? name}
                    </span>
                  </span>
                ) : (
                  <span className="flex h-[var(--cb-size-36)] items-center justify-center border-b border-[color:var(--cb-border)] bg-[#0A0A0A]">
                    <span className="h-[18px] w-[92px] rounded-[var(--cb-radius-full)] bg-[#050505]" />
                  </span>
                )}

                <span className="relative block aspect-[3/4.15] w-full overflow-hidden bg-[#111]">
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={`${name} ${screen.label}`}
                      fill
                      sizes="(min-width: 1024px) 33vw, 82vw"
                      loading="lazy"
                      style={{ objectPosition: screen.objectPosition }}
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--cb-primary)_22%,transparent),#0A0A0A_72%)] text-2xl font-semibold text-[color:var(--cb-text-muted)]">
                      {name}
                    </span>
                  )}
                </span>
              </span>
            </button>
          ))}
        </div>

        <div className="mt-[var(--cb-space-24)] flex items-center justify-between gap-[var(--cb-space-16)]">
          <div className="scrollbar-hide flex min-w-0 gap-[var(--cb-space-8)] overflow-x-auto">
            {screens.map((screen, index) => (
              <button
                key={screen.id}
                type="button"
                aria-label={`Show ${screen.label}`}
                aria-pressed={activeIndex === index}
                onClick={() => scrollToIndex(index)}
                className={
                  "relative h-[42px] w-[64px] shrink-0 overflow-hidden rounded-[var(--cb-radius-8)] border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)] " +
                  (activeIndex === index
                    ? "border-[color:var(--cb-primary)]"
                    : "border-[color:var(--cb-border)] opacity-60 hover:opacity-100")
                }
              >
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt=""
                    fill
                    sizes="64px"
                    loading="lazy"
                    style={{ objectPosition: screen.objectPosition }}
                    className="object-cover"
                  />
                ) : (
                  <span className="absolute inset-0 bg-[color:var(--cb-surface-2)]" />
                )}
              </button>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-[var(--cb-space-8)]">
            <button
              type="button"
              aria-label="Previous screen"
              disabled={activeIndex === 0}
              onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
              className="flex h-[var(--cb-size-36)] w-[var(--cb-size-36)] items-center justify-center rounded-[var(--cb-radius-full)] border border-[color:var(--cb-border)] text-[color:var(--cb-text-secondary)] transition-colors hover:text-[color:var(--cb-text)] disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)]"
            >
              <ChevronLeft className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]" />
            </button>
            <button
              type="button"
              aria-label="Next screen"
              disabled={activeIndex === screens.length - 1}
              onClick={() =>
                scrollToIndex(Math.min(screens.length - 1, activeIndex + 1))
              }
              className="flex h-[var(--cb-size-36)] w-[var(--cb-size-36)] items-center justify-center rounded-[var(--cb-radius-full)] bg-[color:var(--cb-primary)] text-[color:var(--cb-text)] transition-colors hover:bg-[color:var(--cb-primary-hover)] disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)]"
            >
              <ChevronRight className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]" />
            </button>
          </div>
        </div>
      </LandingContainer>
    </section>
  );
}
