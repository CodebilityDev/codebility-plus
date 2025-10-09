import React, { useCallback } from "react";
import { Codev } from "@/types/home/codev";
import { SearchIcon } from "lucide-react";
import { useDebounce, useDebouncedCallback } from "use-debounce";

export default function CodevSearchbar({
  allCodevs,
  codevs,
  setCodevs,
  setIsSearching,
}: {
  allCodevs: Codev[];
  codevs: Codev[];
  setCodevs: React.Dispatch<React.SetStateAction<Codev[]>>;
  setIsSearching?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [searchValue, setSearchValue] = React.useState("");

  const handleSearch = useDebouncedCallback((value: string) => {
    setIsSearching?.(true);
    
    if (value === "") {
      setCodevs(allCodevs);
      setIsSearching?.(false);
      return;
    }

    const filteredCodevs = allCodevs.filter((codev) => {
      const fullName = `${codev.first_name} ${codev.last_name}`;
      return fullName.toLowerCase().includes(value.toLowerCase());
    });

    setCodevs(filteredCodevs);
    setIsSearching?.(false);
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
