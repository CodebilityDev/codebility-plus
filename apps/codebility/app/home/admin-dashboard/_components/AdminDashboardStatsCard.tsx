"use client";

import {
  FolderKanban,
  UserCheck,
  UserCog,
  UserPen,
  UserX,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Icon mapping
const ICON_MAP = {
  UserCheck,
  UserX,
  Users,
  UserCog,
  FolderKanban,
  UserPen,
} as const;

type IconName = keyof typeof ICON_MAP;

interface AdminDashboardStatsCardProps {
  title: string;
  count?: number;
  description: string;
  iconName: IconName;
  colorTheme: "blue" | "red" | "orange" | "purple" | "cyan" | "green";
  className?: string;
}

const THEME_CONFIGS = {
  blue: {
    card: "bg-white dark:bg-gradient-to-br dark:from-blue-950 dark:via-slate-900 dark:to-slate-950",
    border: "border-gray-200 dark:border-blue-900/30",
    overlay: "dark:from-blue-500/10",
    iconBg: "bg-blue-500/10 group-hover:bg-blue-500/20",
    iconColor: "text-blue-500",
    skeleton: "bg-blue-900/20",
  },
  red: {
    card: "bg-white dark:bg-gradient-to-br dark:from-red-950 dark:via-slate-900 dark:to-slate-950",
    border: "border-gray-200 dark:border-red-900/30",
    overlay: "dark:from-red-500/10",
    iconBg: "bg-red-500/10 group-hover:bg-red-500/20",
    iconColor: "text-red-500",
    skeleton: "bg-red-900/20",
  },
  orange: {
    card: "bg-white dark:bg-gradient-to-br dark:from-orange-950 dark:via-slate-900 dark:to-slate-950",
    border: "border-gray-200 dark:border-orange-900/30",
    overlay: "dark:from-orange-500/10",
    iconBg: "bg-orange-500/10 group-hover:bg-orange-500/20",
    iconColor: "text-orange-500",
    skeleton: "bg-orange-900/20",
  },
  purple: {
    card: "bg-white dark:bg-gradient-to-br dark:from-purple-950 dark:via-slate-900 dark:to-slate-950",
    border: "border-gray-200 dark:border-purple-900/30",
    overlay: "dark:from-purple-500/10",
    iconBg: "bg-purple-500/10 group-hover:bg-purple-500/20",
    iconColor: "text-purple-500",
    skeleton: "bg-purple-900/20",
  },
  cyan: {
    card: "bg-white dark:bg-gradient-to-br dark:from-cyan-950 dark:via-slate-900 dark:to-slate-950",
    border: "border-gray-200 dark:border-cyan-900/30",
    overlay: "dark:from-cyan-500/10",
    iconBg: "bg-cyan-500/10 group-hover:bg-cyan-500/20",
    iconColor: "text-cyan-500",
    skeleton: "bg-cyan-900/20",
  },
  green: {
    card: "bg-white dark:bg-gradient-to-br dark:from-green-950 dark:via-slate-900 dark:to-slate-950",
    border: "border-gray-200 dark:border-green-900/30",
    overlay: "dark:from-green-500/10",
    iconBg: "bg-green-500/10 group-hover:bg-green-500/20",
    iconColor: "text-green-500",
    skeleton: "bg-green-900/20",
  },
} as const;

// Animates from 0 up to the target count on mount
function useCountUp(target: number, duration = 800) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (target === 0) {
      setDisplay(0);
      return;
    }

    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return display;
}

function StatsCardSkeleton({
  theme,
  className,
}: {
  theme: (typeof THEME_CONFIGS)[keyof typeof THEME_CONFIGS];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border",
        theme.card,
        theme.border,
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br to-transparent pointer-events-none opacity-0 dark:opacity-100",
          theme.overlay,
        )}
      />
      <div className="relative flex flex-row items-center justify-between space-y-0 p-6 pb-2">
        <div className={cn("h-4 w-28 animate-pulse rounded", theme.skeleton)} />
        <div className={cn("h-8 w-8 animate-pulse rounded-lg", theme.skeleton)} />
      </div>
      <div className="relative p-6 pt-0 space-y-2">
        <div className={cn("h-7 w-16 animate-pulse rounded", theme.skeleton)} />
        <div className={cn("h-3 w-24 animate-pulse rounded", theme.skeleton)} />
      </div>
    </div>
  );
}

export default function AdminDashboardStatsCard({
  title,
  count,
  description,
  iconName,
  colorTheme,
  className,
}: AdminDashboardStatsCardProps) {
  const theme = THEME_CONFIGS[colorTheme];
  const Icon = ICON_MAP[iconName];
  const animatedCount = useCountUp(count ?? 0);

  if (count === undefined) {
    return <StatsCardSkeleton theme={theme} className={className} />;
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border transition-all hover:shadow-lg",
        theme.card,
        theme.border,
        className,
      )}
    >
      {/* Overlay — only visible in dark mode */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br to-transparent pointer-events-none opacity-0 dark:opacity-100",
          theme.overlay,
        )}
      />

      {/* Header */}
      <div className="relative flex flex-row items-center justify-between space-y-0 p-6 pb-2">
        <p className="text-sm font-medium text-muted-foreground dark:text-white">
          {title}
        </p>
        <div
          className={cn(
            "rounded-lg p-2 transition-colors",
            theme.iconBg,
            theme.iconColor,
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>

      {/* Content */}
      <div className="relative p-6 pt-0">
        <div className="text-2xl font-bold tabular-nums dark:text-white">
          {animatedCount.toLocaleString()}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}