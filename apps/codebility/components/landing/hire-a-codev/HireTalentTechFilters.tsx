"use client";

import { useSearchParams } from "next/navigation";

import { HireTalentTechBar } from "@/components/landing/hire-a-codev/HireTalentTechBar";
import { useHireTalentNavigate } from "@/components/landing/hire-a-codev/HireTalentTransition";
import {
  normalizeHireTalentFilter,
  normalizeHireTalentTech,
} from "@/constants/landing/hire-a-codev/content";

export function HireTalentTechFilters() {
  const searchParams = useSearchParams();
  const navigate = useHireTalentNavigate();

  return (
    <HireTalentTechBar
      activeFilter={normalizeHireTalentFilter(searchParams.get("filter"))}
      activeTech={normalizeHireTalentTech(searchParams.get("tech"))}
      onNavigate={navigate}
    />
  );
}
