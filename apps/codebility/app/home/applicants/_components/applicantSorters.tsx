import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Plus, SortAsc, SortDesc, X, GripVertical } from "lucide-react";

import { Badge } from "@codevs/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";

export type SortOption = {
  field: string;
  direction: "asc" | "desc";
  label: string;
};

const ApplicantSorters = ({
  sortOptions,
  onAddSort,
  onRemoveSort,
  onToggleSortDirection,
  onReorderSorts,
  resetSort,
}: {
  sortOptions: SortOption[];
  onAddSort: (field: string, label: string) => void;
  onRemoveSort: (field: string) => void;
  onToggleSortDirection: (field: string) => void;
  onReorderSorts: (sortOptions: SortOption[]) => void;
  resetSort: () => void;
}) => {
  const availableFields = [
    { field: "name", label: "Name" },
    { field: "position", label: "Position" },
    { field: "experience", label: "Experience" },
    { field: "dateApplied", label: "Date Applied" },
    { field: "testTaken", label: "Test Taken" },
    { field: "reminderCount", label: "Reminders" },
    { field: "techStackCount", label: "Tech Stacks" },
  ];

  const getAvailableFields = () => {
    const usedFields = sortOptions.map(option => option.field);
    return availableFields.filter(field => !usedFields.includes(field.field));
  };

  const moveSortUp = (index: number) => {
    if (index > 0 && index < sortOptions.length) {
      const newSorts = [...sortOptions];
      const current = newSorts[index];
      const previous = newSorts[index - 1];
      if (current && previous) {
        newSorts[index - 1] = current;
        newSorts[index] = previous;
        onReorderSorts(newSorts);
      }
    }
  };

  const moveSortDown = (index: number) => {
    if (index >= 0 && index < sortOptions.length - 1) {
      const newSorts = [...sortOptions];
      const current = newSorts[index];
      const next = newSorts[index + 1];
      if (current && next) {
        newSorts[index] = next;
        newSorts[index + 1] = current;
        onReorderSorts(newSorts);
      }
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="text-black-500 dark:border-dark-300 dark:bg-dark-200 dark:text-light-800 flex items-center gap-2 border-gray-300 bg-white"
          >
            <SortAsc className="h-4 w-4" />
            <span>Sort</span>
            {sortOptions.length > 0 && (
              <Badge className="h-5 w-5 bg-blue-500 p-0 text-xs text-white">
                {sortOptions.length}
              </Badge>
            )}
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="dark:border-dark-400 dark:bg-dark-200 w-[26rem] border border-gray-300 bg-white">
          <div className="sticky top-0 bg-white dark:bg-dark-200 z-10 border-b border-gray-200 dark:border-gray-700 pb-4">
            <DropdownMenuLabel className="text-black-500 dark:text-light-800 text-lg font-semibold px-1">
              Sort Options
            </DropdownMenuLabel>
          </div>

          <div className="p-4 space-y-4 max-h-[30rem] overflow-y-auto">
            {/* Active Sort Options */}
            {sortOptions.length > 0 && (
              <div className="space-y-3">
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Active Sorts (Priority Order)
                </div>
                {sortOptions.map((option, index) => (
                  <div
                    key={option.field}
                    className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-blue-100 dark:hover:bg-blue-800 text-xs"
                          onClick={() => moveSortUp(index)}
                          disabled={index === 0}
                        >
                          ↑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-blue-100 dark:hover:bg-blue-800 text-xs"
                          onClick={() => moveSortDown(index)}
                          disabled={index === sortOptions.length - 1}
                        >
                          ↓
                        </Button>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-blue-600 text-white text-xs px-2 py-1 min-w-[1.5rem] flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                          {option.label}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 px-3 flex items-center gap-2"
                        onClick={() => onToggleSortDirection(option.field)}
                      >
                        {option.direction === "asc" ? (
                          <SortAsc className="h-4 w-4 text-green-600" />
                        ) : (
                          <SortDesc className="h-4 w-4 text-orange-600" />
                        )}
                        <span className="text-xs font-medium">
                          {option.direction === "asc" ? "A→Z" : "Z→A"}
                        </span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => onRemoveSort(option.field)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Sort */}
            {getAvailableFields().length > 0 && (
              <div className="space-y-3">
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Add Sort Criteria
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {getAvailableFields().map((field) => (
                    <Button
                      key={field.field}
                      variant="outline"
                      size="sm"
                      className="justify-start text-left h-11 border-dashed hover:border-solid hover:bg-gray-50 dark:hover:bg-gray-800 px-3"
                      onClick={() => onAddSort(field.field, field.label)}
                    >
                      <Plus className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">{field.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Sort Instructions */}
            {sortOptions.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <SortAsc className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm font-medium mb-1">No sorting criteria selected</p>
                <p className="text-xs">Click on a field above to add your first sort criteria</p>
                <p className="text-xs mt-1 opacity-75">You can add multiple sorts with priority order</p>
              </div>
            )}

            {sortOptions.length > 0 && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  <div className="font-medium mb-2 text-sm">How sorting works:</div>
                  <ul className="space-y-1.5 text-xs leading-relaxed">
                    <li>• Higher priority sorts (lower numbers) are applied first</li>
                    <li>• Use ↑↓ buttons to change priority order</li>
                    <li>• Click direction button to toggle A→Z / Z→A sorting</li>
                    <li>• Multiple criteria create sophisticated sorting behavior</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Reset Button */}
          {sortOptions.length > 0 && (
            <div className="sticky bottom-0 bg-white dark:bg-dark-200 border-t border-gray-200 dark:border-gray-700 p-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center text-sm text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20 h-10"
                onClick={resetSort}
              >
                <X className="mr-2 h-4 w-4" />
                Clear all sorts
              </Button>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ApplicantSorters;
