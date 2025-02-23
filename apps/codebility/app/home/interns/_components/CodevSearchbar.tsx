import React, { useCallback } from "react";
import { Codev } from "@/types/home/codev";
import { SearchIcon } from "lucide-react";
import { useDebounce, useDebouncedCallback } from "use-debounce";

export default function CodevSearchbar({
  allCodevs,
  codevs,
  setCodevs,
}: {
  allCodevs: Codev[];
  codevs: Codev[];
  setCodevs: React.Dispatch<React.SetStateAction<Codev[]>>;
}) {
  const [searchValue, setSearchValue] = React.useState("");

  const handleSearch = useDebouncedCallback((value: string) => {
    if (value === "") {
      setCodevs(allCodevs);
      return;
    }

    const filteredCodevs = allCodevs.filter((codev) => {
      const fullName = `${codev.first_name} ${codev.last_name}`;
      return fullName.toLowerCase().includes(value.toLowerCase());
    });

    setCodevs(filteredCodevs);
  }, 300);

  return (
    <div className="relative flex items-center">
      <input
        className="w-full rounded-full border border-gray-300 py-2 pl-10 pr-3"
        type="text"
        placeholder="Search for a codev"
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
          handleSearch(e.target.value);
        }}
      />
      <SearchIcon
        className="pointer-events-none absolute left-3 stroke-slate-400 text-gray-500"
        size={20}
      />
    </div>
  );
}
