"use client";

import React from "react";
import { SearchIcon } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

export default function CodevSearchbar({
  value,
  onSearch,
}: {
  value: string;
  onSearch: (value: string) => void;
}) {
  const [searchValue, setSearchValue] = React.useState(value);

  const handleSearch = useDebouncedCallback((next: string) => {
    onSearch(next);
  }, 300);

  return (
    <div className="relative flex items-center">
      <input
        className="w-full rounded-full bg-white/10 backdrop-blur-sm border border-white/20 dark:border-white/10 py-3 pl-12 pr-4 text-white dark:text-white placeholder-gray-300 dark:placeholder-gray-400 shadow-lg hover:bg-white/20 dark:hover:bg-white/10 focus:bg-white/20 dark:focus:bg-white/10 focus:border-customBlue-400 focus:outline-none focus:ring-2 focus:ring-customBlue-500/20 transition-all duration-300"
        type="text"
        placeholder="Search for a developer..."
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
          handleSearch(e.target.value);
        }}
      />
      <SearchIcon
        className="pointer-events-none absolute left-4 text-gray-300 dark:text-gray-400 transition-colors duration-200"
        size={20}
      />
    </div>
  );
}
