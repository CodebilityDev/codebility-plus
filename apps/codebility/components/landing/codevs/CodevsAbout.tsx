"use client";

import { Check } from "lucide-react";

import { SectionHeader } from "@/components/global/design-system/SectionHeader";
import {
  Tab,
  Tabs,
  TabsContent,
  TabsList,
} from "@/components/global/design-system/Tabs";
import { LandingContainer } from "@/components/global/layout/LandingContainer";
import {
  aboutTabs,
  visionStatement,
} from "@/constants/landing/codevs/codevs-content";

const codeSample = `const codebility = {
  learn: "by doing",
  build: "real projects",
  grow: "together"
};`;

function CodevsAbout() {
  return (
    <section
      id="about"
      className="border-t border-[color:var(--cb-border)] py-[var(--cb-space-96)] lg:py-[112px]"
    >
      <LandingContainer>
        <SectionHeader
          align="center"
          eyebrowVariant="outline"
          eyebrow="WHO WE ARE"
          eyebrowClassName="tracking-[0.24em]"
          title={
            <>
              More than just <span className="cb-accent-text">a community</span>
            </>
          }
        />

        <div className="mt-[var(--cb-space-48)] grid grid-cols-1 gap-[var(--cb-space-32)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-[56px]">
          <figure className="flex min-h-[360px] flex-col justify-between gap-[var(--cb-space-40)] rounded-[var(--cb-radius-24)] bg-[linear-gradient(90deg,var(--cb-brand-start)_0%,var(--cb-brand-mid)_50%,var(--cb-brand-end)_100%)] p-[var(--cb-space-28)] sm:p-[36px] lg:min-h-[420px]">
            <pre
              aria-hidden
              className="overflow-x-auto font-mono text-sm leading-6 text-[color:color-mix(in_srgb,var(--cb-white)_80%,transparent)]"
            >
              <code>{codeSample}</code>
            </pre>
            <figcaption>
              <blockquote className="text-[28px] font-bold leading-[1.2] text-[color:var(--cb-white)] sm:text-[32px]">
                &ldquo;Everyone has the ability to code.&rdquo;
              </blockquote>
              <p className="mt-[var(--cb-space-12)] text-sm text-[color:color-mix(in_srgb,var(--cb-white)_75%,transparent)]">
                Not a course, a launchpad.
              </p>
            </figcaption>
          </figure>

          <div className="flex flex-col">
            <Tabs defaultValue="mission">
              <TabsList aria-label="About Codebility">
                {aboutTabs.map((tab) => (
                  <Tab key={tab.value} value={tab.value}>
                    {tab.label}
                  </Tab>
                ))}
              </TabsList>

              {aboutTabs.map((tab) => (
                <TabsContent
                  key={tab.value}
                  value={tab.value}
                  className="mt-[var(--cb-space-24)]"
                >
                  <ul className="flex flex-col gap-[var(--cb-space-20)]">
                    {tab.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-[var(--cb-space-16)] text-[15px] leading-[25px] text-[color:var(--cb-text-secondary)]"
                      >
                        <span
                          aria-hidden
                          className="mt-[1px] flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[var(--cb-radius-8)] border border-[color:var(--cb-pill-border)] bg-[color:var(--cb-pill-bg)] text-[color:var(--cb-p200)]"
                        >
                          <Check className="h-[var(--cb-size-14)] w-[var(--cb-size-14)]" />
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </TabsContent>
              ))}
            </Tabs>

            <div className="mt-[var(--cb-space-24)] rounded-[var(--cb-radius-16)] border border-[color:var(--cb-border)] bg-[color:var(--cb-panel)] p-[var(--cb-space-20)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--cb-p300)]">
                Vision
              </p>
              <p className="mt-[var(--cb-space-12)] text-sm leading-6 text-[color:var(--cb-text-secondary)]">
                {visionStatement}
              </p>
            </div>
          </div>
        </div>
      </LandingContainer>
    </section>
  );
}

export { CodevsAbout };
