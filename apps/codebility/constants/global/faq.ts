import { Briefcase, CreditCard, GraduationCap, Headphones } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type FaqCategory = "hiring" | "program" | "payments" | "support";

export interface LandingFaqCategory {
  value: FaqCategory;
  label: string;
  count: number;
  icon: LucideIcon;
}

export const faqCategories: LandingFaqCategory[] = [
  { value: "hiring", label: "Hiring CoDevs", count: 6, icon: Briefcase },
  { value: "program", label: "The CoDev Program", count: 5, icon: GraduationCap },
  { value: "payments", label: "Payments & contracts", count: 4, icon: CreditCard },
  { value: "support", label: "Support", count: 3, icon: Headphones },
];

export interface LandingFaq {
  category: FaqCategory;
  question: string;
  answer: string;
}

export const faqs: LandingFaq[] = [
  {
    category: "hiring",
    question: "How quickly can I get a developer on my team?",
    answer:
      "After a discovery call we share a shortlist of matching CoDevs. You interview them and choose who joins, before any work or payment starts.",
  },
  {
    category: "hiring",
    question: "Are CoDevs full-time or project-based?",
    answer:
      "Both. You can bring a CoDev in full-time or scope them to a defined project.",
  },
  {
    category: "hiring",
    question: "Which time zones do you cover?",
    answer:
      "We match CoDevs to your working hours across US, EU and APAC time zones.",
  },
  {
    category: "hiring",
    question: "Can I interview developers before hiring?",
    answer:
      "Yes. Every shortlist is yours to interview. You choose who joins before work starts.",
  },
  {
    category: "hiring",
    question: "What happens if a developer isn't the right fit?",
    answer:
      "We rematch you with another vetted CoDev at no extra cost.",
  },
  {
    category: "hiring",
    question: "Who owns the code and design files?",
    answer:
      "You do. Code, designs and repositories are handed over to your team.",
  },
  {
    category: "program",
    question: "What is the CoDev Program?",
    answer:
      "A mentored program where developers grow on real client projects with support from senior engineers.",
  },
  {
    category: "program",
    question: "Is the program free?",
    answer:
      "Yes. The CoDev Program is free for accepted developers.",
  },
  {
    category: "program",
    question: "How long does the program take?",
    answer:
      "Most CoDevs stay for three to six months, depending on the project and their goals.",
  },
  {
    category: "program",
    question: "Do I need professional experience?",
    answer:
      "You need a solid foundation and a portfolio. The program is built for people ready to work on real projects.",
  },
  {
    category: "program",
    question: "Will I work on real client projects?",
    answer:
      "Yes. CoDevs join real project teams with mentors and a shared delivery board.",
  },
  {
    category: "payments",
    question: "How do payments work?",
    answer:
      "We agree on a monthly or project scope before work starts. Invoices are issued on a fixed schedule.",
  },
  {
    category: "payments",
    question: "Can I pay monthly?",
    answer: "Yes. Monthly billing is available for ongoing CoDev placements.",
  },
  {
    category: "payments",
    question: "Are there long-term contracts?",
    answer:
      "You can start with a short engagement and extend it when the fit is right.",
  },
  {
    category: "payments",
    question: "What is included in the rate?",
    answer:
      "The CoDev, project coordination, weekly demos and delivery support are included.",
  },
  {
    category: "support",
    question: "What support is included?",
    answer:
      "You get one point of contact, weekly demos and help resolving delivery blockers.",
  },
  {
    category: "support",
    question: "How fast do you respond?",
    answer: "We reply within one business day.",
  },
  {
    category: "support",
    question: "Do you offer maintenance after launch?",
    answer:
      "Yes. Optional post-launch maintenance and support plans are available.",
  },
];
