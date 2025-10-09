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
    <div className="mb-8 flex w-full flex-col items-center justify-between p-4">
      <div className="flex w-full max-w-sm flex-col">
        <Select value={selectedPosition} onValueChange={setSelectedPosition}>
          <SelectTrigger
            aria-label="Position"
            className="text-md bg-white/10 backdrop-blur-sm dark:bg-white/5 h-12 w-full rounded-full border border-white/20 dark:border-white/10 px-6 text-white dark:text-white shadow-lg hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300"
          >
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent
            ref={selectGroupRef}
            className="bg-white/10 backdrop-blur-md dark:bg-white/5 relative rounded-xl text-white dark:text-white border border-white/20 dark:border-white/10 shadow-xl"
          >
            <SelectGroup className="mt-12">
              {positions.map((position, i) => (
                <SelectItem
                  key={i}
                  value={position}
                  className="cursor-pointer text-white dark:text-white hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
                >
                  {position}
                </SelectItem>
              ))}
              <div className="border-white/20 dark:border-white/10 bg-white/10 backdrop-blur-sm dark:bg-white/5 fixed left-0 right-0 top-0 flex w-full flex-row items-center justify-between border-b px-3 py-2">
                <span className="text-white dark:text-white font-medium">Filter by</span>
                <Button
                  className="w-auto bg-transparent hover:bg-white/20 dark:hover:bg-white/10 text-white dark:text-white transition-all duration-200"
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
