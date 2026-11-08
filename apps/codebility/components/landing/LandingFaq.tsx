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
    <section id="faq" className="border-t border-white/10 py-24 lg:py-32">
      <LandingContainer>
        <SectionHeader
          eyebrowVariant="outline"
          eyebrow="FAQS"
          title="Common questions we get"
          description="Everything clients and future CoDevs ask before getting started."
        />

        <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:items-start lg:gap-10">
          <div className="flex flex-col gap-2">
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

            <div className="mt-4 rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
              <h3 className="text-lg font-semibold leading-6 text-[#f4f4f4]">
                Still have questions?
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Talk to our team. We reply within one business day.
              </p>
              <Button asChild size="sm" className="mt-5">
                <Link href="#contact">Contact us</Link>
              </Button>
            </div>
          </div>

          <div
            id="faq-answers"
            className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-2"
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