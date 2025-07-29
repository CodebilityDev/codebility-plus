"use client";

import React, { useEffect, useState } from "react";

type SearchProps = {
  onSubmit: (search: string) => void;
  placeholder?: string;
  initialValue?: string; // New prop to initialize the search input
};

const EnhancedSearch = ({
  onSubmit,
  placeholder = "Search",
  initialValue = "",
}: SearchProps) => {
  const [isSearching, setIsSearching] = useState<string>(initialValue);

  // Update the input when initialValue changes
  useEffect(() => {
    setIsSearching(initialValue);
  }, [initialValue]);

  // Debounce search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onSubmit(isSearching);
    }, 500);

    return () => clearTimeout(delayDebounce); // Cleanup previous timeout
  }, [isSearching, onSubmit]);

  // Handle immediate search as user types (optional)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIsSearching(value);

    // Uncomment the following line if you want to search as the user types
    // onSubmit(value);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-full">
      <input
        type="text"
        value={isSearching}
        placeholder={placeholder}
        onChange={handleChange}
        className="border-gray h-10 w-full rounded-full border border-opacity-50 bg-inherit px-5 text-black focus:outline-none dark:text-white md:w-80"
      />
    </form>
  );
};

export default EnhancedSearch;
