import { Button } from "@/Components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@radix-ui/react-dropdown-menu"
import Image from "next/image"
import { IconPlus } from "@/public/assets/svgs"
import { useState } from "react"
import { useFetchMembers } from "../../_hooks/use-fetch-members"
import { Member } from "@/app/home/_types/member"

interface Props {
    initialSelectedMembers?: Member[];
}

export default function KanbanAddModalMembers({ initialSelectedMembers }: Props) {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [ selectedMembers, setSelectedMembers ] = useState<Member[]>(initialSelectedMembers || []);
  const { data: members } = useFetchMembers();

  const addMember = (member: Member) => {
    setSelectedMembers((prevMembers) => {
        if (prevMembers.some(prevMember => prevMember.id === member.id)) return prevMembers;
        return [...prevMembers, member];
    })
  }

  const removeMember = (id: string) => {
    setSelectedMembers((prevMembers) => prevMembers.filter((member) => member.id !== id))
  }

  return (
    <div className="flex flex-col gap-1">
        <label htmlFor="members">Members</label>
        <input type="hidden" name="membersId" value={selectedMembers.map(member => member.id)} />
        <div className="flex gap-2">
        <div className="flex flex-wrap items-center">
            {selectedMembers.map((member) => (
                <div
                    className="relative h-12 w-12 cursor-pointer rounded-full bg-cover object-cover"
                    key={member.id}
                    onClick={() => removeMember(member.id)}
                >
                    <Image
                    alt="Avatar"
                    src={member.image_url ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/${member.image_url}` : "/default-avatar.jpg"}
                    fill
                    title={`${member.first_name}'s Avatar`}
                    className="h-auto w-full rounded-full bg-cover object-cover"
                    loading="eager"
                    />
                </div>
            ))}
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer" asChild>
                <Button variant="hollow" className="h-12 w-12 rounded-full p-0">
                    <IconPlus className="invert dark:invert-0" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
            side="bottom"
            sideOffset={10}
            align="start"
            className="z-10 max-h-[200px] overflow-y-auto rounded-lg bg-white dark:bg-dark-100"
            >
                <DropdownMenuLabel className="pb-2 text-center text-sm">Add Members</DropdownMenuLabel>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search members"
                    className="border-gray-300 mb-2 h-10 w-full rounded-lg border bg-white px-3 text-sm focus:outline-none dark:bg-dark-200"
                />
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="px-4 py-2 text-xs">Available Members</DropdownMenuLabel>
                {members
                    ?.filter((user) =>
                    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((user) => (
                    <DropdownMenuItem
                        key={user.id}
                        className="hover:bg-gray-100 flex cursor-pointer items-center justify-between px-4 py-2 dark:hover:bg-dark-200"
                        onClick={() => addMember(user)}
                    >
                        <div className="flex items-center gap-2">
                        <div className="relative h-8 w-8 rounded-full bg-cover object-cover">
                            <Image
                            alt="Avatar"
                            src={user.image_url ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/${user.image_url }`:  "/default-avatar.jpg"}
                            fill
                            title={`${user.id}'s Avatar`}
                            className="h-auto w-full rounded-full bg-cover object-cover"
                            loading="eager"
                            />
                        </div>
                        <span>{`${user.first_name} ${user.last_name}`}</span>
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
        </div>
    </div>
  )
}
