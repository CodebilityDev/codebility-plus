"use client";

import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/global/design-system/Accordion";
import { CategoryItem } from "@/components/global/design-system/CategoryItem";
import { HireContainer } from "@/components/landing/hire-a-codev/HireContainer";
import { HireSectionHeading } from "@/components/landing/hire-a-codev/HireSectionHeading";
import {
  hireFaqCategories,
  hireFaqs,
} from "@/constants/landing/hire-a-codev/content";
import type { HireFaqCategory } from "@/constants/landing/hire-a-codev/content";

export function HireFaq() {
  const [activeCategory, setActiveCategory] =
    useState<HireFaqCategory>("hiring");
  const activeFaqs = hireFaqs.filter(
    (faq) => faq.category === activeCategory,
  );

  return (
    <section
      id="faq"
      className="relative border-t border-[color:var(--cb-border)] py-[var(--cb-space-96)]"
    >
      <HireContainer>
        <HireSectionHeading
          align="left"
          eyebrow="FAQS"
          title="Questions clients ask"
        />

        <div className="mt-[var(--cb-space-32)] grid gap-[var(--cb-space-24)] lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:gap-[var(--cb-space-32)]">
          <div className="flex flex-col gap-[var(--cb-space-8)]">
            {hireFaqCategories.map((category) => {
              const Icon = category.icon;

              return (
                <CategoryItem
                  key={category.value}
                  className="h-[var(--cb-size-48)]"
                  icon={<Icon />}
                  label={category.label}
                  count={category.count}
                  active={category.value === activeCategory}
                  aria-controls="hire-faq-answers"
                  onClick={() => setActiveCategory(category.value)}
                />
              );
            })}
          </div>

          <div
            id="hire-faq-answers"
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
                  className="rounded-none border-0 border-b border-[color:var(--cb-border)] bg-transparent last:border-b-0 data-[state=open]:border-[color:var(--cb-border)] data-[state=open]:bg-[color:color-mix(in_srgb,var(--cb-primary)_14%,var(--cb-surface))]"
                >
                  <AccordionTrigger className="min-h-[var(--cb-size-56)] rounded-none px-[var(--cb-space-24)] py-0 text-[15px] font-semibold leading-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-6 text-[color:var(--cb-text-secondary)] [&>div]:px-[var(--cb-space-24)] [&>div]:pb-[var(--cb-space-24)]">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </HireContainer>
    </section>
  );
}
