import { useState, useRef, useEffect } from "react";
import DefaultAvatar from "@/components/DefaultAvatar";
import { IconPlus } from "@/public/assets/svgs";
import { Codev } from "@/types/home/codev";

import { Button } from "@codevs/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";

interface MemberSelectionProps {
  users: Codev[];
  selectedMembers: Codev[];
  onMemberAdd: (member: Codev) => void;
  onMemberRemove: (memberId: string) => void;
  excludeMembers?: string[]; // IDs of members to exclude (e.g., team leader)
  // Added: allow callers to hide the built-in "Team Members" label when they
  // already provide their own heading. Defaults to true (existing behavior).
  showLabel?: boolean;
}

export const MemberSelection = ({
  users,
  selectedMembers,
  onMemberAdd,
  onMemberRemove,
  excludeMembers = [],
  showLabel = true, // default true — no change to existing callers
}: MemberSelectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
  }, [isOpen]);

  const availableMembers = users.filter(
    (user) =>
      !selectedMembers.find((member) => member.id === user.id) &&
      !excludeMembers.includes(user.id),
  );

  const filteredMembers = availableMembers.filter((user) =>
    `${user.first_name} ${user.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-2">
      {/* Only render label when showLabel is true (default).
          Pass showLabel={false} from callers that provide their own heading. */}
      {showLabel && (
        <label className="dark:text-light-900 text-black">Team Members</label>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {selectedMembers.map((member) => (
            <div
              key={member.id}
              className="relative h-12 w-12 cursor-pointer rounded-full bg-cover"
              onClick={() => onMemberRemove(member.id)}
              title={`${member.first_name} ${member.last_name}`}
            >
              {member.image_url ? (
                <img
                  src={member.image_url}
                  alt={`${member.first_name}`}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <DefaultAvatar size={48} />
              )}
            </div>
          ))}
        </div>

        <DropdownMenu onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <button 
              className="h-12 w-12 rounded-full border border-gray-600 bg-transparent hover:bg-gray-700 transition-colors"
              style={{ display: "grid", placeItems: "center" }}
            >
              <IconPlus className="h-5 w-5" style={{ transform: "translateX(3px) translateY(1px)" }} />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="bottom"
            align="start"
            className="dark:bg-dark-100 z-[100] w-[280px] rounded-lg bg-white shadow-lg overflow-hidden"
            sideOffset={4}
          >
            <DropdownMenuLabel className="py-3 text-center text-sm font-semibold border-b dark:border-gray-700">
              Add Members
            </DropdownMenuLabel>

            <div className="sticky top-0 z-10 bg-white dark:bg-dark-100 p-3 border-b dark:border-gray-700">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onPointerDown={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                placeholder="Search members..."
                className="dark:bg-dark-200 w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-customBlue-500 dark:text-white"
              />
            </div>

            <div className="max-h-[320px] overflow-y-auto">
              <DropdownMenuLabel className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wide sticky top-0 bg-white dark:bg-dark-100">
                Available Members ({filteredMembers.length})
              </DropdownMenuLabel>

              {filteredMembers.length === 0 ? (
                <div className="px-4 py-8 text-sm text-gray-500 text-center">
                  {searchQuery ? 'No members found matching your search' : 'No members available'}
                </div>
              ) : (
                filteredMembers.map((user) => (
                <DropdownMenuItem
                  key={user.id}
                  onClick={() => onMemberAdd(user)}
                  className="dark:hover:bg-dark-200 flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    {user.image_url ? (
                      <img
                        src={user.image_url}
                        alt={user.first_name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <DefaultAvatar size={32} />
                    )}
                    <span className="capitalize">
                      {user.first_name} {user.last_name}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))
            )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};