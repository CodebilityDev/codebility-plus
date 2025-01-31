"use client";

import React, { useEffect, useState } from "react";
import { Box } from "@/Components/shared/dashboard";
import { Button } from "@/Components/ui/button";
import { Position } from "@/types/home/codev";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { Checkbox } from "@codevs/ui/checkbox";

interface FilterInternsProps {
  filters: string[];
  setFilters: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function FilterInterns({
  filters,
  setFilters,
}: FilterInternsProps) {
  const [showFilter, setShowFilter] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const supabase = createClientComponentClient();

  // Fetch positions inline, on first render
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const { data, error } = await supabase.from("positions").select("*");

        if (error) {
          console.error("Failed to fetch positions:", error);
          return;
        }
        const validPositions = (data || []).filter((p) => p.name);
        setPositions(validPositions as Position[]);
      } catch (err) {
        console.error("Something went wrong fetching positions:", err);
      }
    };

    fetchPositions();
  }, [supabase]);

  const toggleFilter = () => setShowFilter((prev) => !prev);
  const clearFilter = () => setFilters([]);

  // Add/remove position name in 'filters'
  const handleCheckedChange = (positionName: string) => {
    if (filters.includes(positionName)) {
      setFilters((prev) => prev.filter((f) => f !== positionName));
    } else {
      setFilters((prev) => [...prev, positionName]);
    }
  };

  return (
    <div className="text-gray relative">
      <Button
        variant={showFilter ? "destructive" : "default"}
        size="sm"
        onClick={toggleFilter}
      >
        {showFilter ? "Close filter" : "Filter"}
      </Button>

      <Box
        className={`absolute -right-3/4 top-12 z-[1] h-72 w-[250%] overflow-auto
          sm:-right-3/4 sm:w-72 md:right-0 md:w-64 lg:right-0 lg:w-64
          ${!showFilter && "hidden"}
        `}
      >
        <div className="mb-2 flex flex-row items-center justify-between">
          <p className="text-gray pb-2">Filter by</p>
          <p className="cursor-pointer text-sm" onClick={clearFilter}>
            Clear
          </p>
        </div>

        {positions.length === 0 ? (
          <p>No positions found</p>
        ) : (
          positions.map((pos) => {
            const positionName = pos.name || "";
            return (
              <div
                className="hover:bg-black-200 flex cursor-pointer items-center justify-between gap-2 p-2"
                key={pos.id}
              >
                <label htmlFor={positionName} className="cursor-pointer">
                  {positionName || "Unnamed"}
                </label>
                <Checkbox
                  id={positionName}
                  checked={filters.includes(positionName)}
                  onCheckedChange={() => handleCheckedChange(positionName)}
                  className="border-violet data-[state=checked]:bg-violet"
                />
              </div>
            );
          })
        )}
      </Box>
    </div>
  );
}
