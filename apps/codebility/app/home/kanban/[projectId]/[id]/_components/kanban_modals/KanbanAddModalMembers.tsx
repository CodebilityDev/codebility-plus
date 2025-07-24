import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getCachedUser } from "@/lib/server/supabase-server-comp";
import { IconPlus } from "@/public/assets/svgs";
import { createClientClientComponent } from "@/utils/supabase/client";

import { cn } from "@codevs/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";

import { fetchAvailableMembers } from "../../actions";

interface CodevMember {
  id: string;
  first_name: string;
  last_name: string;
  image_url?: string | null;
}

interface Props {
  initialSelectedMembers?: string[]; // Array of member IDs
  onMembersChange?: (memberIds: string[]) => void;
  projectId: string;
  /** Optional list of member IDs that should be disabled from selection */
  disabledMembers?: string[];
  /** If true, only one member can be selected */
  singleSelection?: boolean;
}

export default function KanbanAddModalMembers({
  initialSelectedMembers = [],
  onMembersChange,
  projectId,
  disabledMembers = [],
  singleSelection = false,
}: Props) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(
    initialSelectedMembers,
  );
  const [user, setUser] = useState<any | null>(null);

  const [availableMembers, setAvailableMembers] = useState<CodevMember[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [supabase, setSupabase] = useState<any>(null);

  // useEffect(() => {
  //   const loadMembers = async () => {
  //     try {
  //       const members = await fetchAvailableMembers(projectId);
  //       setAvailableMembers(members);
  //     } catch (error) {
  //       console.error("Error loading members:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   loadMembers();
  // }, [projectId]);
  useEffect(() => {
    const supabaseClient = createClientClientComponent();
    setSupabase(supabaseClient);
  }, []);

  useEffect(() => {
    if (!supabase) return;

    const loadMembers = async () => {
      try {
        console.log("Fetching members for project ID:", projectId);
        const members = await fetchAvailableMembers(projectId);
        console.log("Fetched members:", members); // Debugging log
        const user = await supabase.auth.getUser();
        console.log("Current user:", user); // Debugging logi

        if (Array.isArray(members)) {
          setAvailableMembers(members);
        } else {
          console.error("Expected an array but got:", members);
        }

        setUser(user.data.user);
      } catch (error) {
        console.error("Error loading members:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      loadMembers();
    }
  }, [projectId, supabase]);

  const selectedMembers = availableMembers.filter((member) =>
    selectedMemberIds.includes(member.id),
  );

  const addMember = (memberId: string) => {
    if (singleSelection) {
      const newIds = [memberId];
      setSelectedMemberIds(newIds);
      onMembersChange?.(newIds);
    } else if (!selectedMemberIds.includes(memberId)) {
      const newIds = [...selectedMemberIds, memberId];
      setSelectedMemberIds(newIds);
      onMembersChange?.(newIds);
    }
  };

  const removeMember = (memberId: string) => {
    const newSelectedIds = selectedMemberIds.filter((id) => id !== memberId);
    setSelectedMemberIds(newSelectedIds);
    onMembersChange?.(newSelectedIds); // Ensure this triggers parent update
  };

  const handleSelfAssign = () => {
    if (user && !selectedMemberIds.includes(user.id)) {
      const newSelectedIds = [...selectedMemberIds, user.id];
      setSelectedMemberIds(newSelectedIds);
      onMembersChange?.(newSelectedIds);
    }
  };

  const filteredMembers = availableMembers.filter((member) =>
    `${member.first_name} ${member.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-1">
      {/*  <label htmlFor="members" className="text-sm font-medium">
        Team Members
      </label> */}
      <input
        type="hidden"
        name="membersId"
        value={selectedMemberIds.join(",")}
      />
      <div className="flex flex-wrap gap-2">
        {selectedMembers.map((member) => (
          <div
            key={member.id}
            className="group relative h-10 w-10 cursor-pointer rounded-full hover:opacity-80"
            onClick={() => removeMember(member.id)}
            title={`${member.first_name} ${member.last_name}`}
          >
            {member.image_url ? (
              <Image
                src={member.image_url}
                alt={`${member.first_name}'s avatar`}
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-200 text-sm">
                {member.first_name[0]}
              </div>
            )}
            <div className="absolute inset-0 hidden items-center justify-center rounded-full bg-black bg-opacity-40 group-hover:flex">
              <span className="text-xs text-white">✕</span>
            </div>
          </div>
        ))}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="default"
              className="h-10 w-10 rounded-full p-0"
              disabled={isLoading}
            >
              <IconPlus className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="max-h-[300px] w-64 overflow-y-auto p-2"
            align="start"
          >
            <DropdownMenuLabel>Add Team Members</DropdownMenuLabel>

            <div className="px-2 py-2">
              <input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="dark:bg-dark-200 w-full rounded-md border px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <DropdownMenuSeparator />

            {isLoading ? (
              <div className="py-4 text-center text-sm text-gray-500">
                Loading members...
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="py-4 text-center text-sm text-gray-500">
                No members found
              </div>
            ) : (
              filteredMembers.map((member) => {
                // Disable if already selected or if present in the disabledMembers prop.
                const isDisabled =
                  selectedMemberIds.includes(member.id) ||
                  disabledMembers.includes(member.id);
                return (
                  <DropdownMenuItem
                    key={member.id}
                    className="flex cursor-pointer items-center gap-2 px-2 py-1"
                    onClick={() => addMember(member.id)}
                    disabled={isDisabled}
                  >
                    {member.image_url ? (
                      <Image
                        src={member.image_url}
                        alt={`${member.first_name}'s avatar`}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-sm">
                        {member.first_name[0]}
                      </div>
                    )}
                    <span className="flex-1 truncate">
                      {member.first_name} {member.last_name}
                    </span>
                  </DropdownMenuItem>
                );
              })
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* self assign */}
        <div
          className={cn(
            "flex items-center justify-center",
            !selectedMemberIds.includes(user?.id) ? "flex" : "hidden",
          )}
        >
          <button
            onClick={handleSelfAssign}
            disabled={isLoading}
            type="button"
            className="text-black-200 w-fit cursor-pointer text-xs font-light ml-2 hover:text-blue-300 dark:text-slate-300 dark:hover:text-blue-100"
          >
            Assign to me
          </button>
        </div>
      </div>
    </div>
  );
}