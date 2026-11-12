import { Check } from "lucide-react";

import { cn } from "@codevs/ui";

import { SectionHeader } from "@/components/global/design-system/SectionHeader";
import { LandingContainer } from "@/components/global/layout/LandingContainer";
import { roadmapPhases } from "@/constants/landing/codevs/codevs-content";
import type { RoadmapStatus } from "@/constants/landing/codevs/codevs-content";

const nodeClasses: Record<RoadmapStatus, string> = {
  done: "bg-[color:var(--cb-success)] text-[color:var(--cb-bg)]",
  active:
    "bg-[color:var(--cb-primary)] text-[color:var(--cb-text)] shadow-[0_0_24px_color-mix(in_srgb,var(--cb-primary)_55%,transparent)]",
  upcoming:
    "border border-[color:var(--cb-border)] bg-[color:var(--cb-surface-2)] text-[color:var(--cb-text-muted)]",
};

const cardClasses: Record<RoadmapStatus, string> = {
  done: "border-[color:var(--cb-border)] bg-[color:var(--cb-panel)]",
  active:
    "border-[color:color-mix(in_srgb,var(--cb-primary)_60%,transparent)] bg-[linear-gradient(160deg,color-mix(in_srgb,var(--cb-primary)_24%,var(--cb-bg))_0%,color-mix(in_srgb,var(--cb-primary)_12%,var(--cb-bg))_100%)] shadow-[0_12px_48px_color-mix(in_srgb,var(--cb-primary)_28%,transparent)]",
  upcoming: "border-[color:var(--cb-border)] bg-[color:var(--cb-panel)]",
};

const stepTileClasses: Record<RoadmapStatus, string> = {
  done: "bg-[color:var(--cb-glass)] text-[color:var(--cb-text-muted)]",
  active:
    "bg-[color:color-mix(in_srgb,var(--cb-primary)_28%,transparent)] text-[color:var(--cb-p200)]",
  upcoming: "bg-[color:var(--cb-glass)] text-[color:var(--cb-text-muted)]",
};

const progressClasses: Record<RoadmapStatus, string> = {
  done: "bg-[color:var(--cb-success)]",
  active: "bg-[color:var(--cb-primary)]",
  upcoming: "bg-transparent",
};

function CodevsRoadmap() {
  return (
    <section
      id="roadmap"
      className="relative overflow-hidden border-t border-[color:var(--cb-border)] py-[var(--cb-space-96)] lg:py-[112px]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-0 h-[36rem] w-[48rem] bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--cb-teal)_7%,transparent)_0%,transparent_70%)]"
      />

      <LandingContainer className="relative">
        <SectionHeader
          align="center"
          eyebrowVariant="outline"
          eyebrow="CAREER ROADMAP"
          eyebrowClassName="tracking-[0.24em]"
          title={
            <>
              From Intern to <span className="cb-accent-text">Mentor</span>
            </>
          }
          description="Earn points by contributing to projects. Every phase unlocks more responsibility."
          className="[&_p]:max-w-[64ch]"
        />

        <div className="relative mx-auto mt-[var(--cb-space-48)] max-w-[1100px]">
          <span
            aria-hidden
            className="absolute left-[16.667%] top-[19px] h-[2px] w-[33.333%] bg-gradient-to-r from-[var(--cb-p400)] to-[var(--cb-cyan)]"
          />
          <span
            aria-hidden
            className="absolute left-1/2 top-[19px] h-[2px] w-[33.333%] bg-[color:var(--cb-border)]"
          />
          <ol aria-label="Career phases" className="relative grid grid-cols-3">
            {roadmapPhases.map((phase) => (
              <li
                key={phase.phase}
                className="relative flex flex-col items-center text-center"
              >
                <span
                  aria-hidden
                  className={cn(
                    "flex h-[var(--cb-size-40)] w-[var(--cb-size-40)] items-center justify-center rounded-[var(--cb-radius-full)] text-sm font-semibold",
                    nodeClasses[phase.status],
                  )}
                >
                  {phase.status === "done" ? (
                    <Check
                      className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]"
                      strokeWidth={3}
                    />
                  ) : (
                    phase.phase
                  )}
                </span>
                <span className="mt-[var(--cb-space-12)] text-[17px] font-semibold leading-6 text-[color:var(--cb-text)]">
                  {phase.title}
                </span>
                <span className="mt-[var(--cb-space-4)] text-xs text-[color:var(--cb-text-muted)]">
                  {phase.points}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <ul className="mt-[var(--cb-space-40)] grid grid-cols-1 gap-[var(--cb-space-20)] md:grid-cols-3">
          {roadmapPhases.map((phase) => (
            <li
              key={phase.phase}
              className={cn(
                "flex flex-col rounded-[var(--cb-radius-24)] border p-[var(--cb-space-24)]",
                cardClasses[phase.status],
              )}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--cb-text-muted)]">
                Phase {phase.phase}
              </p>
              <h3 className="mt-[var(--cb-space-16)] text-2xl font-bold leading-[30px] text-[color:var(--cb-text)]">
                {phase.title}
              </h3>
              <p className="mt-[var(--cb-space-8)] text-xs text-[color:var(--cb-p300)]">
                {phase.points}
              </p>
              <ol className="mt-[var(--cb-space-12)] flex flex-col gap-[var(--cb-space-8)]">
                {phase.steps.map((step, index) => (
                  <li
                    key={step}
                    className="flex items-center gap-[var(--cb-space-12)] text-[15px] leading-5 text-[color:var(--cb-text-secondary)]"
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[var(--cb-radius-8)] text-xs",
                        stepTileClasses[phase.status],
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <span
                aria-hidden
                className="mt-[var(--cb-space-12)] block h-[6px] overflow-hidden rounded-[var(--cb-radius-full)] bg-[color:var(--cb-glass)]"
              >
                <span
                  className={cn(
                    "block h-full rounded-[var(--cb-radius-full)]",
                    progressClasses[phase.status],
                  )}
                  style={{ width: `${phase.progress}%` }}
                />
              </span>
            </li>
          ))}
        </ul>
      </LandingContainer>
    </section>
  );
}

export { CodevsRoadmap };
