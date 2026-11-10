import {
  Briefcase,
  CheckCircle2,
  Clock,
  CreditCard,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { ClientLogoName } from "@/components/global/design-system/ClientLogo";

export type HireTalentFilterValue =
  | "all"
  | "full-stack"
  | "frontend"
  | "backend"
  | "mobile"
  | "ui-ux"
  | "qa"
  | "ai";

export interface HireTalentFilter {
  label: string;
  value: HireTalentFilterValue;
  count?: string;
}

export const hireTalentFilters: HireTalentFilter[] = [
  { label: "All", value: "all", count: "100+" },
  { label: "Full Stack", value: "full-stack" },
  { label: "Frontend", value: "frontend" },
  { label: "Backend", value: "backend" },
  { label: "Mobile", value: "mobile" },
  { label: "UI/UX", value: "ui-ux" },
  { label: "QA", value: "qa" },
  { label: "AI", value: "ai" },
];

export function normalizeHireTalentFilter(
  value: string | string[] | null | undefined,
): HireTalentFilterValue {
  const filter = Array.isArray(value) ? value[0] : value;

  return hireTalentFilters.some((item) => item.value === filter)
    ? (filter as HireTalentFilterValue)
    : "all";
}

export type HireTalentTech =
  | "React"
  | "Next.js"
  | "Node.js"
  | "Python"
  | "PHP / WordPress"
  | "Shopify"
  | "React Native"
  | "Figma"
  | "n8n";

export const hireTalentTech: HireTalentTech[] = [
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "PHP / WordPress",
  "Shopify",
  "React Native",
  "Figma",
  "n8n",
];

export function normalizeHireTalentTech(
  value: string | string[] | null | undefined,
): HireTalentTech | undefined {
  const tech = Array.isArray(value) ? value[0] : value;

  return hireTalentTech.find((item) => item === tech);
}

export const trustedPartners: {
  name: ClientLogoName;
  className?: string;
}[] = [
  { name: "genius-web-services" },
  { name: "netmedia" },
  { name: "zwift-tech" },
  { name: "infraspan" },
  { name: "averps" },
  { name: "fixflow-ai" },
];

export interface HireProcessStep {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const hireProcessSteps: HireProcessStep[] = [
  {
    icon: Sparkles,
    title: "Tell us your needs",
    description:
      "Share your requirements, tech stack, timeline and team size. We help you define the right profile.",
  },
  {
    icon: Users,
    title: "Meet pre-vetted talent",
    description:
      "We present 3-5 carefully selected CoDevs who match your criteria.",
  },
  {
    icon: Search,
    title: "Interview & select",
    description:
      "Interview your shortlist. We facilitate the process and technical assessments.",
  },
  {
    icon: Briefcase,
    title: "Start building",
    description:
      "Your CoDevs join your team, with ongoing support for smooth delivery.",
  },
];

export interface HireModel {
  icon: LucideIcon;
  title: string;
  badge?: string;
  description: string;
  features: string[];
  featured?: boolean;
}

export const hireModels: HireModel[] = [
  {
    icon: Briefcase,
    title: "Dedicated developer",
    badge: "MOST COMMON",
    description: "One full-time CoDev working as part of your team.",
    features: [
      "Works your hours and tools",
      "Interview before you commit",
      "Joins your standups and repo",
      "Replacement if it isn't a fit",
    ],
    featured: true,
  },
  {
    icon: Users,
    title: "Project team",
    description: "A small team to design and build a defined product.",
    features: [
      "Developers, designer and QA",
      "Weekly demos",
      "One point of contact",
      "Hand-over at launch",
    ],
  },
  {
    icon: Clock,
    title: "Part-time support",
    description: "Extra hands for maintenance or a short sprint.",
    features: [
      "Flexible weekly hours",
      "Scale up when you need",
      "Bug fixes and updates",
      "No long setup",
    ],
  },
];

export interface HireComparisonCell {
  text: string;
  status: "yes" | "no" | "partial";
}

export interface HireComparisonRow {
  label: string;
  codebility: HireComparisonCell;
  freelance: HireComparisonCell;
  agency: HireComparisonCell;
}

const yes = (text: string): HireComparisonCell => ({ text, status: "yes" });
const no = (text: string): HireComparisonCell => ({ text, status: "no" });
const partial = (text: string): HireComparisonCell => ({
  text,
  status: "partial",
});

export const hireComparisonRows: HireComparisonRow[] = [
  {
    label: "Vetting",
    codebility: yes("Pre-vetted, interviewed by you"),
    freelance: partial("You screen every candidate"),
    agency: yes("Vetted by the agency"),
  },
  {
    label: "Time to start",
    codebility: yes("Shortlist after one call"),
    freelance: partial("Depends on your search"),
    agency: partial("Weeks of scoping"),
  },
  {
    label: "Team support",
    codebility: yes("Mentor and team lead support"),
    freelance: no("On their own"),
    agency: yes("Project managers"),
  },
  {
    label: "Flexibility",
    codebility: yes("One developer up to a full team"),
    freelance: yes("Per task"),
    agency: no("Fixed scopes and contracts"),
  },
  {
    label: "Replacement",
    codebility: yes("We replace if it isn't a fit"),
    freelance: no("Start your search again"),
    agency: partial("Depends on the contract"),
  },
  {
    label: "Your involvement",
    codebility: yes("Works inside your team and tools"),
    freelance: partial("Varies by person"),
    agency: partial("Mostly through the agency"),
  },
];

export const hireProofStats = [
  { value: "120+", label: "Projects shipped" },
  { value: "12", label: "Partner companies" },
  { value: "4.9/5", label: "Client rating" },
];

export const hireProofLogos: {
  name: ClientLogoName;
  className: string;
}[] = [
  {
    name: "tolle-design",
    className: "brightness-0 invert opacity-70",
  },
  { name: "web-divine", className: "opacity-80" },
  {
    name: "bradwell",
    className: "brightness-0 invert opacity-70",
  },
  {
    name: "federal-plans",
    className: "brightness-0 invert opacity-70",
  },
];

export const hireTestimonial = {
  quote:
    "Codebility gave us a dedicated team within a week. We shipped our MVP on schedule and kept the same developers for the next release.",
  name: "Maya Reyes",
  role: "Head of Product, Brightline",
  initials: "MR",
};

export type HireFaqCategory =
  | "hiring"
  | "contracts"
  | "time-zones"
  | "quality";

export interface HireFaqCategoryItem {
  value: HireFaqCategory;
  label: string;
  count: number;
  icon: LucideIcon;
}

export const hireFaqCategories: HireFaqCategoryItem[] = [
  { value: "hiring", label: "Hiring", count: 4, icon: Users },
  {
    value: "contracts",
    label: "Contracts & billing",
    count: 3,
    icon: CreditCard,
  },
  {
    value: "time-zones",
    label: "Time zones & work",
    count: 3,
    icon: Clock,
  },
  { value: "quality", label: "Quality & IP", count: 3, icon: ShieldCheck },
];

export interface HireFaqItem {
  category: HireFaqCategory;
  question: string;
  answer: string;
}

export const hireFaqs: HireFaqItem[] = [
  {
    category: "hiring",
    question: "How quickly can a developer start?",
    answer:
      "After a discovery call we share 3-5 matching CoDevs. You interview them and choose who joins, before any work starts.",
  },
  {
    category: "hiring",
    question: "What if the developer isn't the right fit?",
    answer:
      "We rematch you with another vetted CoDev. You can also replace a developer during the engagement if the fit is not right.",
  },
  {
    category: "hiring",
    question: "Can I hire part-time?",
    answer:
      "Yes. We offer part-time support for maintenance, short sprints and teams that need extra hands without a full-time commitment.",
  },
  {
    category: "hiring",
    question: "Who owns the code and design files?",
    answer:
      "You do. Code, designs, repositories and documentation are handed over to your team.",
  },
  {
    category: "contracts",
    question: "How do payments work?",
    answer:
      "We agree on a monthly or project scope before work starts. Invoices are issued on a fixed schedule.",
  },
  {
    category: "contracts",
    question: "Can I pay monthly?",
    answer:
      "Yes. Monthly billing is available for ongoing CoDev placements and part-time support.",
  },
  {
    category: "contracts",
    question: "Are there long-term contracts?",
    answer:
      "You can start with a short engagement and extend it when the fit is right. There is no long-term lock-in.",
  },
  {
    category: "time-zones",
    question: "Which time zones do you cover?",
    answer:
      "We match CoDevs to your working hours across US, EU and APAC time zones.",
  },
  {
    category: "time-zones",
    question: "Can CoDevs work my hours?",
    answer:
      "Yes. Dedicated CoDevs work your hours and join your standups, tools and communication channels.",
  },
  {
    category: "time-zones",
    question: "How many hours per week?",
    answer:
      "Full-time CoDevs work 40 hours per week. Part-time support can be scoped around your needs.",
  },
  {
    category: "quality",
    question: "How are CoDevs vetted?",
    answer:
      "Every CoDev is interviewed, skill-tested and backed by a mentor before joining a client team.",
  },
  {
    category: "quality",
    question: "Do I get full code ownership?",
    answer:
      "Yes. All code, design files and project documentation are transferred to you at hand-over.",
  },
  {
    category: "quality",
    question: "Is there a replacement period?",
    answer:
      "Yes. We replace a CoDev if the fit is not right, so your delivery stays on track.",
  },
];

export interface HireCtaFeature {
  icon: LucideIcon;
  label: string;
}

export const hireCtaFeatures: HireCtaFeature[] = [
  { icon: Clock, label: "Free 30-minute consultation" },
  { icon: Users, label: "3-5 matching CoDevs to interview" },
  { icon: CheckCircle2, label: "No commitment until you choose" },
];
