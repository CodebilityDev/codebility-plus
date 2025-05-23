"use client";

import { useEffect, useState } from "react";
import { createClientClientComponent } from "@/utils/supabase/client";

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
}

// Helper function to get badge prefix from skill category name
function getBadgePrefix(name: string): string {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("frontend")) return "fe";
  if (lowerName.includes("backend")) return "be";
  if (lowerName.includes("mobile")) return "md";
  if (lowerName.includes("ui") || lowerName.includes("ux")) return "uiux";
  return name.substring(0, 2).toLowerCase();
}

export default function CodevBadge({
  level,
  size = 36,
  className = "",
}: CodevBadgeProps) {
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [badgeErrors, setBadgeErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchSkillCategories = async () => {
      const supabase = createClientClientComponent();

      try {
        const { data, error } = await supabase
          .from("skill_category")
          .select("id, name");

        if (error) throw error;

        if (data) {
          const categoriesWithPrefix = data.map((category) => ({
            ...category,
            badge_prefix: getBadgePrefix(category.name),
          }));
          setSkillCategories(categoriesWithPrefix);
        }
      } catch (err) {
        console.error("Error fetching skill categories:", err);
        setError("Failed to load badges");
      }
    };

    fetchSkillCategories();
  }, []);

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
    <div className={`flex gap-1 ${className}`}>
      {Object.entries(level).map(([categoryId, levelNumber]) => {
        const category = skillCategories.find((cat) => cat.id === categoryId);
        if (!category) return null;

        const prefix = category.badge_prefix;
        const badgeName =
          levelNumber >= 6
            ? `${prefix}-tier-champion.svg`
            : `${prefix}-tier-${levelNumber}.svg`;

        const badgePath = `/assets/svgs/badges/${badgeName}`;
        const hasError = badgeErrors[categoryId];

        return (
          <div key={categoryId} className="group relative cursor-pointer">
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
                className="object-contain transition-transform duration-200 group-hover:scale-110"
                onError={(e) => {
                  // Track which badges have errors
                  setBadgeErrors((prev) => ({
                    ...prev,
                    [categoryId]: true,
                  }));

                  // We no longer need this since we'll render the fallback component
                  // e.currentTarget.src = "/assets/svgs/badges/default-badge.svg";

                  // Log the error for debugging
                  console.log(
                    `Badge not found: ${badgePath}, falling back to generated badge`,
                  );
                }}
              />
            )}
            {/* Custom hover tooltip */}
            <div
              className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded
             bg-slate-700 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100"
            >
              {category.name} - Level {levelNumber}
            </div>
          </div>
        );
      })}
    </div>
  );
}
