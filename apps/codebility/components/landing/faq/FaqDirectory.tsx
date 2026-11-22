"use client";

import { CircleHelp, Layers, MessageCircle } from "lucide-react";
import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/global/design-system/Accordion";
import { Eyebrow } from "@/components/global/design-system/Eyebrow";
import { Search } from "@/components/global/design-system/Search";
import { LandingContainer } from "@/components/global/layout/LandingContainer";
import { LegalContactCard } from "@/components/global/marketing/LegalContactCard";
import { LegalDocumentTabs } from "@/components/global/marketing/LegalDocumentTabs";
import { LegalSidebar } from "@/components/global/marketing/LegalSidebar";
import { faqDirectoryCategories } from "@/constants/global/faq-directory";
import { TERMS_CONTACT_EMAIL } from "@/constants/global/terms-and-conditions";

const allFaqs = faqDirectoryCategories.flatMap((category) => category.entries);

export function FaqDirectory() {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  const groups = faqDirectoryCategories
    .map((category) => ({
      ...category,
      entries: category.entries.filter(
        (entry) =>
          !normalizedQuery ||
          entry.question.toLowerCase().includes(normalizedQuery) ||
          entry.answer.toLowerCase().includes(normalizedQuery),
      ),
    }))
    .filter((category) => category.entries.length > 0);

  const sections = groups.map((group) => ({
    id: `faq-${group.id}`,
    title: group.label,
  }));
  const questionCount = groups.reduce(
    (total, group) => total + group.entries.length,
    0,
  );

  return (
    <div className="bg-[color:var(--cb-bg)] text-[color:var(--cb-text)]">
      <section className="bg-[radial-gradient(ellipse_60%_100%_at_0%_0%,rgb(151_71_255/0.22),transparent_70%)]">
        <LandingContainer className="pb-[var(--cb-space-40)] pt-[var(--cb-space-56)] lg:pt-[var(--cb-space-72)]">
          <Eyebrow variant="outline" className="gap-[var(--cb-space-6)]">
            <CircleHelp size={14} aria-hidden />
            Support
          </Eyebrow>
          <h1 className="mt-[var(--cb-space-20)] text-4xl font-bold tracking-[-0.03em] sm:text-5xl lg:text-6xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-[var(--cb-space-16)] max-w-[640px] text-base text-[color:var(--cb-text-muted)] sm:text-lg">
            Answers about hiring CoDevs, joining the community and working with
            Codebility.
          </p>

          <Search
            value={query}
            onValueChange={setQuery}
            placeholder={`Search ${allFaqs.length} questions...`}
            buttonLabel="Search"
            inputAriaLabel="Search frequently asked questions"
            className="mt-[var(--cb-space-24)] max-w-[600px]"
          />

          <div className="mt-[var(--cb-space-32)] flex flex-col gap-[var(--cb-space-20)] border-b border-[color:var(--cb-border)] pb-[var(--cb-space-40)] md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-x-[var(--cb-space-24)] gap-y-[var(--cb-space-8)] text-sm text-[color:var(--cb-text-muted)]">
              <span className="inline-flex items-center gap-[var(--cb-space-8)]">
                <MessageCircle size={16} aria-hidden />
                {normalizedQuery
                  ? `${questionCount} of ${allFaqs.length} questions`
                  : `${allFaqs.length} questions`}
              </span>
              <span className="inline-flex items-center gap-[var(--cb-space-8)]">
                <Layers size={16} aria-hidden />
                {groups.length === 1 ? "1 topic" : `${groups.length} topics`}
              </span>
            </div>
            <LegalDocumentTabs active="faq" />
          </div>
        </LandingContainer>
      </section>

      <LandingContainer className="pb-[var(--cb-space-96)]">
        <div className="grid gap-[var(--cb-space-48)] lg:grid-cols-[240px_minmax(0,720px)] lg:gap-[var(--cb-space-48)]">
          <LegalSidebar
            sections={sections}
            contactEmail={TERMS_CONTACT_EMAIL}
            contactDescription="Email us about anything in the FAQ."
          />

          <article
            className="pt-[var(--cb-space-40)]"
            aria-label="Frequently asked questions"
          >
            {groups.map((group, index) => {
              const Icon = group.icon;
              const number = index + 1;

              return (
                <section
                  key={group.id}
                  id={`faq-${group.id}`}
                  aria-labelledby={`faq-${group.id}-title`}
                  className="mt-[var(--cb-space-40)] scroll-mt-24 border-t border-[color:var(--cb-border)] pt-[var(--cb-space-40)] first:mt-0 first:border-t-0 first:pt-0"
                >
                  <div className="flex flex-wrap items-center justify-between gap-[var(--cb-space-12)]">
                    <h2
                      id={`faq-${group.id}-title`}
                      className="flex items-center gap-[var(--cb-space-12)] text-2xl font-semibold tracking-[-0.01em]"
                    >
                      <span className="text-sm font-medium tabular-nums text-[color:var(--cb-accent-text)]">
                        {String(number).padStart(2, "0")}
                      </span>
                      <span className="flex size-8 items-center justify-center rounded-[var(--cb-radius-8)] border border-[color:var(--cb-pill-border)] bg-[color:var(--cb-pill-bg)] text-[color:var(--cb-p200)]">
                        <Icon size={16} aria-hidden />
                      </span>
                      {group.label}
                    </h2>
                    <span className="text-sm text-[color:var(--cb-text-muted)]">
                      {group.entries.length === 1
                        ? "1 question"
                        : `${group.entries.length} questions`}
                    </span>
                  </div>

                  <Accordion
                    type="single"
                    collapsible
                    className="mt-[var(--cb-space-20)] gap-0 overflow-hidden rounded-[var(--cb-radius-16)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)]"
                  >
                    {group.entries.map((entry) => (
                      <AccordionItem
                        key={entry.question}
                        value={entry.question}
                        className="rounded-none border-0 border-b border-[color:var(--cb-border)] bg-transparent last:border-b-0 data-[state=open]:border-[color:var(--cb-border)] data-[state=open]:bg-[color:color-mix(in_srgb,var(--cb-primary)_12%,var(--cb-surface))]"
                      >
                        <AccordionTrigger className="min-h-[64px] rounded-none px-[var(--cb-space-20)] py-0 text-[15px] font-semibold leading-5">
                          {entry.question}
                        </AccordionTrigger>
                        <AccordionContent className="px-[var(--cb-space-20)] text-sm leading-6">
                          {entry.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>
              );
            })}

            {groups.length === 0 ? (
              <div className="rounded-[var(--cb-radius-16)] border border-dashed border-[color:var(--cb-border)] px-6 py-12 text-center text-sm text-[color:var(--cb-text-muted)]">
                No questions match &quot;{query}&quot;. Try another search.
              </div>
            ) : null}

            <LegalContactCard
              title="Still have questions?"
              description="Talk to our team. We reply within one business day."
              email={TERMS_CONTACT_EMAIL}
            />
          </article>
        </div>
      </LandingContainer>
    </div>
  );
}