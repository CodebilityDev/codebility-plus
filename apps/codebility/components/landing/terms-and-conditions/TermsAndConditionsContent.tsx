import { ArrowRight, Clock, FileText, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/global/design-system/Button";
import { Eyebrow } from "@/components/global/design-system/Eyebrow";
import { LandingContainer } from "@/components/global/layout/LandingContainer";
import { TermsToc } from "@/components/landing/terms-and-conditions/TermsToc";
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

const legalTabs = [
  { label: "Privacy Policy", href: "/privacy-policy", active: false },
  { label: "Terms & Conditions", href: "/terms-and-conditions", active: true },
];

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
            <nav
              aria-label="Legal documents"
              className="inline-flex w-fit gap-[var(--cb-space-4)] rounded-[var(--cb-radius-12)] border border-[color:var(--cb-border)] bg-[color:var(--cb-glass)] p-[var(--cb-space-4)]"
            >
              {legalTabs.map((tab) => (
                <Link
                  key={tab.href}
                  href={tab.href}
                  aria-current={tab.active ? "page" : undefined}
                  className={
                    tab.active
                      ? "rounded-[var(--cb-radius-8)] bg-[color:var(--cb-selected-fill)] px-[var(--cb-space-16)] py-[var(--cb-space-8)] text-sm text-[color:var(--cb-text)]"
                      : "rounded-[var(--cb-radius-8)] px-[var(--cb-space-16)] py-[var(--cb-space-8)] text-sm text-[color:var(--cb-text-muted)] transition-colors hover:text-[color:var(--cb-text)]"
                  }
                >
                  {tab.label}
                </Link>
              ))}
            </nav>
          </div>
        </LandingContainer>
      </section>

      <LandingContainer className="pb-[var(--cb-space-96)]">
        <div className="grid gap-[var(--cb-space-48)] lg:grid-cols-[240px_minmax(0,720px)] lg:gap-[var(--cb-space-48)]">
          <aside className="hidden lg:block">
            <div className="sticky top-[var(--cb-space-96)] flex max-h-[calc(100dvh-var(--cb-space-96)-var(--cb-space-24))] flex-col gap-[var(--cb-space-24)] overflow-y-auto">
              <TermsToc />
              <div className="rounded-[var(--cb-radius-16)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)] p-[var(--cb-space-16)]">
                <p className="text-sm font-semibold">Questions?</p>
                <p className="mt-[var(--cb-space-4)] text-xs text-[color:var(--cb-text-muted)]">
                  Email us about anything in these terms.
                </p>
                <a
                  href={mailto}
                  className="mt-[var(--cb-space-12)] inline-flex items-center gap-[var(--cb-space-8)] text-xs text-[color:var(--cb-link-text)] hover:text-[color:var(--cb-text)]"
                >
                  <Mail size={14} aria-hidden />
                  {TERMS_CONTACT_EMAIL}
                </a>
              </div>
            </div>
          </aside>

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

            <div className="mt-[var(--cb-space-48)] flex flex-col gap-[var(--cb-space-20)] rounded-[var(--cb-radius-16)] border border-[color:var(--cb-border)] bg-[linear-gradient(90deg,rgb(151_71_255/0.18),transparent_70%)] p-[var(--cb-space-24)] sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-[var(--cb-space-16)]">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-[var(--cb-radius-12)] border border-[color:var(--cb-pill-border)] bg-[color:var(--cb-pill-bg)] text-[color:var(--cb-accent-text)]">
                  <Mail size={18} aria-hidden />
                </span>
                <div>
                  <p className="font-semibold">Questions about these terms?</p>
                  <p className="text-sm text-[color:var(--cb-text-muted)]">
                    Contact us and we&apos;ll get back to you.
                  </p>
                </div>
              </div>
              <Button asChild size="sm" className="w-fit">
                <a href={mailto}>
                  Email us
                  <ArrowRight size={16} aria-hidden />
                </a>
              </Button>
            </div>
          </article>
        </div>
      </LandingContainer>
    </div>
  );
}
