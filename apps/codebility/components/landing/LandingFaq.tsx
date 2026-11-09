"use client";

import Link from "next/link";
import * as React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/global/design-system/Accordion";
import { Button } from "@/components/global/design-system/Button";
import { CategoryItem } from "@/components/global/design-system/CategoryItem";
import { SectionHeader } from "@/components/global/design-system/SectionHeader";
import { LandingContainer } from "@/components/landing/LandingContainer";
import { faqCategories, faqs } from "@/constants/landing/landing-content";
import type { FaqCategory } from "@/constants/landing/landing-content";

export function LandingFaq() {
  const [activeCategory, setActiveCategory] =
    React.useState<FaqCategory>("hiring");
  const activeFaqs = faqs.filter((faq) => faq.category === activeCategory);

  return (
    <section id="faq" className="border-t border-[color:var(--cb-border)] py-[var(--cb-space-96)] lg:py-32">
      <LandingContainer>
        <SectionHeader
          eyebrowVariant="outline"
          eyebrow="FAQS"
          title="Common questions we get"
          description="Everything clients and future CoDevs ask before getting started."
        />

        <div className="mt-[var(--cb-space-40)] grid gap-[var(--cb-space-24)] lg:mt-[var(--cb-space-48)] lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:items-start lg:gap-[var(--cb-space-40)]">
          <div className="flex flex-col gap-[var(--cb-space-8)]">
            {faqCategories.map((category) => {
              const Icon = category.icon;

              return (
                <CategoryItem
                  key={category.value}
                  icon={<Icon />}
                  label={category.label}
                  count={category.count}
                  active={category.value === activeCategory}
                  aria-controls="faq-answers"
                  onClick={() => setActiveCategory(category.value)}
                />
              );
            })}

            <div className="mt-[var(--cb-space-16)] rounded-[var(--cb-radius-16)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)] p-[var(--cb-space-24)]">
              <h3 className="text-lg font-semibold leading-6 text-[color:var(--cb-text)]">
                Still have questions?
              </h3>
              <p className="mt-[var(--cb-space-8)] text-sm leading-6 text-[color:var(--cb-text-muted)]">
                Talk to our team. We reply within one business day.
              </p>
              <Button asChild size="sm" className="mt-[var(--cb-space-20)]">
                <Link href="#contact">Contact us</Link>
              </Button>
            </div>
          </div>

          <div
            id="faq-answers"
            className="rounded-[var(--cb-radius-24)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)] p-[var(--cb-space-8)]"
          >
            <Accordion
              key={activeCategory}
              type="single"
              collapsible
              defaultValue={activeFaqs[0]?.question}
            >
              {activeFaqs.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </LandingContainer>
    </section>
  );
}