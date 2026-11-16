import type {
  PortfolioCategory,
  PortfolioCategoryId,
  PortfolioProject,
} from "@/types/landing/services/portfolio";

export const portfolioCategories: PortfolioCategory[] = [
  { id: "all", label: "All projects", badge: "All", icon: "grid" },
  { id: "web-apps", label: "Web Apps", badge: "Web App", icon: "globe" },
  {
    id: "cms-storefronts",
    label: "CMS & Storefronts",
    badge: "CMS",
    icon: "store",
  },
  {
    id: "mobile-apps",
    label: "Mobile Apps",
    badge: "Mobile App",
    icon: "mobile",
  },
  {
    id: "product-design",
    label: "Product Design",
    badge: "Product Design",
    icon: "pen",
  },
  {
    id: "ai-development",
    label: "AI Development",
    badge: "AI Development",
    icon: "sparkles",
  },
];

export const portfolioProjectCategories: Record<
  string,
  Exclude<PortfolioCategoryId, "all">[]
> = {
  Oohray: ["web-apps"],
  "NetMediaSolutions Website": ["web-apps"],
  Sariverse: ["web-apps"],
  "Pinoy Overflow": ["web-apps"],
  ZwiftTech: ["web-apps"],
  "Hosanna Eternal ERP System": ["web-apps"],
  "Kolekta Base": ["web-apps"],
  "Codev Play": ["web-apps"],
  "Codebility Portal": ["web-apps"],
  TapUp: ["web-apps"],
  "Coffee app": ["web-apps", "product-design"],
  Eribe: ["cms-storefronts"],
  "MN + LA": ["cms-storefronts"],
  "Natures Premium": ["cms-storefronts"],
  Rafiki: ["cms-storefronts"],
  "Bridal Apparel": ["cms-storefronts"],
  Aeromech: ["cms-storefronts"],
  "House of Bimbi": ["cms-storefronts"],
  "Case Mate": ["cms-storefronts"],
  "Savvy & Shine": ["cms-storefronts"],
  "Light My Bricks": ["cms-storefronts"],
  Arwall: ["cms-storefronts"],
  "Outlast Car Battery App": ["mobile-apps"],
  Prixu: ["mobile-apps"],
  "Travel Tribe": ["mobile-apps"],
  Showboat: ["mobile-apps"],
  Memora: ["mobile-apps"],
  "Highland Bali": ["mobile-apps"],
  Taskbuddy: ["mobile-apps"],
  Applete: ["mobile-apps"],
  PickADex: ["mobile-apps"],
  "Crypto Profit": ["mobile-apps"],
  "Wedding App Design": ["product-design"],
  Gingko: ["product-design"],
  Subtract: ["product-design"],
  "Pawmed AI": ["ai-development"],
  Agenstly: ["ai-development", "web-apps"],
};

interface PortfolioProjectOverride {
  name?: string;
  description?: string;
  badge?: string;
}

export const portfolioProjectOverrides: Record<
  string,
  PortfolioProjectOverride
> = {
  Agenstly: { name: "Agentsly.ai" },
  "Hosanna Eternal ERP System": {
    name: "Hosanna Eternal ERP",
    description:
      "Operations and records system for a Singapore services company.",
    badge: "Web App",
  },
  "Natures Premium": {
    name: "Nature's Premium",
    description: "Skincare storefront · CMS",
    badge: "CMS",
  },
  Sariverse: {
    name: "Sarverse",
    description: "Small-business platform · Web App",
    badge: "Web App",
  },
  Memora: { description: "Photo memories · Mobile App", badge: "Mobile App" },
  "House of Bimbi": {
    description: "Fashion storefront · CMS",
    badge: "CMS",
  },
  Eribe: {
    name: "Erbie",
    description:
      "Shopify storefront for Scotland's leading hair tie brand.",
    badge: "CMS",
  },
  TapUp: {
    description:
      "NFC-enabled digital business cards with customizable templates.",
    badge: "Web App",
  },
  Prixu: {
    name: "Prau",
    description: "Mobile app with a clean, card-based shopping flow.",
    badge: "Mobile App",
  },
  Gingko: {
    description:
      "Interior design platform for a Singapore brand, live in production.",
    badge: "Mobile App",
  },
  "Case Mate": {
    description:
      "Content-managed storefront for a phone accessories brand.",
    badge: "CMS",
  },
  "Travel Tribe": {
    description: "Travel discovery app with maps and curated trips.",
    badge: "Mobile App",
  },
  Rafiki: {
    description: "Content-managed site for an Australian food brand.",
    badge: "CMS",
  },
  "Wedding App Design": {
    description: "End-to-end UX and UI for a wedding planning app.",
    badge: "Product Design",
  },
};

export const portfolioFeaturedName = "Agenstly";

export const portfolioSecondaryNames = [
  "Natures Premium",
  "Sariverse",
  "Memora",
  "House of Bimbi",
];

export const portfolioCuratedGridNames = [
  "Eribe",
  "TapUp",
  "Prixu",
  "Hosanna Eternal ERP System",
  "Gingko",
  "Case Mate",
  "Travel Tribe",
  "Rafiki",
  "Wedding App Design",
];

export const portfolioCtaProjectNames = [
  "TapUp",
  "Wedding App Design",
  "Prixu",
  "Hosanna Eternal ERP System",
];

export const portfolioHero = {
  eyebrow: "OUR PORTFOLIO",
  title: "Products we've",
  accent: "designed & shipped",
  description:
    "Web apps, mobile apps, AI tools and storefronts, built by Codebility teams for clients around the world.",
  stats: [
    { value: "37", label: "Projects" },
    { value: "5", label: "Services" },
    { value: "12", label: "Partner companies" },
  ],
};

export const portfolioFeaturedCopy = {
  eyebrow: "FEATURED",
  liveLabel: "Live",
  title: "Agentsly.ai",
  description:
    "An AI platform for the insurance industry, built as a web application with AI features at its core.",
  thumbnailMeta: "AI platform · AI Development",
  features: [
    { icon: "sparkles", label: "AI Development", value: "Intelligent features inside the product" },
    { icon: "globe", label: "Web Application", value: "Responsive platform for daily use" },
    { icon: "briefcase", label: "Industry", value: "Insurance" },
    { icon: "users", label: "Team", value: "Codebility CoDevs" },
  ],
  viewLabel: "View project",
  liveCta: "Visit live site",
};

export const portfolioBrowse = {
  eyebrow: "ALL WORK",
  title: "Browse by what we build",
  searchPlaceholder: "Search projects...",
  empty: "No projects match this filter yet.",
  loadingMore: "Loading more projects",
  loadError: "Could not load more projects.",
  retry: "Try again",
  showingLabel: "Showing",
  projectOne: "project",
  projectMany: "projects",
  sidebarTitle: "Have a project in mind?",
  sidebarDescription:
    "Tell us what you're building. We'll match you with the right CoDevs.",
  sidebarCta: "Book a Call",
};

export const portfolioProof = {
  eyebrow: "PROOF OF WORK",
  title: "Real products, really in use",
  titleLead: "Real products,",
  titleAccent: "really in use",
  description:
    "Not concepts. Most of what you see here is live and serving customers today.",
  stats: [
    {
      value: "37",
      label: "Projects showcased",
      description: "Across web, mobile, AI and e-commerce.",
      icon: "briefcase",
    },
    {
      value: "16",
      label: "Live in production",
      description: "Sites and apps you can open right now.",
      icon: "external",
    },
    {
      value: "12",
      label: "Partner companies",
      description: "From startups to established brands.",
      icon: "building",
    },
    {
      value: "4.9/5",
      label: "Client rating",
      description: "Average rating from engagements.",
      icon: "award",
    },
  ],
  testimonial: {
    quote:
      "Codebility rebuilt our storefront and kept it running smoothly through launch. Fast, clear and easy to work with.",
    name: "Maya Reyes",
    role: "Head of Product, Brightline",
    initials: "MR",
    projectName: "Eribe",
    projectLabel: "On the project",
  },
};

export const portfolioCta = {
  eyebrow: "YOUR PROJECT NEXT",
  title: "Let's add your product to this page",
  titleLead: "Let's add your product",
  titleAccent: "to this page",
  description:
    "A free 30-minute call to scope your idea, timeline and team.",
  primaryLabel: "Book a Strategy Call",
  primaryHref: "/bookacall",
  secondaryLabel: "Hire CoDevs",
  secondaryHref: "/hire-a-codev",
};

export const portfolioCategoryCounts: Record<PortfolioCategoryId, number> = {
  all: 37,
  "web-apps": 12,
  "cms-storefronts": 11,
  "mobile-apps": 10,
  "product-design": 4,
  "ai-development": 2,
};

export const portfolioPageSize = 9;
export const portfolioPartnerCount = 12;
export const portfolioRating = "4.9/5";

export function categoryForProject(name: string): Exclude<
  PortfolioCategoryId,
  "all"
>[] {
  return portfolioProjectCategories[name] ?? ["web-apps"];
}

export function categoryLabel(
  categories: Exclude<PortfolioCategoryId, "all">[],
): string {
  const first = categories[0] ?? "web-apps";
  return (
    portfolioCategories.find((category) => category.id === first)?.badge ??
    "Web App"
  );
}

export function portfolioBadge(
  project: PortfolioProject,
  categories: Exclude<PortfolioCategoryId, "all">[],
): string {
  return (
    portfolioProjectOverrides[project.name]?.badge ??
    categoryLabel(categories)
  );
}

export function normalizePortfolioCategory(
  value: string | string[] | null | undefined,
): PortfolioCategoryId {
  const candidate = Array.isArray(value) ? value[0] : value;

  return portfolioCategories.some((category) => category.id === candidate)
    ? (candidate as PortfolioCategoryId)
    : "all";
}

export function portfolioHref(options: {
  category?: PortfolioCategoryId;
  search?: string;
  project?: string;
}) {
  const params = new URLSearchParams();

  if (options.category && options.category !== "all") {
    params.set("category", options.category);
  }
  if (options.search) params.set("search", options.search);
  if (options.project) params.set("project", options.project);

  const query = params.toString();
  return `/services${query ? `?${query}` : ""}#projects`;
}

export function portfolioCategoryCount(
  projects: PortfolioProject[],
  category: PortfolioCategoryId,
) {
  if (category === "all") return projects.length;

  return projects.filter((project) => project.categories.includes(category))
    .length;
}
