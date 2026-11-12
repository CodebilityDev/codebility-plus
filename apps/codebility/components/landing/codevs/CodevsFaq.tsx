import { ArrowRight } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/global/design-system/Accordion";
import { Button } from "@/components/global/design-system/Button";
import { SectionHeader } from "@/components/global/design-system/SectionHeader";
import { LandingContainer } from "@/components/global/layout/LandingContainer";
import {
  codevsFaqs,
  DISCORD_URL,
} from "@/constants/landing/codevs/codevs-content";

function CodevsFaq() {
  return (
    <section
      id="faq"
      className="border-t border-[color:var(--cb-border)] py-[var(--cb-space-96)] lg:py-[112px]"
    >
      <LandingContainer>
        <SectionHeader
          eyebrowVariant="outline"
          eyebrow="FAQS"
          eyebrowClassName="tracking-[0.24em]"
          title="Before you apply"
          description="Straight answers about how the program works."
        />

        <div className="mt-[var(--cb-space-48)] grid grid-cols-1 gap-[var(--cb-space-24)] lg:grid-cols-[380px_minmax(0,1fr)] lg:items-start lg:gap-[40px]">
          <div className="relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-[var(--cb-radius-24)] border border-[color:color-mix(in_srgb,var(--cb-primary)_45%,transparent)] bg-[color:var(--cb-surface)] p-[var(--cb-space-28)]">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_0%_30%,color-mix(in_srgb,var(--cb-primary)_22%,transparent)_0%,transparent_70%),radial-gradient(ellipse_60%_60%_at_100%_20%,color-mix(in_srgb,var(--cb-teal)_12%,transparent)_0%,transparent_70%)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute right-[60px] top-[36px] h-[112px] w-[112px] rotate-[20deg] rounded-[28px] bg-gradient-to-br from-[var(--cb-p400)] to-[var(--cb-cyan)] shadow-[0_24px_48px_color-mix(in_srgb,var(--cb-primary)_40%,transparent)]"
            />
            <div className="relative">
              <h3 className="text-[22px] font-semibold leading-7 text-[color:var(--cb-text)]">
                Still unsure?
              </h3>
              <p className="mt-[var(--cb-space-12)] text-sm leading-5 text-[color:var(--cb-text-muted)]">
                Ask the community on Discord. Mentors and CoDevs answer every
                day.
              </p>
              <Button
                asChild
                size="sm"
                className="mt-[var(--cb-space-20)] shadow-[0_0_32px_color-mix(in_srgb,var(--cb-primary)_35%,transparent)]"
              >
                <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer">
                  Join our Discord
                  <ArrowRight
                    aria-hidden
                    className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]"
                  />
                </a>
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-[var(--cb-radius-16)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)]">
            <Accordion
              type="single"
              collapsible
              defaultValue={codevsFaqs[0]?.question}
              className="gap-0"
            >
              {codevsFaqs.map((faq) => (
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

export { CodevsFaq };
