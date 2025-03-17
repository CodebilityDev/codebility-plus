import { useState } from "react";
import DefaultAvatar from "@/Components/DefaultAvatar";
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
  const visibleMembers = members.slice(0, 8);
  const remainingMembers = members.slice(8);
  const hasMoreMembers = members.length > 8;



  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {visibleMembers.map((member, index) => (
          <div
            key={member.userId}
            onClick={() => onFilterClick(member.userId)}
            className={`relative cursor-pointer transform-gpu transition-transform duration-300 ease-out ${
              member.isActive
                ? "z-10 scale-110 ring-2 ring-blue-500 rounded-full border-2"
                : `hover:scale-105 ${index > 0 ? "-ml-2" : ""}`
            }`}
            style={{ zIndex: visibleMembers.length - index }}
            title={member.userName}
          >
            <div className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-white shadow-md md:h-10 md:w-10">
              {member.imageUrl ? (
                <img
                  src={member.imageUrl}
                  alt={member.userName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <DefaultAvatar size={40} />
              )}
            </div>
          </div>
        ))}

        {hasMoreMembers && (
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <div
                className="relative z-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-gray-100 text-sm font-medium shadow-md transition-all duration-200 hover:scale-105 md:h-10 md:w-10"
                title="More members"
              >
                +{remainingMembers.length}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="max-h-[300px] w-48 overflow-y-auto p-2"
            >
              {remainingMembers.map((member) => (
                <DropdownMenuItem
                  key={member.userId}
                  onClick={() => onFilterClick(member.userId)}
                  className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 ${
                    member.isActive ? "bg-gray" : ""
                  }`}
                >
                  <div className="relative h-6 w-6 overflow-hidden rounded-full border-2 bg-light-900 border-white dark:text-white dark:bg-gray">
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
                  <span className="flex-1 truncate text-sm">{member.userName}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}