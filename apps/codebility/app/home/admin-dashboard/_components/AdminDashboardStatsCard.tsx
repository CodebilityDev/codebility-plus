"use client";

import { UserCheck, UserX, Users, UserCog, FolderKanban, UserPen } from "lucide-react";
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

// ORIGINAL theme config - DARK RICH COLORS (not pale)
const THEME_CONFIGS = {
  blue: {
    card: "bg-white dark:bg-gradient-to-br dark:from-blue-950 dark:via-slate-900 dark:to-slate-950",
    border: "border-gray-200 dark:border-blue-900/30",
    overlay: "dark:from-blue-500/10",
    iconBg: "bg-blue-500/10 group-hover:bg-blue-500/20",
    iconColor: "text-blue-500",
  },
  red: {
    card: "bg-white dark:bg-gradient-to-br dark:from-red-950 dark:via-slate-900 dark:to-slate-950",
    border: "border-gray-200 dark:border-red-900/30",
    overlay: "dark:from-red-500/10",
    iconBg: "bg-red-500/10 group-hover:bg-red-500/20",
    iconColor: "text-red-500",
  },
  orange: {
    card: "bg-white dark:bg-gradient-to-br dark:from-orange-950 dark:via-slate-900 dark:to-slate-950",
    border: "border-gray-200 dark:border-orange-900/30",
    overlay: "dark:from-orange-500/10",
    iconBg: "bg-orange-500/10 group-hover:bg-orange-500/20",
    iconColor: "text-orange-500",
  },
  purple: {
    card: "bg-white dark:bg-gradient-to-br dark:from-purple-950 dark:via-slate-900 dark:to-slate-950",
    border: "border-gray-200 dark:border-purple-900/30",
    overlay: "dark:from-purple-500/10",
    iconBg: "bg-purple-500/10 group-hover:bg-purple-500/20",
    iconColor: "text-purple-500",
  },
  cyan: {
    card: "bg-white dark:bg-gradient-to-br dark:from-cyan-950 dark:via-slate-900 dark:to-slate-950",
    border: "border-gray-200 dark:border-cyan-900/30",
    overlay: "dark:from-cyan-500/10",
    iconBg: "bg-cyan-500/10 group-hover:bg-cyan-500/20",
    iconColor: "text-cyan-500",
  },
  green: {
    card: "bg-white dark:bg-gradient-to-br dark:from-green-950 dark:via-slate-900 dark:to-slate-950",
    border: "border-gray-200 dark:border-green-900/30",
    overlay: "dark:from-green-500/10",
    iconBg: "bg-green-500/10 group-hover:bg-green-500/20",
    iconColor: "text-green-500",
  },
} as const;

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

  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-lg border transition-all hover:shadow-lg",
        theme.card,
        theme.border,
        className
      )}
    >
      {/* Overlay - only visible in dark mode */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br to-transparent pointer-events-none opacity-0 dark:opacity-100",
        theme.overlay
      )} />
      
      {/* Header */}
      <div className="relative flex flex-row items-center justify-between space-y-0 p-6 pb-2">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>
        </div>
        <div className={cn(
          "rounded-lg p-2 transition-colors",
          theme.iconBg,
          theme.iconColor
        )}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      
      {/* Content */}
      <div className="relative p-6 pt-0">
        <div className="text-2xl font-bold">
          {count !== undefined ? count.toLocaleString() : "N/A"}
        </div>
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}