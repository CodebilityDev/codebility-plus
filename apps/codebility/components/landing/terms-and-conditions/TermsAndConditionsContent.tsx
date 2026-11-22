import { Clock, FileText, ShieldCheck } from "lucide-react";

import { Eyebrow } from "@/components/global/design-system/Eyebrow";
import { LandingContainer } from "@/components/global/layout/LandingContainer";
import { LegalContactCard } from "@/components/global/marketing/LegalContactCard";
import { LegalDocumentTabs } from "@/components/global/marketing/LegalDocumentTabs";
import { LegalSidebar } from "@/components/global/marketing/LegalSidebar";
import {
  TERMS_CONTACT_EMAIL,
  TERMS_INTRO,
  TERMS_LAST_UPDATED,
  TERMS_SECTIONS,
} from "@/constants/global/terms-and-conditions";

const lastUpdatedLabel = new Date(TERMS_LAST_UPDATED).toLocaleDateString(
  "en-US",
  { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" },
);

const wordCount = [TERMS_INTRO, ...TERMS_SECTIONS.flatMap((s) => s.clauses)]
  .join(" ")
  .split(/\s+/).length;

const readMinutes = Math.max(1, Math.ceil(wordCount / 200));

const mailto = `mailto:${TERMS_CONTACT_EMAIL}`;

function ClauseText({ text }: { text: string }) {
  const [before, after] = text.split(TERMS_CONTACT_EMAIL);
  if (after === undefined) return <>{text}</>;
  return (
    <>
      {before}
      <a
        href={mailto}
        className="text-[color:var(--cb-link-text)] underline underline-offset-4 hover:text-[color:var(--cb-text)]"
      >
        {TERMS_CONTACT_EMAIL}
      </a>
      {after}
    </>
  );
}

export function TermsAndConditionsContent() {
  return (
    <div className="bg-[color:var(--cb-bg)] text-[color:var(--cb-text)]">
      <section className="bg-[radial-gradient(ellipse_60%_100%_at_0%_0%,rgb(151_71_255/0.22),transparent_70%)]">
        <LandingContainer className="pb-[var(--cb-space-40)] pt-[var(--cb-space-56)] lg:pt-[var(--cb-space-72)]">
          <Eyebrow variant="outline" className="gap-[var(--cb-space-6)]">
            <ShieldCheck size={14} aria-hidden />
            Legal
          </Eyebrow>
          <h1 className="mt-[var(--cb-space-20)] text-4xl font-bold tracking-[-0.03em] sm:text-5xl lg:text-6xl">
            Terms &amp; Conditions
          </h1>
          <p className="mt-[var(--cb-space-16)] max-w-[640px] text-base text-[color:var(--cb-text-muted)] sm:text-lg">
            The terms that apply when you use Codebility&apos;s website and
            services.
          </p>
          <div className="mt-[var(--cb-space-32)] flex flex-col gap-[var(--cb-space-20)] border-b border-[color:var(--cb-border)] pb-[var(--cb-space-40)] md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-x-[var(--cb-space-24)] gap-y-[var(--cb-space-8)] text-sm text-[color:var(--cb-text-muted)]">
              <span className="inline-flex items-center gap-[var(--cb-space-8)]">
                <Clock size={16} aria-hidden />
                Last updated{" "}
                <time dateTime={TERMS_LAST_UPDATED}>{lastUpdatedLabel}</time>
              </span>
              <span className="inline-flex items-center gap-[var(--cb-space-8)]">
                <FileText size={16} aria-hidden />
                {readMinutes} min read
              </span>
            </div>
            <LegalDocumentTabs active="terms" />
          </div>
        </LandingContainer>
      </section>

      <LandingContainer className="pb-[var(--cb-space-96)]">
        <div className="grid gap-[var(--cb-space-48)] lg:grid-cols-[240px_minmax(0,720px)] lg:gap-[var(--cb-space-48)]">
          <LegalSidebar
            sections={TERMS_SECTIONS}
            contactEmail={TERMS_CONTACT_EMAIL}
            contactDescription="Email us about anything in these terms."
          />

          <article className="pt-[var(--cb-space-40)]">
            <h2 className="text-lg font-semibold">Welcome to Codebility</h2>
            <p className="mt-[var(--cb-space-12)] leading-7 text-[color:var(--cb-text-secondary)]">
              {TERMS_INTRO}
            </p>

            {TERMS_SECTIONS.map((section, index) => {
              const number = index + 1;
              return (
                <section
                  key={section.id}
                  id={section.id}
                  aria-labelledby={`${section.id}-title`}
                  className="mt-[var(--cb-space-40)] scroll-mt-24 border-t border-[color:var(--cb-border)] pt-[var(--cb-space-40)]"
                >
                  <h2
                    id={`${section.id}-title`}
                    className="flex items-baseline gap-[var(--cb-space-12)] text-2xl font-semibold tracking-[-0.01em]"
                  >
                    <span className="text-sm font-medium tabular-nums text-[color:var(--cb-accent-text)]">
                      {String(number).padStart(2, "0")}
                    </span>
                    {section.title}
                  </h2>
                  <ol className="mt-[var(--cb-space-20)] flex flex-col gap-[var(--cb-space-12)]">
                    {section.clauses.map((clause, clauseIndex) => (
                      <li
                        key={clause}
                        className="grid grid-cols-[2.5rem_1fr] leading-7 text-[color:var(--cb-text-secondary)]"
                      >
                        <span className="text-sm tabular-nums leading-7 text-[color:var(--cb-text-decorative)]">
                          {number}.{clauseIndex + 1}
                        </span>
                        <span>
                          <ClauseText text={clause} />
                        </span>
                      </li>
                    ))}
                  </ol>
                </section>
              );
            })}

            <LegalContactCard
              title="Questions about these terms?"
              description="Contact us and we'll get back to you."
              email={TERMS_CONTACT_EMAIL}
            />
          </article>
        </div>
      </LandingContainer>
    </div>
  );
}