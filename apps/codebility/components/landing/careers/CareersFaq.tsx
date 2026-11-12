"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/global/design-system/Accordion";
import { CategoryItem } from "@/components/global/design-system/CategoryItem";
import { Eyebrow } from "@/components/global/design-system/Eyebrow";
import { careersFaqs } from "@/constants/landing/careers/careers-content";
import { BriefcaseBusiness, Globe2, Send, Wallet } from "lucide-react";

const icons = [BriefcaseBusiness, Globe2, Wallet, Send];

export function CareersFaq() {
  const [category, setCategory] = useState(0);
  const active = careersFaqs[category];
  if (!active) return null;
  return (
    <section className="careers-section">
      <div className="careers-container">
        <Eyebrow variant="outline">FAQs</Eyebrow>
        <h2>
          Questions about <span className="cb-accent-text">working here</span>
        </h2>
        <div className="careers-faq-grid">
          <div className="careers-faq-categories">
            {careersFaqs.map((item, index) => {
              const Icon = icons[index] ?? BriefcaseBusiness;
              return (
                <CategoryItem
                  key={item.label}
                  label={item.label}
                  count={item.questions.length}
                  icon={<Icon />}
                  active={category === index}
                  onClick={() => setCategory(index)}
                  aria-controls="careers-faq-panel"
                />
              );
            })}
          </div>
          <div
            id="careers-faq-panel"
            className="careers-faq-panel"
            aria-label={active.label}
          >
            <Accordion
              key={category}
              type="single"
              collapsible
              defaultValue={active.questions[0]?.question}
              className="gap-0"
            >
              {active.questions.map((item) => (
                <AccordionItem
                  key={item.question}
                  value={item.question}
                  className="rounded-none border-0 border-b border-[color:var(--cb-border)] bg-transparent last:border-b-0"
                >
                  <AccordionTrigger className="min-h-[68px] rounded-none">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
