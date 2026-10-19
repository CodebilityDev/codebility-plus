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
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
  isSearching?: boolean;
  searchError?: string | null;
  currentMembers?: Codev[];
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
  searchQuery,
  onSearchQueryChange,
  isSearching = false,
  searchError = null,
  currentMembers = [],
  excludeMembers = [],
  showLabel = true, // default true — no change to existing callers
}: MemberSelectionProps) => {
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const currentSearchQuery = searchQuery ?? internalSearchQuery;

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

  const searchTerms = currentSearchQuery
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .split(" ")
    .filter(Boolean);
  const matchesName = (user: Codev) => {
    const firstName = user.first_name.trim().toLowerCase();
    const lastName = user.last_name.trim().toLowerCase();

    return searchTerms.every(
      (term) => firstName.includes(term) || lastName.includes(term),
    );
  };
  const selectedMemberIds = new Set(selectedMembers.map(({ id }) => id));
  const currentMemberResults =
    onSearchQueryChange && searchTerms.length > 0
      ? currentMembers.filter(
          (member) =>
            !excludeMembers.includes(member.id) && matchesName(member),
        )
      : [];
  const currentMemberIds = new Set(currentMemberResults.map(({ id }) => id));
  const remoteMemberResults = users.filter(
    (user) =>
      !excludeMembers.includes(user.id) &&
      !selectedMemberIds.has(user.id) &&
      matchesName(user) &&
      !currentMemberIds.has(user.id),
  );
  const filteredMembers = onSearchQueryChange
    ? Array.from(
        new Map(
          [...currentMemberResults, ...remoteMemberResults].map((member) => [
            member.id,
            member,
          ]),
        ).values(),
      )
    : availableMembers.filter((user) =>
        `${user.first_name} ${user.last_name}`
          .toLowerCase()
          .includes(currentSearchQuery.toLowerCase()),
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
                value={currentSearchQuery}
                onChange={(e) => {
                  if (onSearchQueryChange) {
                    onSearchQueryChange(e.target.value);
                  } else {
                    setInternalSearchQuery(e.target.value);
                  }
                }}
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
                  {isSearching
                    ? "Searching members..."
                    : searchError
                      ? "Unable to search members"
                      : currentSearchQuery
                        ? "No members found matching your search"
                        : "No members available"}
                </div>
              ) : (
                filteredMembers.map((user) => (
                <DropdownMenuItem
                  key={user.id}
                  onClick={() => {
                    if (currentMemberIds.has(user.id)) {
                      if (selectedMemberIds.has(user.id)) {
                        onMemberRemove(user.id);
                      } else {
                        onMemberAdd(user);
                      }
                      return;
                    }
                    onMemberAdd(user);
                  }}
                  className={`dark:hover:bg-dark-200 flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-gray-100 ${
                    currentMemberIds.has(user.id)
                      ? "border-l-2 border-green-500 bg-green-50/50 dark:bg-green-900/10"
                      : ""
                  }`}
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
                      {currentMemberIds.has(user.id) && (
                        <span className="ml-2 text-xs text-green-600 dark:text-green-400">
                          (Current)
                        </span>
                      )}
                    </span>
                  </div>
                  {currentMemberIds.has(user.id) && (
                    <span
                      aria-label={
                        selectedMemberIds.has(user.id)
                          ? "Selected"
                          : "Not selected"
                      }
                      className={`flex h-5 w-5 items-center justify-center rounded border text-xs ${
                        selectedMemberIds.has(user.id)
                          ? "border-green-600 bg-green-600 text-white"
                          : "border-gray-400"
                      }`}
                    >
                      {selectedMemberIds.has(user.id) ? "✓" : ""}
                    </span>
                  )}
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
