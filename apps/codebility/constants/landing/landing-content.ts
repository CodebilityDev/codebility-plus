import {
  Clock,
  LayoutGrid,
  Monitor,
  Palette,
  Rocket,
  Smartphone,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { ClientLogoName } from "@/components/global/design-system/ClientLogo";

export interface LandingNavLink {
  label: string;
  href: string;
}

export const landingNavLinks: LandingNavLink[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "CoDevs", href: "/codevs" },
  { label: "Careers", href: "/careers" },
  { label: "About", href: "/#people" },
];

export const heroTags = [
  "React",
  "Next.js",
  "Flutter",
  "Node.js",
  "UI/UX",
  "AI / ML",
  "Laravel",
];

export interface LandingHeroStat {
  value: string;
  lead?: string;
  label: string;
}

export const heroStats: LandingHeroStat[] = [
  { value: "120+", lead: "projects", label: "shipped for clients" },
  { value: "4.9/5", label: "average client rating" },
  { value: "100+", lead: "vetted", label: "developers on demand" },
];

export interface LandingPerson {
  name: string;
  role: string;
  initials: string;
  imageSrc?: string;
  skills?: string[];
  verified?: boolean;
  badgeRole?: "admin" | "mentor" | "codev";
  badgeLabel?: string;
}

export const heroPeople: LandingPerson[] = [
  {
    name: "Hallen Corpuz",
    role: "Full Stack Developer",
    initials: "HC",
    skills: ["Mobile", "Backend", "Frontend"],
    verified: true,
  },
  {
    name: "Alyssa Lyn Jecome",
    role: "Frontend Developer",
    initials: "AJ",
    skills: ["Frontend", "Backend", "QA"],
    verified: true,
  },
  {
    name: "Jan Phillip Dacallos",
    role: "Project Manager",
    initials: "JD",
    skills: ["Frontend", "Backend", "QA"],
    verified: true,
  },
  {
    name: "Wendel Sabayo",
    role: "Full Stack Developer",
    initials: "WS",
    skills: ["Frontend", "Backend", "UI/UX"],
    verified: true,
  },
  {
    name: "Karl Joseph II Sarabia",
    role: "Backend Developer",
    initials: "KS",
    skills: ["Backend", "Mobile"],
    verified: true,
  },
];

export const people: LandingPerson[] = [
  {
    name: "Jzeff Kendrew Somera",
    role: "Founder / CEO",
    initials: "JS",
    imageSrc: "/assets/images/landing/jeff-kendrew-somera.png",
    badgeRole: "admin",
    badgeLabel: "Admin",
  },
  {
    name: "Jan Phillip Dacallos",
    role: "Project Manager",
    initials: "JD",
    imageSrc: "/assets/images/landing/jan-phillip-dacallos.png",
    badgeRole: "mentor",
    badgeLabel: "Mentor",
  },
  {
    name: "Hallen Corpuz",
    role: "Full Stack Developer",
    initials: "HC",
    imageSrc: "/assets/images/landing/hallen-corpuz.png",
    badgeRole: "codev",
    badgeLabel: "CoDev",
  },
  {
    name: "Bon Jory Pecococo",
    role: "Full Stack Developer",
    initials: "BP",
    imageSrc: "/assets/images/landing/bon-jory-pecococo.png",
    badgeRole: "codev",
    badgeLabel: "CoDev",
  },
];

export interface LandingPartner {
  name: ClientLogoName;
  accent?: boolean;
}

export const partners: LandingPartner[] = [
  { name: "genius-web-services" },
  { name: "travel-tribe" },
  { name: "netmedia" },
  { name: "zwift-tech", accent: true },
  { name: "bradwell" },
  { name: "ai" },
  { name: "averps" },
  { name: "tolle-design" },
  { name: "infraspan" },
  { name: "federal-plans" },
  { name: "web-divine" },
  { name: "fixflow-ai" },
];

export interface LandingService {
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  icon: LucideIcon;
  ctaLabel?: string;
  ctaHref?: string;
  featured?: boolean;
}

export const services: LandingService[] = [
  {
    eyebrow: "Technology",
    title: "AI Development",
    description:
      "Build intelligent AI solutions and integrate them seamlessly into your applications.",
    imageSrc: "/assets/images/index/feature1.jpg",
    icon: Sparkles,
    ctaLabel: "Explore AI integration",
    ctaHref: "/ai-integration",
    featured: true,
  },
  {
    eyebrow: "Engineering",
    title: "Web App Development",
    description: "Turn your ideas into fast, scalable web products.",
    imageSrc: "/assets/images/index/feature3.jpg",
    icon: Monitor,
  },
  {
    eyebrow: "Engineering",
    title: "Mobile App Development",
    description: "Native-quality iOS and Android apps.",
    imageSrc: "/assets/images/index/feature4.jpg",
    icon: Smartphone,
  },
  {
    eyebrow: "Product",
    title: "Product Design",
    description: "UI/UX that users understand on first use.",
    imageSrc: "/assets/images/index/feature5.jpg",
    icon: Palette,
  },
  {
    eyebrow: "Technology",
    title: "CMS",
    description: "Content you can manage without a developer.",
    imageSrc: "/assets/images/index/feature6.jpg",
    icon: LayoutGrid,
  },
];

export interface LandingMetric {
  icon: LucideIcon;
  value: string;
  label: string;
  description: string;
}

export const metrics: LandingMetric[] = [
  {
    icon: Rocket,
    value: "120+",
    label: "Projects shipped",
    description:
      "Web, mobile and AI products launched for startups and established brands.",
  },
  {
    icon: Star,
    value: "4.9/5",
    label: "Average client rating",
    description: "Average rating from client engagements.",
  },
  {
    icon: Users,
    value: "100+",
    label: "Vetted developers",
    description:
      "Engineers, designers and strategists ready to join your team.",
  },
  {
    icon: Clock,
    value: "24/7",
    label: "Support coverage",
    description: "Support available around the clock.",
  },
];

export interface LandingProcessStep {
  number: string;
  title: string;
  meta: string;
  description: string;
  active?: boolean;
}

export const processSteps: LandingProcessStep[] = [
  {
    number: "01",
    title: "Discovery call",
    meta: "Day 1",
    description: "30 minutes to map your goals, scope and budget.",
    active: true,
  },
  {
    number: "02",
    title: "Team matching",
    meta: "Days 2-5",
    description: "We shortlist CoDevs; you interview before anything starts.",
  },
  {
    number: "03",
    title: "Sprint delivery",
    meta: "Ongoing",
    description: "Weekly demos, shared board and one point of contact.",
  },
  {
    number: "04",
    title: "Launch & support",
    meta: "Launch",
    description: "Release, hand-over and continued maintenance.",
  },
];

export const budgetOptions = [
  "< $5k",
  "$5k - $15k",
  "$15k - $50k",
  "$50k+",
  "Not sure yet",
];

export const needOptions = [
  "Web App",
  "Mobile App",
  "AI Development",
  "Product Design",
  "CMS",
  "Hire CoDevs",
];

export interface LandingTestimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
  rating: number;
}

export const landingTestimonials: LandingTestimonial[] = [
  {
    quote:
      "Codebility gave us a dedicated team within a week. We shipped our MVP on schedule and kept the same developers for the next release.",
    name: "Client Name",
    role: "Founder, Partner Company",
    initials: "CN",
    rating: 5,
  },
  {
    quote:
      "Codebility gave us the flexibility to scale without slowing delivery. The developers felt like part of our own team from the first sprint.",
    name: "Maya Reyes",
    role: "Head of Product, Brightline",
    initials: "MR",
    rating: 5,
  },
  {
    quote:
      "We needed a senior team fast. Within days we were shipping features, and the quality stayed strong through launch.",
    name: "Daniel Cruz",
    role: "Founder, Northstar Studio",
    initials: "DC",
    rating: 5,
  },
];

export interface FooterLink {
  label: string;
  href: string;
}

export const footerColumns = [
  {
    title: "Services",
    links: [
      { label: "AI Development", href: "/ai-integration" },
      { label: "Web Apps", href: "/services" },
      { label: "Mobile Apps", href: "/services" },
      { label: "Product Design", href: "/services" },
      { label: "CMS", href: "/services" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/#people" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/#contact" },
    ],
  },
  {
    title: "CoDevs",
    links: [
      { label: "Hire CoDevs", href: "/hire-a-codev" },
      { label: "Be a CoDev", href: "/auth/sign-up" },
      { label: "Mentors", href: "/codevs" },
      { label: "Admins", href: "/codevs" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms & Conditions", href: "/terms-and-conditions" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "FAQs", href: "/faq" },
    ],
  },
] satisfies { title: string; links: FooterLink[] }[];