import { useState } from "react";
import DefaultAvatar from "@/components/DefaultAvatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";

interface Member {
  userId: string;
  userName: string;
  imageUrl?: string | null;
  isActive: boolean;
}

interface Props {
  members: Member[];
  onFilterClick: (userId: string) => void;
}

export default function UserTaskFilter({ members, onFilterClick }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  // Add safety check
  if (!members) {
    return null;
  }

  // Show all members in a grid layout when there are many, otherwise use the single row
  // On mobile, use grid more aggressively to prevent horizontal overflow
  const shouldUseGrid = members.length > 6;
  const visibleMembers = shouldUseGrid ? members.slice(0, 12) : members.slice(0, 10); // Show more members
  const remainingMembers = shouldUseGrid ? members.slice(12) : members.slice(10);
  const hasMoreMembers = shouldUseGrid ? members.length > 12 : members.length > 10;

  return (
    <div className="flex items-center w-full overflow-hidden">
      <div className={shouldUseGrid ? "grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-1" : "flex space-x-1 sm:space-x-2"}>
        {visibleMembers.map((member, index) => (
          <div
            key={member.userId}
            onClick={() => onFilterClick(member.userId)}
            className={`relative transform-gpu cursor-pointer transition-transform duration-300 ease-out ${
              member.isActive
                ? "z-10 scale-110 rounded-full border-2 ring-2 ring-customBlue-500"
                : shouldUseGrid
                  ? "hover:scale-105"
                  : `hover:scale-105 ${index > 0 ? "sm:-ml-2" : ""}`
            }`}
            style={{ zIndex: shouldUseGrid ? 1 : visibleMembers.length - index }}
            title={member.userName}
          >
            <div
              className={`relative h-8 w-8 overflow-hidden rounded-full ${
                member.imageUrl ? "border-2" : "border-1"
              } border-white shadow-md`}
            >
              {member.imageUrl ? (
                <img
                  src={member.imageUrl}
                  alt={member.userName}
                  className="block h-full w-full object-cover"
                />
              ) : (
                <DefaultAvatar size={32} />
              )}
            </div>
          </div>
        ))}

        {hasMoreMembers && (
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <div
                className="relative z-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-white/20 backdrop-blur-sm dark:bg-white/10 text-sm font-medium shadow-md transition-all duration-200 hover:scale-105"
                title="More members"
              >
                +{remainingMembers.length}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="max-h-[300px] w-48 overflow-y-auto p-2 bg-white/10 backdrop-blur-sm dark:bg-white/5 border border-white/20 dark:border-white/10"
            >
              {remainingMembers.map((member) => (
                <DropdownMenuItem
                  key={member.userId}
                  onClick={() => onFilterClick(member.userId)}
                  className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 hover:bg-white/20 dark:hover:bg-white/10 transition-colors ${
                    member.isActive ? "bg-white/30 dark:bg-white/20" : ""
                  }`}
                >
                  <div className="bg-white/20 dark:bg-white/10 backdrop-blur-sm relative h-6 w-6 overflow-hidden rounded-full border-2 border-white dark:text-white">
                    {member.imageUrl ? (
                      <img
                        src={member.imageUrl}
                        alt={member.userName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <DefaultAvatar size={24} />
                    )}
                  </div>
                  <span className="flex-1 truncate text-sm">
                    {member.userName}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
