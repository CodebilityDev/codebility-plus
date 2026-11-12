"use client";

import { useSearchParams } from "next/navigation";

import { HireTalentFilterBar } from "@/components/landing/hire-a-codev/HireTalentFilterBar";
import { useHireTalentNavigate } from "@/components/landing/hire-a-codev/HireTalentTransition";
import {
  normalizeHireTalentFilter,
  normalizeHireTalentTech,
} from "@/constants/landing/hire-a-codev/content";

export function HireTalentFilters() {
  const searchParams = useSearchParams();
  const navigate = useHireTalentNavigate();

  return (
    <HireTalentFilterBar
      activeFilter={normalizeHireTalentFilter(searchParams.get("filter"))}
      activeTech={normalizeHireTalentTech(searchParams.get("tech"))}
      onNavigate={navigate}
    />
  );
}
