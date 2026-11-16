import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import {
  categoryForProject,
  categoryLabel,
  portfolioCategories,
  portfolioCategoryCount,
  portfolioCuratedGridNames,
  portfolioDetailOrder,
  portfolioFeaturedName,
  portfolioPartnerCount,
  portfolioProjectOverrides,
  portfolioRating,
  portfolioSecondaryNames,
} from "@/constants/landing/services/content";
import { CACHE_TAGS } from "@/lib/global/cache-tags";
import { createClientAnon } from "@/lib/global/supabase-anon";
import type {
  PortfolioCategoryId,
  PortfolioData,
  PortfolioProject,
  PortfolioProjectDetail,
} from "@/types/landing/services/portfolio";

const PROJECT_SELECT = `
  id,
  name,
  main_image,
  description,
  website_url
`;

interface ProjectRow {
  id: string;
  name: string;
  main_image: string | null;
  description: string | null;
  website_url: string | null;
}

function cleanWebsite(value: string | null) {
  const url = value?.trim();

  if (!url || url === "." || /^n\/?a$/i.test(url)) return undefined;

  return url;
}

function cleanDescription(value: string | null) {
  const description = value?.replace(/\s+/g, " ").trim();

  if (!description) return "A Codebility project.";

  return description.length > 180
    ? `${description.slice(0, 177).trimEnd()}...`
    : description;
}

function mapProject(row: ProjectRow): PortfolioProject {
  const categories = categoryForProject(row.name);
  const override = portfolioProjectOverrides[row.name];
  const badge = override?.badge ?? categoryLabel(categories);

  const fullDescription =
    override?.description ?? row.description?.replace(/\s+/g, " ").trim() ??
    "A Codebility project.";

  return {
    id: row.id,
    sourceName: row.name,
    name: override?.name ?? row.name,
    description: override?.description ?? cleanDescription(row.description),
    fullDescription,
    imageSrc: row.main_image ?? undefined,
    websiteUrl: cleanWebsite(row.website_url),
    categories,
    badge,
  };
}

function sortProjects(projects: PortfolioProject[]) {
  const order = new Map(
    portfolioCuratedGridNames.map((name, index) => [name, index]),
  );

  return [...projects].sort((a, b) => {
    const aIndex = order.get(a.sourceName) ?? Number.MAX_SAFE_INTEGER;
    const bIndex = order.get(b.sourceName) ?? Number.MAX_SAFE_INTEGER;

    if (aIndex !== bIndex) return aIndex - bIndex;
    return a.name.localeCompare(b.name);
  });
}

export async function getCachedPortfolioData(): Promise<PortfolioData> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.servicesProjects);

  const { data, error } = await createClientAnon()
    .from("projects")
    .select(PROJECT_SELECT)
    .eq("public_display", true)
    .order("id", { ascending: true });

  if (error) {
    throw new Error(`Failed to load portfolio projects: ${error.message}`, {
      cause: error,
    });
  }

  const projects = sortProjects(
    (data as unknown as ProjectRow[]).map(mapProject),
  );
  const categories = portfolioCategories.map((category) => ({
    ...category,
    count: portfolioCategoryCount(projects, category.id),
  }));
  const featured = projects.find(
    (project) => project.sourceName === portfolioFeaturedName,
  );
  const secondary = portfolioSecondaryNames.flatMap((name) => {
    const project = projects.find((item) => item.sourceName === name);
    return project ? [project] : [];
  });

  return {
    projects,
    featured,
    secondary,
    counts: {
      projects: projects.length,
      services: portfolioCategories.length - 1,
      partners: portfolioPartnerCount,
      live: projects.filter((project) => project.websiteUrl).length,
      rating: portfolioRating,
    },
    categories,
  };
}

function orderProjectsForDetail(projects: PortfolioProject[]) {
  const preferred = new Map(
    portfolioDetailOrder.map((name, index) => [name, index]),
  );

  return [...projects].sort((a, b) => {
    const aIndex = preferred.get(a.sourceName);
    const bIndex = preferred.get(b.sourceName);

    if (aIndex !== undefined || bIndex !== undefined) {
      return (aIndex ?? Number.MAX_SAFE_INTEGER) -
        (bIndex ?? Number.MAX_SAFE_INTEGER);
    }

    return a.name.localeCompare(b.name);
  });
}

export async function getCachedPortfolioProjectDetail(
  projectId: string,
): Promise<PortfolioProjectDetail> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.servicesProjects);

  const data = await getCachedPortfolioData();
  const ordered = orderProjectsForDetail(data.projects);
  const index = ordered.findIndex((project) => project.id === projectId);

  if (index < 0) return { project: undefined };

  return {
    project: ordered[index],
    previous: ordered[index - 1],
    next: ordered[index + 1],
  };
}

export interface PortfolioPage {
  projects: PortfolioProject[];
  total: number;
  hasMore: boolean;
}

export async function getCachedPortfolioPage(
  category: PortfolioCategoryId,
  search: string,
  offset: number,
  limit: number,
): Promise<PortfolioPage> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.servicesProjects);

  const data = await getCachedPortfolioData();
  const projects = selectPortfolioProjects(data.projects, {
    category,
    search,
    limit: offset + limit,
  }).slice(offset);
  const total = countPortfolioProjects(data.projects, category, search);

  return {
    projects,
    total,
    hasMore: offset + projects.length < total,
  };
}

export function selectPortfolioProjects(
  projects: PortfolioProject[],
  options: {
    category: PortfolioCategoryId;
    search: string;
    limit: number;
  },
) {
  const search = options.search.trim().toLowerCase();

  return projects
    .filter(
      (project) =>
        options.category === "all" ||
        project.categories.includes(options.category),
    )
    .filter(
      (project) =>
        !search ||
        project.name.toLowerCase().includes(search) ||
        project.description.toLowerCase().includes(search) ||
        project.badge.toLowerCase().includes(search),
    )
    .slice(0, options.limit);
}

export function countPortfolioProjects(
  projects: PortfolioProject[],
  category: PortfolioCategoryId,
  search: string,
) {
  const term = search.trim().toLowerCase();

  return projects.filter(
    (project) =>
      (category === "all" || project.categories.includes(category)) &&
      (!term ||
        project.name.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        project.badge.toLowerCase().includes(term)),
  ).length;
}
