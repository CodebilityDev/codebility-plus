import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@codevs/ui/button";
import { Input } from "@codevs/ui/input";
import { Label } from "@codevs/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search, X, Filter, ChevronDown, Flame, CheckCircle2 } from "lucide-react";
import { fetchTopSolvers, type TopSolver } from "../actions";
import DefaultAvatar from "@/components/DefaultAvatar";

interface SearchFilterProps {
  onSearchChange: (search: string) => void;
  onSortChange: (sort: "newest" | "oldest" | "popular" | "myPosts") => void;
  onFilterChange: (filters: FilterOptions) => void;
  currentSort: "newest" | "oldest" | "popular" | "myPosts";
  currentUserId?: string;
  refreshKey?: number;
}

export interface FilterOptions {
  searchBy: "title" | "content" | "tags" | "author" | "all";
  hasPosted: boolean;
  dateFrom?: string;
  dateTo?: string;
}

const BADGE_LABELS: Record<number, { label: string; className: string }> = {
  0: { label: "Gold",   className: "bg-amber-100 text-amber-800" },
  1: { label: "Silver", className: "bg-gray-200 text-gray-700" },
  2: { label: "Bronze", className: "bg-orange-100 text-orange-800" },
};

// Avatar colors for users without a profile picture
const AVATAR_COLORS = [
  "bg-purple-100 text-purple-800",
  "bg-teal-100 text-teal-800",
  "bg-orange-100 text-orange-800",
  "bg-blue-100 text-blue-800",
  "bg-amber-100 text-amber-800",
  "bg-pink-100 text-pink-800",
];

const SORT_OPTIONS = [
  { value: "newest",  label: "Newest" },
  { value: "oldest",  label: "Oldest" },
  { value: "popular", label: "Popular" },
  { value: "myPosts", label: "My Posts" },
] as const;

export default function SearchFilter({
  onSearchChange,
  onSortChange,
  onFilterChange,
  currentSort,
  currentUserId,
  refreshKey
}: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    searchBy: "all",
    hasPosted: false,
    dateFrom: undefined,
    dateTo: undefined,
  });

  // Real data state
  const [topSolvers, setTopSolvers] = useState<TopSolver[]>([]);
  const [isLoadingSolvers, setIsLoadingSolvers] = useState(true);

  useEffect(() => {
    fetchTopSolvers(6)
      .then(setTopSolvers)
      .catch(console.error)
      .finally(() => setIsLoadingSolvers(false));
  }, [refreshKey]); 

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearchChange(value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearchChange("");
  };

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters: FilterOptions = {
      searchBy: "all",
      hasPosted: false,
      dateFrom: undefined,
      dateTo: undefined,
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const hasActiveFilters =
    filters.searchBy !== "all" ||
    filters.hasPosted ||
    filters.dateFrom ||
    filters.dateTo;

  const StreakRows = () => {
    if (isLoadingSolvers) {
      return (
        <div className="flex items-center justify-center py-4">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-customBlue-500 dark:border-gray-700 dark:border-t-customBlue-400" />
        </div>
      );
    }

    if (topSolvers.length === 0) {
      return (
        <div className="py-3 text-center text-xs text-gray-400 dark:text-gray-500">
          No solutions marked yet
        </div>
      );
    }

    return (
      <>
        {topSolvers.map((user, i) => {
          const badge = BADGE_LABELS[i] ?? null;
          const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];

          return (
            <div key={user.id} className="flex items-center gap-2 py-2">
              {/* Rank number */}
              <span
                className={`text-xs w-4 text-center flex-shrink-0 ${
                  i < 3 ? "text-purple-400 font-bold" : "text-gray-400"
                }`}
              >
                {i + 1}
              </span>

              {/* Avatar */}
              <div className={`h-7 w-7 rounded-full flex-shrink-0 overflow-hidden ${!user.image_url ? avatarColor + " flex items-center justify-center" : ""}`}>
                {user.image_url ? (
                  <Image
                    src={user.image_url}
                    alt={user.name}
                    width={28}
                    height={28}
                    className="h-full w-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-[11px] font-medium">{user.initials}</span>
                )}
              </div>

              {/* Name */}
              <span className="text-xs font-medium flex-1 truncate dark:text-light-900 text-black">
                {user.name}
              </span>

              {/* Badge (top 3 only) */}
              {badge && (
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0 ${badge.className}`}>
                  {badge.label}
                </span>
              )}

              {/* Correct answers count */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className="text-xs font-medium text-emerald-500">{user.correct_answers}</span>
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              </div>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <Card className="border-light-700 bg-light-300 dark:border-dark-200 dark:bg-dark-100 mb-4 p-3 sm:p-4">

      {/* ─── MOBILE LAYOUT (< sm) ─── */}
      <div className="block sm:hidden space-y-3">

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="🔍 Search questions..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="border-light-700 bg-white dark:border-dark-200 dark:bg-dark-200 dark:text-light-900 h-9 w-full rounded-full border pl-10 pr-10 text-sm text-black shadow-sm focus:border-customBlue-500 focus:outline-none focus:ring-1 focus:ring-customBlue-500"
          />
          {searchQuery && (
            <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {SORT_OPTIONS.map(({ value, label }) => (
            <Button
              key={value}
              variant="ghost"
              size="sm"
              onClick={() => onSortChange(value)}
              className={`h-8 rounded-md text-xs ${
                currentSort === value
                  ? "bg-customBlue-500 text-white hover:bg-customBlue-600"
                  : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-dark-200 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Mobile Top Streak Board */}
        <div className="rounded-md border border-light-700 dark:border-dark-200 bg-white dark:bg-dark-200 p-3">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-medium dark:text-light-900 text-black">Top Streak Board</span>
          </div>
          <div className="overflow-y-auto max-h-[138px] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 divide-y divide-light-700 dark:divide-dark-200">
            <StreakRows />
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full h-8 text-xs border-light-700 dark:border-dark-200"
        >
          <Filter className="mr-2 h-3 w-3" />
          Advanced Filters
          <ChevronDown className={`ml-auto h-3 w-3 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
        </Button>

        {showAdvanced && (
          <div className="space-y-2 pt-2 border-t border-light-700 dark:border-dark-200">
            <Select value={filters.searchBy} onValueChange={(val) => handleFilterChange("searchBy", val as any)}>
              <SelectTrigger className="border-light-700 bg-white dark:border-dark-200 dark:bg-dark-200 dark:text-light-900 h-8 w-full rounded-md border px-2 text-xs text-black">
                <SelectValue placeholder="Search In" />
              </SelectTrigger>
              <SelectContent className="bg-light-800 dark:bg-dark-200">
                <SelectItem value="all">All Fields</SelectItem>
                <SelectItem value="title">Title Only</SelectItem>
                <SelectItem value="content">Content Only</SelectItem>
                <SelectItem value="tags">Tags Only</SelectItem>
                <SelectItem value="author">Author Only</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.hasPosted ? "true" : "false"} onValueChange={(val) => handleFilterChange("hasPosted", val === "true")}>
              <SelectTrigger className="border-light-700 bg-white dark:border-dark-200 dark:bg-dark-200 dark:text-light-900 h-8 w-full rounded-md border px-2 text-xs text-black">
                <SelectValue placeholder="Author Filter" />
              </SelectTrigger>
              <SelectContent className="bg-light-800 dark:bg-dark-200">
                <SelectItem value="false">All Authors</SelectItem>
                <SelectItem value="true">Authors with Posts</SelectItem>
              </SelectContent>
            </Select>

            <Input type="date" value={filters.dateFrom || ""} onChange={(e) => handleFilterChange("dateFrom", e.target.value || undefined)} className="border-light-700 bg-white dark:border-dark-200 dark:bg-dark-200 dark:text-light-900 h-8 w-full rounded-md border px-2 text-xs text-black" />
            <Input type="date" value={filters.dateTo || ""} onChange={(e) => handleFilterChange("dateTo", e.target.value || undefined)} className="border-light-700 bg-white dark:border-dark-200 dark:bg-dark-200 dark:text-light-900 h-8 w-full rounded-md border px-2 text-xs text-black" />
          </div>
        )}
      </div>

      {/* ─── TABLET + DESKTOP LAYOUT (sm+) ─── */}
      <div className="hidden sm:flex gap-4 lg:gap-6 items-start">

        {/* Left Column */}
        <div className="flex-1 min-w-0 space-y-4">

          <div>
            <Label className="dark:text-light-900 mb-1.5 block text-sm font-medium text-black">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="border-light-700 bg-white dark:border-dark-200 dark:bg-dark-200 dark:text-light-900 h-10 w-full rounded-md border pl-10 pr-10 text-sm text-black focus:border-customBlue-500 focus:outline-none focus:ring-1 focus:ring-customBlue-500"
              />
              {searchQuery && (
                <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div>
            <Label className="dark:text-light-900 mb-1.5 block text-sm font-medium text-black">Sort By</Label>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 rounded-full bg-white/80 p-1 shadow-sm backdrop-blur-sm dark:bg-gray-800/80 w-fit">
                {SORT_OPTIONS.map(({ value, label }) => (
                  <Button
                    key={value}
                    variant="ghost"
                    size="sm"
                    onClick={() => onSortChange(value)}
                    className={`rounded-full px-3 md:px-4 py-2 transition-all duration-200 text-xs md:text-sm ${
                      currentSort === value
                        ? "bg-customBlue-500 text-white shadow-md hover:bg-customBlue-600"
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    {label}
                  </Button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowAdvanced(!showAdvanced)} className="border-light-700 dark:border-dark-200">
                  <Filter className="mr-2 h-4 w-4" />
                  Advanced Filters
                  <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
                </Button>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={resetFilters} className="text-customBlue-600 hover:text-customBlue-700 dark:text-customBlue-400">
                    <X className="mr-1 h-4 w-4" />
                    Reset Filters
                  </Button>
                )}
              </div>
            </div>
          </div>

          {showAdvanced && (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 pt-4 border-t border-light-700 dark:border-dark-200">
              <div>
                <Label className="dark:text-light-900 mb-1.5 block text-sm font-medium text-black">Search In</Label>
                <Select value={filters.searchBy} onValueChange={(val) => handleFilterChange("searchBy", val as any)}>
                  <SelectTrigger className="border-light-700 bg-white dark:border-dark-200 dark:bg-dark-200 dark:text-light-900 h-10 w-full rounded-md border px-3 text-sm text-black">
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent className="bg-light-800 dark:bg-dark-200">
                    <SelectItem value="all">All Fields</SelectItem>
                    <SelectItem value="title">Title Only</SelectItem>
                    <SelectItem value="content">Content Only</SelectItem>
                    <SelectItem value="tags">Tags Only</SelectItem>
                    <SelectItem value="author">Author Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="dark:text-light-900 mb-1.5 block text-sm font-medium text-black">Author Filter</Label>
                <Select value={filters.hasPosted ? "true" : "false"} onValueChange={(val) => handleFilterChange("hasPosted", val === "true")}>
                  <SelectTrigger className="border-light-700 bg-white dark:border-dark-200 dark:bg-dark-200 dark:text-light-900 h-10 w-full rounded-md border px-3 text-sm text-black">
                    <SelectValue placeholder="Filter authors" />
                  </SelectTrigger>
                  <SelectContent className="bg-light-800 dark:bg-dark-200">
                    <SelectItem value="false">All Authors</SelectItem>
                    <SelectItem value="true">Authors with Posts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="dark:text-light-900 mb-1.5 block text-sm font-medium text-black">From Date</Label>
                <Input type="date" value={filters.dateFrom || ""} onChange={(e) => handleFilterChange("dateFrom", e.target.value || undefined)} className="border-light-700 bg-white dark:border-dark-200 dark:bg-dark-200 dark:text-light-900 h-10 w-full rounded-md border px-3 text-sm text-black" />
              </div>

              <div>
                <Label className="dark:text-light-900 mb-1.5 block text-sm font-medium text-black">To Date</Label>
                <Input type="date" value={filters.dateTo || ""} onChange={(e) => handleFilterChange("dateTo", e.target.value || undefined)} className="border-light-700 bg-white dark:border-dark-200 dark:bg-dark-200 dark:text-light-900 h-10 w-full rounded-md border px-3 text-sm text-black" />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Top Streak Board */}
        <div className="w-40 md:w-52 lg:w-[220px] xl:w-[300px] flex-shrink-0">
          <Label className="dark:text-light-900 mb-1.5 flex items-center gap-2 text-sm font-medium text-black">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Top Streak Board
          </Label>
          <div
            className="overflow-y-auto divide-y divide-light-700 dark:divide-dark-200 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
            style={{ maxHeight: "180px" }}
          >
            <StreakRows />
          </div>
        </div>

      </div>
    </Card>
  );
}