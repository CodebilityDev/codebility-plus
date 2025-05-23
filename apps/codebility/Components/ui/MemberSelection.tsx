import { useState } from "react";
import Image from "next/image";
import DefaultAvatar from "@/Components/DefaultAvatar";
import { IconPlus } from "@/public/assets/svgs";
import { Codev } from "@/types/home/codev";
import { Icon } from "lucide-react";

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
}

export const MemberSelection = ({
  users,
  selectedMembers,
  onMemberAdd,
  onMemberRemove,
  excludeMembers = [],
}: MemberSelectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");

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
      <label className="dark:text-light-900 text-black">Team Members</label>
      <div className="flex gap-2">
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-12 w-12 rounded-full p-0">
              <Image
                src={IconPlus}
                alt="Add"
                className="h-6 w-6"
                width={24}
                height={24}
              />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="bottom"
            align="start"
            className="dark:bg-dark-100 z-[100] max-h-[200px] w-[250px] overflow-y-auto rounded-lg bg-white"
          >
            <DropdownMenuLabel className="pb-2 text-center text-sm">
              Add Members
            </DropdownMenuLabel>

            <div className="px-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search members"
                className="dark:bg-dark-200 mb-2 h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none"
              />
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuLabel className="px-4 py-2 text-xs">
              Available Members
            </DropdownMenuLabel>

            {filteredMembers.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500">
                No members available
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
