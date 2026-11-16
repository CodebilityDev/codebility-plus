export type PortfolioCategoryId =
  | "all"
  | "web-apps"
  | "cms-storefronts"
  | "mobile-apps"
  | "product-design"
  | "ai-development";

export interface PortfolioCategory {
  id: PortfolioCategoryId;
  label: string;
  badge: string;
  icon: "grid" | "globe" | "store" | "mobile" | "pen" | "sparkles";
}

export interface PortfolioCategoryWithCount extends PortfolioCategory {
  count: number;
}

export interface PortfolioProject {
  id: string;
  sourceName: string;
  name: string;
  description: string;
  fullDescription: string;
  imageSrc?: string;
  websiteUrl?: string;
  categories: Exclude<PortfolioCategoryId, "all">[];
  badge: string;
}

export type PortfolioScreenTab = "Web" | "Mobile" | "Cards";

export interface PortfolioScreen {
  id: string;
  label: string;
  tab: PortfolioScreenTab;
  mode: "browser" | "phone";
  objectPosition: string;
}

export interface PortfolioProjectDetail {
  project?: PortfolioProject;
  previous?: PortfolioProject;
  next?: PortfolioProject;
}

export interface PortfolioCounts {
  projects: number;
  services: number;
  partners: number;
  live: number;
  rating: string;
}

export interface PortfolioData {
  projects: PortfolioProject[];
  featured?: PortfolioProject;
  secondary: PortfolioProject[];
  counts: PortfolioCounts;
  categories: PortfolioCategoryWithCount[];
}
