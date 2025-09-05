"use client";

import React, { memo, useCallback } from "react";
import Image from "next/image";
import CodevBadge from "@/components/CodevBadge";
import { Codev, CodevPoints } from "@/types/home/codev";

import { cn } from "@codevs/ui";

export default function SkillPoints({
  points = [],
  type = "default",
}: {
  points: CodevPoints[];
  type?: "default" | "small";
}) {
  const skillCategories: {
    [key: string]: {
      name: string;
      badge_prefix: string;
    };
  } = {
    "059261f5-be65-4872-beaf-0c09524c98eb": {
      name: "UI/UX Designer",
      badge_prefix: "uiux",
    },
    "0dde069d-71fd-4240-b38e-d7c197b4bf1b": {
      name: "Backend Developer",
      badge_prefix: "be",
    },
    "13bf852a-9bca-411f-8643-fbac8b8dd533": {
      name: "Mobile Developer",
      badge_prefix: "md",
    },
    "27dbaa4f-d5f1-41c0-898a-ba19cfe06367": {
      name: "QA Engineer",
      badge_prefix: "qa",
    },
    "96da3c02-a270-4fe7-b079-72642ff9e93e": {
      name: "Frontend Developer",
      badge_prefix: "fe",
    },
  };

  const getLevelInfo = useCallback(
    (points: number) => {
      if (!points) return { level: 0, next: 100, remaining: 100 };

      if (points >= 500) return { level: "Max", next: 500, remaining: 0 };
      const level = Math.floor(points / 100) + 1;
      const next = level * 100;
      const remaining = next - points;
      return { level, next, remaining };
    },
    [points],
  );

  if (type === "small") {
    return (
      <div
        className="flex flex-wrap gap-2"
      >
        {Object.keys(skillCategories).map((categoryId) => {
          const point = points.find((p) => p.skill_category_id === categoryId);
          return (
            <div
              key={categoryId}
              style={{
              background: `linear-gradient(to top, var(--level-color, #1e40af) ${
                ((getLevelInfo(point?.points || 0).next -
                getLevelInfo(point?.points || 0).remaining) /
                getLevelInfo(point?.points || 0).next) *
                100
              }%, var(--bg-color, #f3f4f6) 0%)`,
              }}
              className={cn(
              "dark:bg-black-200 flex h-14 w-14 flex-col items-center justify-center gap-1 rounded-md p-1 [--bg-color:#f3f4f6] [--level-color:#3b82f6] dark:[--bg-color:#1e293b] dark:[--level-color:#3F37C9]",
              !point?.points ? "opacity-40" : "opacity-100"
              )}
            >
              {/* skill points */}
              <p className="text-center text-xs font-semibold text-gray-700 dark:text-gray-300">
              {point ? point.points : 0}
              </p>

              {/* skill category */}
              <p className="text-center text-[0.7rem] text-gray-600 dark:text-gray-400 opacity-60">
              {skillCategories[categoryId]?.name.split(" ")[0] ?? "Unknown"}
              </p>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid gap-4 overflow-x-clip sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
      {Object.keys(skillCategories).map((categoryId) => {
        const point = points.find((p) => p.skill_category_id === categoryId);
        const level = getLevelInfo(point?.points || 0).level;
        const badgeName =
          level === "Max"
            ? `${skillCategories[categoryId]?.badge_prefix}-tier-champion.svg`
            : `${skillCategories[categoryId]?.badge_prefix}-tier-${level}.svg`;

        return (
          <div
            key={categoryId}
            style={{
              background: `linear-gradient(to top, var(--level-color, #1e40af) ${
                ((getLevelInfo(point?.points || 0).next -
                  getLevelInfo(point?.points || 0).remaining) /
                  getLevelInfo(point?.points || 0).next) *
                100
              }%, var(--bg-color, #f3f4f6) 0%)`,
            }}
            className={cn(
              "flex h-[20rem] flex-col items-center justify-center rounded-lg p-2 text-black shadow-md [--bg-color:#f3f4f6] [--level-color:#3b82f6] dark:text-white dark:[--bg-color:#1e293b] dark:[--level-color:#3F37C9]",
              !point?.points ? "opacity-40" : "opacity-100",
            )}
          >
            <div className="flex flex-col items-center justify-center gap-4">
              {/* points */}
              <div className="text-lg">{point?.points || 0}</div>

              {/* skill name */}
              <div className="text-wrap text-center text-lg">
                <p>{skillCategories[categoryId]?.name} </p>
                <p>points</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-2">
              {/* level */}
              <div className="pt-10 text-center">
                <p>level {level}</p>
              </div>

              {/* Add CodevBadge here */}
              <div className="">
                {point?.points ? (
                  <Image
                    src={`/assets/svgs/badges/${badgeName}`}
                    width={50}
                    height={50}
                    alt={skillCategories[categoryId]?.name ?? "Unknown"}
                  />
                ) : (
                  <div className="h-[50px] w-[50px]" />
                )}
              </div>

              {/* remaining points */}
              <div className="text-center text-xs font-medium opacity-60">
                {getLevelInfo(point?.points || 0).level === "Max" ? (
                  <p>get a life lol</p>
                ) : (
                  <p>
                    {getLevelInfo(point?.points || 0).remaining} points till
                    next level
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

memo(SkillPoints);
