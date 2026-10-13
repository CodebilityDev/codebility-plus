import type { Particle } from "@/types/marketing/marketing";
import { Briefcase, Info, Phone, CodeXml, Search, Rocket } from "lucide-react";

export const VARIANT_CONFIG = {
  hero: {
    countDuration: 2,
  },
  stat: {
    countDuration: 2.5,
  },
} as const;

export const EMPTY_PARTICLES: Particle[] = [];

export const PARTICLE_COLORS = [
  "rgba(147, 71, 255, 0.4)",
  "rgba(2, 255, 226, 0.3)",
  "rgba(106, 120, 242, 0.3)",
  "rgba(255, 255, 255, 0.2)",
] as const;

export const ORB_COLORS = [
  "rgba(147, 71, 255, 0.55)",
  "rgba(2, 255, 226, 0.4)",
] as const;

export const LITE_QUERY = "(max-width: 767px), (prefers-reduced-motion: reduce)";

export const ADMIN_CARD_COUNT = 9;

export const MENTOR_CARD_COUNT = 8;

export const HIGHLIGHT_METRICS = [
  { label: "Projects shipped", display: "120+" },
  { label: "Avg. client satisfaction", display: "4.9/5" },
  { label: "Specialists on demand", display: "80+" },
];

export const ROLE_CONFIG = {
  INTERN: "Intern" as const,
  CODEV: "Codev" as const,
} as const;

export const ROLE_STYLES = {
  [ROLE_CONFIG.INTERN]: {
    cardClass: "bg-black-800 border-neutral-700",
    badgeClass: "bg-green-600/30 text-green-300 border border-green-500/30",
    label: "Intern",
  },
  [ROLE_CONFIG.CODEV]: {
    cardClass:
      "bg-gradient-to-br from-blue-900/90 to-black-800 border-blue-700/50",
    badgeClass: "bg-blue-600/30 text-blue-300 border border-blue-500/30",
    label: "Codev",
  },
} as const;

export const PAGE_SIZE = 10;

export const CARD_COUNT = 10;

export const partners = [
  {
    name: "Genius Web Services",
    logo: "/assets/images/partners/genius-web-services.png",
  },
  { name: "Travel Tribe", logo: "/assets/images/partners/travel-tribe.png" },
  { name: "Netmedia", logo: "/assets/images/partners/netmedia.png" },
  { name: "Zwift Tech", logo: "/assets/images/partners/zwift-tech.png" },
  { name: "Bradwell", logo: "/assets/images/partners/bradwell.png" },
  { name: "Ai", logo: "/assets/images/partners/ai.png" },
  { name: "Averps", logo: "/assets/images/partners/averps.png" },
  { name: "Tolle Design", logo: "/assets/images/partners/tolle-design.png" },
  { name: "Infraspan", logo: "/assets/images/partners/infraspan.png" },
  {
    name: "Federal PLANS",
    logo: "/assets/images/partners/federal-plans.png",
  },
  { name: "Web Divine", logo: "/assets/images/partners/web-divine.png" },
  { name: "FixFlow.ai", logo: "/assets/images/partners/fixflow-ai.png" },
];

export const WORK_WITH_US_CARDS = [
  {
    id: "portfolio",
    title: "Our Portfolio",
    description:
      "Build your next digital experience with a team that delivers reliable, cutting-edge work from discovery to launch.",
    linkText: "Explore Work",
  },
  {
    id: "hire-developers",
    title: "Hire Developers",
    description:
      "Accelerate delivery with vetted engineers, designers, and strategists who integrate seamlessly with your roadmap.",
    linkText: "Hire CoDevs",
  },
  {
    id: "developer-journey",
    title: "Be a Codev",
    description:
      "Join our community, sharpen your craft through real projects, and unlock career opportunities across the globe.",
    linkText: "Join the Program",
  },
  {
    id: "careers",
    title: "Career Opportunities",
    description:
      "Explore exciting career opportunities with our team. Join a dynamic environment where innovation meets collaboration.",
    linkText: "View Careers",
  },
] as const;

export const WorkWithUsWORK_WITH_US_CARDS = [
  {
    id: "portfolio",
    title: "Our Portfolio",
    image: {
      src: "https://codebility-cdn.pages.dev/assets/images/index/projects-large.jpg",
      alt: "portfolio projects",
    },
    description:
      "Build your next digital experience with a team that delivers reliable, cutting-edge work from discovery to launch.",
    link: {
      href: "/services",
      text: "Explore Work",
    },
  },
  {
    id: "hire-developers",
    title: "Hire Developers",
    image: {
      src: "https://codebility-cdn.pages.dev/assets/images/index/codevs-large.jpg",
      alt: "professional developers",
    },
    description:
      "Accelerate delivery with vetted engineers, designers, and strategists who integrate seamlessly with your roadmap.",
    link: {
      href: "/hire-a-codev",
      text: "Hire CoDevs",
    },
  },
  {
    id: "developer-journey",
    title: "Be a Codev",
    image: {
      src: "/assets/images/index/image.png",
      alt: "become a codev developer",
    },
    description:
      "Join our community, sharpen your craft through real projects, and unlock career opportunities across the globe.",
    link: {
      href: "/codevs",
      text: "Join the Program",
    },
  },
  {
    id: "careers",
    title: "Career Opportunities",
    image: {
      src: "/assets/images/services/black-and-purple-abstract.png",
      alt: "career opportunities and job openings04",
    },
    description:
      "Explore exciting career opportunities with our team. Join a dynamic environment where innovation meets collaboration.",
    link: {
      href: "/careers",
      text: "View Careers",
    },
  },
];

export const links = [
  { href: "/services", label: "Our Services", icon: Briefcase },
  { href: "/#whychooseus", label: "About Us", icon: Info },
  { href: "/bookacall", label: "Book a Call", icon: Phone },
  { href: "/codevs", label: "Be a Codev", icon: CodeXml },
  { href: "/hire-a-codev", label: "Hire Codevs", icon: Search },
  { href: "/careers", label: "Careers", icon: Rocket },
];

export const SCROLL_SHRINK_Y = 200;
