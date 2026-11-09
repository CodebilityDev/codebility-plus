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
    <section
      id="faq"
      className="relative overflow-hidden border-t border-[color:var(--cb-border)] pb-[var(--cb-space-96)] pt-[var(--cb-space-96)] lg:pb-[105px] lg:pt-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 bottom-0 h-[420px] w-[760px] rounded-full bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--cb-primary)_12%,transparent)_0%,transparent_72%)] blur-3xl" />
      </div>

      <LandingContainer className="relative">
        <SectionHeader
          eyebrowVariant="outline"
          eyebrow="FAQS"
          eyebrowClassName="px-[var(--cb-space-20)] tracking-[0.08em]"
          title="Common questions we get"
          description="Everything clients and future CoDevs ask before getting started."
        />

        <div className="mt-[var(--cb-space-32)] grid gap-[var(--cb-space-24)] lg:mt-[33px] lg:grid-cols-[330px_minmax(0,1fr)] lg:items-start lg:gap-[54px]">
          <div className="flex flex-col gap-[var(--cb-space-12)]">
            {faqCategories.map((category) => {
              const Icon = category.icon;

              return (
                <CategoryItem
                  key={category.value}
                  className="h-[49px]"
                  icon={<Icon />}
                  label={category.label}
                  count={category.count}
                  active={category.value === activeCategory}
                  aria-controls="faq-answers"
                  onClick={() => setActiveCategory(category.value)}
                />
              );
            })}

            <div className="rounded-[var(--cb-radius-16)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)] px-[var(--cb-space-20)] py-[18px]">
              <h3 className="text-lg font-semibold leading-6 text-[color:var(--cb-text)]">
                Still have questions?
              </h3>
              <p className="mt-[2px] text-sm leading-5 text-[color:var(--cb-text-muted)]">
                Talk to our team. We reply within one business day.
              </p>
              <Button asChild size="sm" className="mt-[var(--cb-space-8)]">
                <Link href="#contact">Contact us</Link>
              </Button>
            </div>
          </div>

          <div
            id="faq-answers"
            className="overflow-hidden rounded-[var(--cb-radius-16)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)]"
          >
            <Accordion
              key={activeCategory}
              type="single"
              collapsible
              defaultValue={activeFaqs[0]?.question}
              className="gap-0"
            >
              {activeFaqs.map((faq) => (
                <AccordionItem
                  key={faq.question}
                  value={faq.question}
                  className="rounded-none border-0 border-b border-[color:var(--cb-border)] bg-transparent last:border-b-0 data-[state=open]:border-[color:var(--cb-border)] data-[state=open]:bg-[color:color-mix(in_srgb,var(--cb-primary)_12%,var(--cb-surface))]"
                >
                  <AccordionTrigger className="min-h-[60px] rounded-none px-[var(--cb-space-20)] py-0 text-[15px] font-semibold leading-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </LandingContainer>
    </section>
  );
}
