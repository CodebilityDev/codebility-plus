import { useState } from "react";
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
import { Search, X, Filter, ChevronDown } from "lucide-react";

interface SearchFilterProps {
  onSearchChange: (search: string) => void;
  onSortChange: (sort: "newest" | "oldest" | "popular" | "myPosts") => void;
  onFilterChange: (filters: FilterOptions) => void;
  currentSort: "newest" | "oldest" | "popular" | "myPosts";
  currentUserId?: string;
}

export interface FilterOptions {
  searchBy: "title" | "content" | "tags" | "author" | "all";
  hasPosted: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export default function SearchFilter({
  onSearchChange,
  onSortChange,
  onFilterChange,
  currentSort,
  currentUserId,
}: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    searchBy: "all",
    hasPosted: false,
    dateFrom: undefined,
    dateTo: undefined,
  });

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

  return (
    <Card className="border-light-700 bg-light-300 dark:border-dark-200 dark:bg-dark-100 mb-4 p-3 sm:p-4">
      {/* Mobile Layout */}
      <div className="block sm:hidden space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="🔍 Search questions..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="border-light-700 bg-white dark:border-dark-200 dark:bg-dark-200 dark:text-light-900 h-9 w-full rounded-full border pl-10 pr-10 text-sm text-black shadow-sm focus:border-customBlue-500 focus:outline-none focus:ring-1 focus:ring-customBlue-500"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {/* Mobile Sort Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSortChange("newest")}
            className={`h-8 rounded-md text-xs ${
              currentSort === "newest"
                ? "bg-customBlue-500 text-white hover:bg-customBlue-600"
                : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-dark-200 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            Newest
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSortChange("oldest")}
            className={`h-8 rounded-md text-xs ${
              currentSort === "oldest"
                ? "bg-customBlue-500 text-white hover:bg-customBlue-600"
                : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-dark-200 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            Oldest
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSortChange("popular")}
            className={`h-8 rounded-md text-xs ${
              currentSort === "popular"
                ? "bg-customBlue-500 text-white hover:bg-customBlue-600"
                : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-dark-200 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            Popular
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSortChange("myPosts")}
            className={`h-8 rounded-md text-xs ${
              currentSort === "myPosts"
                ? "bg-customBlue-500 text-white hover:bg-customBlue-600"
                : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-dark-200 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            My Posts
          </Button>
        </div>

        {/* Mobile Advanced Filters Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full h-8 text-xs border-light-700 dark:border-dark-200"
        >
          <Filter className="mr-2 h-3 w-3" />
          Advanced Filters
          <ChevronDown className={`ml-auto h-3 w-3 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </Button>

        {/* Mobile Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-2 pt-2 border-t border-light-700 dark:border-dark-200">
            {renderMobileAdvancedFilters()}
          </div>
        )}
      </div>
      
      {/* Desktop Layout */}
      <div className="hidden sm:block space-y-4">
        {/* Search and Sort Row */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-2xl">
            <Label className="dark:text-light-900 mb-1.5 block text-sm font-medium text-black">
              Search
            </Label>
            <Search className="absolute left-3 top-[2.4rem] h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="border-light-700 bg-white dark:border-dark-200 dark:bg-dark-200 dark:text-light-900 h-10 w-full rounded-md border pl-10 pr-10 text-sm text-black focus:border-customBlue-500 focus:outline-none focus:ring-1 focus:ring-customBlue-500"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-[2.4rem] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Sort Buttons */}
          <div className="flex flex-col">
            <Label className="dark:text-light-900 mb-1.5 block text-sm font-medium text-black">
              Sort By
            </Label>
            <div className="flex items-center gap-1 rounded-full bg-white/80 p-1 shadow-sm backdrop-blur-sm dark:bg-gray-800/80">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSortChange("newest")}
                className={`rounded-full px-4 py-2 transition-all duration-200 ${
                  currentSort === "newest"
                    ? "bg-customBlue-500 text-white shadow-md hover:bg-customBlue-600"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                Newest
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSortChange("oldest")}
                className={`rounded-full px-4 py-2 transition-all duration-200 ${
                  currentSort === "oldest"
                    ? "bg-customBlue-500 text-white shadow-md hover:bg-customBlue-600"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                Oldest
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSortChange("popular")}
                className={`rounded-full px-4 py-2 transition-all duration-200 ${
                  currentSort === "popular"
                    ? "bg-customBlue-500 text-white shadow-md hover:bg-customBlue-600"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                Popular
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSortChange("myPosts")}
                className={`rounded-full px-4 py-2 transition-all duration-200 ${
                  currentSort === "myPosts"
                    ? "bg-customBlue-500 text-white shadow-md hover:bg-customBlue-600"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                My Posts
              </Button>
            </div>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="border-light-700 dark:border-dark-200"
          >
            <Filter className="mr-2 h-4 w-4" />
            Advanced Filters
            <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-customBlue-600 hover:text-customBlue-700 dark:text-customBlue-400"
            >
              <X className="mr-1 h-4 w-4" />
              Reset Filters
            </Button>
          )}
        </div>
        
        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 pt-4 border-t border-light-700 dark:border-dark-200">
            {renderDesktopAdvancedFilters()}
          </div>
        )}
      </div>
    </Card>
  );
  
  function renderMobileAdvancedFilters() {
    return (
      <>
        {/* Search By Filter */}
        <Select
          value={filters.searchBy}
          onValueChange={(val) => handleFilterChange("searchBy", val as any)}
        >
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

        {/* Has Posted Filter */}
        <Select
          value={filters.hasPosted ? "true" : "false"}
          onValueChange={(val) => handleFilterChange("hasPosted", val === "true")}
        >
          <SelectTrigger className="border-light-700 bg-white dark:border-dark-200 dark:bg-dark-200 dark:text-light-900 h-8 w-full rounded-md border px-2 text-xs text-black">
            <SelectValue placeholder="Author Filter" />
          </SelectTrigger>
          <SelectContent className="bg-light-800 dark:bg-dark-200">
            <SelectItem value="false">All Authors</SelectItem>
            <SelectItem value="true">Authors with Posts</SelectItem>
          </SelectContent>
        </Select>

        {/* Date From */}
        <div>
          <Input
            type="date"
            value={filters.dateFrom || ""}
            onChange={(e) => handleFilterChange("dateFrom", e.target.value || undefined)}
            className="border-light-700 bg-white dark:border-dark-200 dark:bg-dark-200 dark:text-light-900 h-8 w-full rounded-md border px-2 text-xs text-black"
            placeholder="From Date"
          />
        </div>

        {/* Date To */}
        <div>
          <Input
            type="date"
            value={filters.dateTo || ""}
            onChange={(e) => handleFilterChange("dateTo", e.target.value || undefined)}
            className="border-light-700 bg-white dark:border-dark-200 dark:bg-dark-200 dark:text-light-900 h-8 w-full rounded-md border px-2 text-xs text-black"
            placeholder="To Date"
          />
        </div>
      </>
    );
  }
  
  function renderDesktopAdvancedFilters() {
    return (
      <>
        {/* Search By Filter */}
        <div>
          <Label className="dark:text-light-900 mb-1.5 block text-sm font-medium text-black">
            Search In
          </Label>
          <Select
            value={filters.searchBy}
            onValueChange={(val) => handleFilterChange("searchBy", val as any)}
          >
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

        {/* Has Posted Filter */}
        <div>
          <Label className="dark:text-light-900 mb-1.5 block text-sm font-medium text-black">
            Author Filter
          </Label>
          <Select
            value={filters.hasPosted ? "true" : "false"}
            onValueChange={(val) => handleFilterChange("hasPosted", val === "true")}
          >
            <SelectTrigger className="border-light-700 bg-white dark:border-dark-200 dark:bg-dark-200 dark:text-light-900 h-10 w-full rounded-md border px-3 text-sm text-black">
              <SelectValue placeholder="Filter authors" />
            </SelectTrigger>
            <SelectContent className="bg-light-800 dark:bg-dark-200">
              <SelectItem value="false">All Authors</SelectItem>
              <SelectItem value="true">Authors with Posts</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date From */}
        <div>
          <Label className="dark:text-light-900 mb-1.5 block text-sm font-medium text-black">
            From Date
          </Label>
          <Input
            type="date"
            value={filters.dateFrom || ""}
            onChange={(e) => handleFilterChange("dateFrom", e.target.value || undefined)}
            className="border-light-700 bg-white dark:border-dark-200 dark:bg-dark-200 dark:text-light-900 h-10 w-full rounded-md border px-3 text-sm text-black"
          />
        </div>

        {/* Date To */}
        <div>
          <Label className="dark:text-light-900 mb-1.5 block text-sm font-medium text-black">
            To Date
          </Label>
          <Input
            type="date"
            value={filters.dateTo || ""}
            onChange={(e) => handleFilterChange("dateTo", e.target.value || undefined)}
            className="border-light-700 bg-white dark:border-dark-200 dark:bg-dark-200 dark:text-light-900 h-10 w-full rounded-md border px-3 text-sm text-black"
          />
        </div>
      </>
    );
  }
}