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
