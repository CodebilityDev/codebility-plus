import React, { useRef } from "react";
import { Button } from "@/Components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { profiles_ListFilterT } from "@/types/home";

import { removeArrayDuplicate } from "../../_lib/util";

const ProfileListsFilter: React.FC<profiles_ListFilterT> = ({
  selectedPosition,
  setSelectedPosition,
  users,
}) => {
  const selectGroupRef = useRef<HTMLDivElement>(null);

  const positions = removeArrayDuplicate(
    users.map((user) => user?.main_position),
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
      <div className="flex w-full max-w-80 flex-col ">
        <Select value={selectedPosition} onValueChange={setSelectedPosition}>
          <SelectTrigger
            aria-label="Position"
            className="text-md bg-dark-100 h-11 w-full rounded-full border-none px-5 text-white"
          >
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent
            ref={selectGroupRef}
            className="bg-dark-300 relative rounded-xl text-white"
          >
            <SelectGroup className="mt-12">
              {positions.map((position, i) => (
                <SelectItem
                  key={i}
                  value={position}
                  className="focus:dark:bg-dark-300"
                >
                  {position}
                </SelectItem>
              ))}
              <div className="border-dark-200 bg-dark-300 fixed left-0 right-0 top-0 flex w-full flex-row items-center justify-between border-b px-3 py-2">
                <span>Filter by</span>
                <Button
                  className="w-auto bg-transparent hover:bg-transparent  "
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

export default ProfileListsFilter;
