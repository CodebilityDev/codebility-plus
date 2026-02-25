"use client";

import { useState, useMemo } from "react";
import * as Icons from "lucide-react";
import { Search, X } from "lucide-react";

// Curated set of icons relevant for feature promotion content
const ICON_NAMES = [
  "Zap", "Target", "TrendingUp", "Star", "Sparkles", "Rocket",
  "Shield", "Lock", "Unlock", "Eye", "EyeOff", "Bell", "BellRing",
  "Check", "CheckCircle", "CheckSquare", "CircleCheck", "BadgeCheck",
  "Code", "Code2", "CodeXml", "Terminal", "Braces", "FileCode",
  "GitBranch", "GitMerge", "GitPullRequest", "Github",
  "Users", "User", "UserCheck", "UserPlus", "UsersRound",
  "MessageSquare", "MessageCircle", "Mail", "Send", "Inbox",
  "BarChart", "BarChart2", "BarChart3", "LineChart", "PieChart", "Activity",
  "Clock", "Timer", "AlarmClock", "CalendarDays", "Calendar",
  "Layers", "Layout", "LayoutDashboard", "LayoutGrid", "Grid",
  "Settings", "Settings2", "SlidersHorizontal", "Sliders", "Wrench",
  "Lightbulb", "Brain", "Cpu", "Bot", "Wand2", "Wand",
  "Trophy", "Medal", "Award", "Crown", "Gem",
  "Heart", "ThumbsUp", "Smile", "PartyPopper", "Gift",
  "Globe", "Link", "ExternalLink", "Share2", "Rss",
  "Download", "Upload", "Cloud", "CloudUpload", "Database",
  "Search", "Filter", "SortAsc", "List", "ListChecks",
  "Play", "Pause", "Video", "Mic", "Music",
  "Image", "FileImage", "Palette", "Brush", "PenTool",
  "Book", "BookOpen", "FileText", "Clipboard", "ClipboardCheck",
  "Briefcase", "Building", "Home", "Map", "Navigation",
  "Wifi", "Bluetooth", "Smartphone", "Monitor", "Laptop",
  "Sun", "Moon", "Flame", "Leaf", "Flower2",
] as const;

type IconName = (typeof ICON_NAMES)[number];

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
}

export default function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      ICON_NAMES.filter((name) =>
        name.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  const SelectedIcon = value
    ? (Icons[value as keyof typeof Icons] as Icons.LucideIcon)
    : null;

  function handleSelect(name: string) {
    onChange(name);
    setOpen(false);
    setSearch("");
  }

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-full items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm transition-colors hover:border-violet-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
      >
        {SelectedIcon ? (
          <>
            <SelectedIcon className="h-4 w-4 shrink-0 text-violet-600" />
            <span className="flex-1 text-left text-sm text-gray-700 dark:text-gray-200">
              {value}
            </span>
          </>
        ) : (
          <span className="flex-1 text-left text-gray-400">Select an icon...</span>
        )}
        <Icons.ChevronDown className="h-3.5 w-3.5 shrink-0 text-gray-400" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-72 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
          {/* Search */}
          <div className="flex items-center gap-2 border-b border-gray-200 px-3 py-2.5 dark:border-gray-700">
            <Search className="h-3.5 w-3.5 shrink-0 text-gray-400" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search icons..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400 dark:text-white"
            />
            {search && (
              <button onClick={() => setSearch("")}>
                <X className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Grid */}
          <div className="grid max-h-56 grid-cols-6 gap-1 overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <p className="col-span-6 py-4 text-center text-xs text-gray-400">
                No icons found
              </p>
            ) : (
              filtered.map((name) => {
                const Icon = Icons[name as keyof typeof Icons] as Icons.LucideIcon;
                const isSelected = value === name;
                return (
                  <button
                    key={name}
                    type="button"
                    title={name}
                    onClick={() => handleSelect(name)}
                    className={`group flex flex-col items-center justify-center rounded-lg p-2 transition-colors ${
                      isSelected
                        ? "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400"
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                );
              })
            )}
          </div>

          {/* Footer hint */}
          <div className="border-t border-gray-200 px-3 py-2 dark:border-gray-700">
            <p className="text-xs text-gray-400">{filtered.length} icons</p>
          </div>
        </div>
      )}
    </div>
  );
}