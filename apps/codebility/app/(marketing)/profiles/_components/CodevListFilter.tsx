import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Codev } from "@/types/home/codev";

import { removeArrayDuplicate } from "../../_lib/util";

interface Props {
  selectedPosition: string;
  setSelectedPosition: (position: string) => void;
  users: Codev[]; // Ensure the users array uses the correct type
}

const CodevListFilter: React.FC<Props> = ({
  selectedPosition,
  setSelectedPosition,
  users,
}) => {
  const selectGroupRef = useRef<HTMLDivElement>(null);

  // Extract unique display_position values
  const positions = removeArrayDuplicate(
    users.map((user) => user.display_position).filter(Boolean), // Safely access display_position
  );

  const handleSelectPosition = () => {
    if (selectGroupRef.current) {
      selectGroupRef.current.style.display = "none";
      selectGroupRef.current.style.overflow = "hidden";
    }
    setSelectedPosition("");
  };

  return (
    <div className="mb-6 flex w-full flex-col items-center justify-between p-3">
      <div className="flex w-full max-w-80 flex-col">
        <Select value={selectedPosition} onValueChange={setSelectedPosition}>
          <SelectTrigger
            aria-label="Position"
            className="text-md bg-gray-100 dark:bg-dark-100 h-11 w-full rounded-full border border-gray-200 dark:border-gray-700 px-5 text-gray-900 dark:text-white"
          >
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent
            ref={selectGroupRef}
            className="bg-white dark:bg-dark-300 relative rounded-xl text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
          >
            <SelectGroup className="mt-12">
              {positions.map((position, i) => (
                <SelectItem
                  key={i}
                  value={position}
                  className="cursor-pointer text-primary dark:text-white"
                >
                  {position}
                </SelectItem>
              ))}
              <div className="border-gray-200 dark:border-dark-200 bg-white dark:bg-dark-300 fixed left-0 right-0 top-0 flex w-full flex-row items-center justify-between border-b px-3 py-2">
                <span className="text-gray-900 dark:text-white">Filter by</span>
                <Button
                  className="w-auto bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white"
                  variant="default"
                  size="sm"
                  onClick={handleSelectPosition}
                >
                  Clear
                </Button>
              </div>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CodevListFilter;
