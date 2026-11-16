"use server";

import { normalizePortfolioCategory } from "@/constants/landing/services/content";
import { getCachedPortfolioPage } from "@/lib/landing/services/data";
import type { PortfolioCategoryId } from "@/types/landing/services/portfolio";

interface PortfolioPageRequest {
  category: string;
  search: string;
  offset: number;
  limit: number;
}

function normalizeSearch(value: string) {
  return typeof value === "string" ? value.trim().slice(0, 120) : "";
}

function normalizeOffset(value: number) {
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

function normalizeLimit(value: number) {
  return Number.isFinite(value)
    ? Math.min(24, Math.max(1, Math.floor(value)))
    : 9;
}

export async function loadPortfolioPage(input: PortfolioPageRequest) {
  const category: PortfolioCategoryId = normalizePortfolioCategory(
    input.category,
  );

  return getCachedPortfolioPage(
    category,
    normalizeSearch(input.search),
    normalizeOffset(input.offset),
    normalizeLimit(input.limit),
  );
}
