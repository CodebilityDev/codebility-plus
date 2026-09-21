"use client";

import { useState } from "react";
import { getClientSupabase } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { badgePrefixFor } from "@/lib/shared/badges";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SkillCategory {
  id: string;
  name: string;
  badge_prefix?: string;
}

interface CodevLevelData {
  [key: string]: number;
}

interface CodevBadgeProps {
  level: CodevLevelData;
  size?: number;
  className?: string;
  categories?: SkillCategory[];
}

export default function CodevBadge({
  level,
  size = 36,
  className = "",
  categories,
}: CodevBadgeProps) {
  const [error, setError] = useState<string | null>(null);
  const [badgeErrors, setBadgeErrors] = useState<Record<string, boolean>>({});

  // Server-rendered pages pass categories down; other callers share one cached
  // request through the query cache instead of one query per badge.
  const { data: fetched } = useQuery({
    queryKey: ["reference", "skillCategories"],
    queryFn: async () => {
      const { data, error } = await getClientSupabase()
        .from("skill_category")
        .select("id, name");
      if (error) throw error;
      return (data ?? []) as SkillCategory[];
    },
    enabled: !categories,
    staleTime: 5 * 60_000,
    gcTime: 30 * 60_000,
  });

  const skillCategories = categories ?? fetched ?? [];

  // Create a fallback badge for when images fail to load
  const FallbackBadge = ({
    categoryName,
    levelNumber,
  }: {
    categoryName: string;
    levelNumber: number;
  }) => {
    // Generate a deterministic color based on category name
    const getColor = (str: string) => {
      const colors = [
        "#3498db", // blue
        "#2ecc71", // green
        "#9b59b6", // purple
        "#e74c3c", // red
        "#f39c12", // orange
        "#1abc9c", // teal
      ];
      const hash = str
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return colors[hash % colors.length];
    };

    const bgColor = getColor(categoryName);
    const shortName = categoryName.substring(0, 2).toUpperCase();

    return (
      <div
        style={{ backgroundColor: bgColor, width: size, height: size }}
        className="flex items-center justify-center rounded-full font-bold text-white"
      >
        <div className="flex flex-col items-center justify-center">
          <span className="text-xs">{shortName}</span>
          <span className="text-xs">L{levelNumber}</span>
        </div>
      </div>
    );
  };

  if (error) {
    return <div className="text-sm text-red-500">{error}</div>;
  }

  if (!level || Object.keys(level).length === 0) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className={`flex gap-1 ${className}`}>
        {Object.entries(level).map(([categoryId, levelNumber]) => {
          const category = skillCategories.find((cat) => cat.id === categoryId);
          if (!category) return null;

          const prefix = category.badge_prefix ?? badgePrefixFor(category.name);
          const badgeName =
            levelNumber >= 6
              ? `${prefix}-tier-champion.svg`
              : `${prefix}-tier-${levelNumber}.svg`;

          const badgePath = `/assets/svgs/badges/${badgeName}`;
          const hasError = badgeErrors[categoryId];

          return (
            <Tooltip key={categoryId}>
              <TooltipTrigger asChild>
                <div className="cursor-pointer transition-transform duration-200 hover:scale-110">
                  {hasError ? (
                    <FallbackBadge
                      categoryName={category.name}
                      levelNumber={levelNumber}
                    />
                  ) : (
                    <img
                      src={badgePath}
                      alt={`${category.name} Level ${levelNumber} Badge`}
                      width={size}
                      height={size}
                      className="object-contain"
                      onError={(e) => {
                        // Track which badges have errors
                        setBadgeErrors((prev) => ({
                          ...prev,
                          [categoryId]: true,
                        }));

                      }}
                    />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{category.name} - Level {levelNumber}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
