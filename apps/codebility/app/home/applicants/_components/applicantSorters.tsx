import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Filter, SortDescIcon, X } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";

const ApplicantSorters = ({
  sortField,
  sortDirection,
  onToggleSort,
  resetSort,
}: {
  sortField: string | null;
  sortDirection: "asc" | "desc";
  onToggleSort: (field: string) => void;
  resetSort: () => void;
}) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="text-black-500 dark:border-dark-300 dark:bg-dark-200 dark:text-light-800 flex items-center gap-1 border-gray-300 bg-white"
          >
            <SortDescIcon className="h-4 w-4" />
            <span>Sort</span>
            {sortField && <ChevronDown className="ml-1 h-3 w-3" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="dark:border-dark-400 dark:bg-dark-200 min-w-[140px] border border-gray-300 bg-white">
          <DropdownMenuLabel className="text-black-500 dark:text-light-800">
            Sort by
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="dark:bg-dark-400 bg-gray-300" />
          <DropdownMenuItem
            className={`flex justify-between ${
              sortField === "name"
                ? "text-customBlue-500 dark:text-customBlue-300"
                : "text-black-500 dark:text-light-800"
            }`}
            onClick={() => onToggleSort("name")}
          >
            Name
            {sortField === "name" && (
              <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            className={`flex justify-between ${
              sortField === "position"
                ? "text-customBlue-500 dark:text-customBlue-300"
                : "text-black-500 dark:text-light-800"
            }`}
            onClick={() => onToggleSort("position")}
          >
            Position
            {sortField === "position" && (
              <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            className={`flex justify-between ${
              sortField === "experience"
                ? "text-customBlue-500 dark:text-customBlue-300"
                : "text-black-500 dark:text-light-800"
            }`}
            onClick={() => onToggleSort("experience")}
          >
            Experience
            {sortField === "experience" && (
              <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator className="dark:bg-dark-400 bg-gray-300" />
          {/* reset */}
          {sortField && (
            <DropdownMenuItem
              className="flex items-center text-red-500"
              onClick={resetSort}
            >
              <X className="mr-2 h-4 w-4" />
              Reset Sort
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default memo(ApplicantSorters);
