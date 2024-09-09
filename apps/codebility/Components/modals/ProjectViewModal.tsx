import Link from "next/link"
import Image from "next/image"

import { Button } from "@codevs/ui/button"
import { Dialog, DialogContent } from "@codevs/ui/dialog"
import { useModal } from "@/hooks/use-modal-projects"
import { IconGithub, IconLink } from "@/public/assets/svgs"
import { defaultAvatar } from "@/public/assets/images"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@codevs/ui/hover-card"

import { format, parseISO } from 'date-fns';
import { User, ViewType } from "@/app/home/projects/_types/projects"

const ProjectViewModal = () => {
  const { isOpen, type, onClose, onOpen, data } = useModal();

  const {
    name,
    summary,
    live_link,
    users,
    github_link,
    status,
    team_leader,
    created_at,
    thumbnail,
    view_type,
    members = [],
  } = data || {}

  const parseMembers = (membersData: string[]): User[] => {
    return membersData.map((member) => JSON.parse(member) as User);
  };

   // Parse the members data
   const membersParsed = parseMembers(members);



    // Ensure view_type is a string before parsing, and use type assertion
    const viewType: ViewType = typeof view_type === "string"
    ? JSON.parse(view_type) as ViewType
    : { first_name: "Unknown", last_name: "Unknown" };


// Parse the date string using date-fns
const formattedDate = created_at ? format(parseISO(created_at), 'MM/dd/yyyy hh:mm:ss a') : null;

  const isModalOpen = isOpen && type === "projectViewModal"

  return (
    <Dialog open={isModalOpen} onOpenChange={() => onClose()}>
      <DialogContent className="xs:w-[80%] h-[32rem] w-[95%] max-w-3xl overflow-x-auto overflow-y-auto sm:w-[70%] lg:h-auto">
        <div className="flex flex-col gap-8">
          <div className="flex justify-center rounded-lg bg-dark-100">
 {thumbnail ? (
              <Image
                alt={`${name}`}
                src={thumbnail}
                width={120}
                height={91}
                className="h-[120px] w-[91px] object-contain"
                loading="eager"
                priority
              />
            ) : (
              <Image
                alt={`${name}`}
                src={defaultAvatar}
                width={120}
                height={91}
                className="h-[120px] w-[91px] object-contain"
                loading="eager"
                priority
              />
            )}
          </div>
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="dark:bg-dark-200 flex flex-1 flex-col gap-4 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <p className="text-2xl">{name}</p>
              </div>
              <p className="md:text-md text-gray text-sm lg:text-lg">
                {summary}
              </p>
              <div className="flex items-center gap-2">
                <Link href={github_link as string} target="_blank">
                  <IconGithub className="h-8 w-8 invert duration-300 hover:-translate-y-1 dark:invert-0" />
                </Link>
                {live_link && (
                  <Link href={live_link} target="_blank">
                    <IconLink className="size-5 invert duration-300 hover:-translate-y-1 dark:invert-0" />
                  </Link>
                )}
              </div>
            </div>
            <div className="dark:bg-dark-200 flex flex-1 flex-col gap-2 rounded-lg p-4">
              <p className="text-2xl">Status</p>
              <p className="text-lg text-orange-400">{status}</p>
              <p className="text-md text-gray">Date Started: {formattedDate}</p>
              <p className="text-md text-gray">
                Lead by:{" "}
                <span className="text-blue-100">
                   {viewType.first_name} {viewType.last_name}
                </span>
              </p>
            </div>
          </div>
          <div className="dark:bg-dark-200 flex flex-col gap-4 rounded-lg p-4">
            <p className="text-2xl">Contributors</p>
            <div className="max-h-40 h-40 overflow-y-auto flex flex-col gap-3 xl:h-auto xl:max-h-max xl:flex-row">
            {membersParsed?.map((user) => (
                <div key={user.id} className="flex gap-1 items-center">
                  <HoverCard>
                    <HoverCardTrigger className="cursor-pointer">
                      <div className="relative size-[55px] overflow-hidden rounded-full bg-gradient-to-b from-teal to-violet bg-cover object-cover p-[2px]">
                        <Image
                          alt={`${user.first_name} ${user.last_name}`}
                          src={user.image_url || defaultAvatar}
                          width={60}
                          height={60}
                          className="h-auto w-full rounded-full bg-gradient-to-b from-violet to-blue-500 bg-cover object-cover"
                        />
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent align="start" className="ml-2 border-none">
                      <p className="text-base font-semibold">{`${user.first_name} ${user.last_name}`}</p>
                      <p className="text-gray-500 text-xs">{user.position}</p>
                    </HoverCardContent>
                  </HoverCard>
                  <div className="ml-2 xl:hidden">
                    <p className="text-sm font-semibold">{`${user.first_name} ${user.last_name}`}</p>
                    <p className="text-gray-500 text-xs">{user.position}</p>
                  </div>
                </div>
              ))}

            </div>
          </div>

          <div className="flex justify-end space-x-5">
            <Button
              variant="destructive"
              className="w-full lg:w-[130px]"
              onClick={() => onOpen("projectDeleteModal", data)}
            >
              Delete
            </Button>
            <Button variant="default" className="w-full lg:w-[130px]" onClick={() => onOpen("projectEditModal", data)}>
              Edit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectViewModal;
