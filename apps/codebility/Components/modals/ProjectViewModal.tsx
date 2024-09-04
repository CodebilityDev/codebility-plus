import Image from "next/image";
import Link from "next/link";
import { useModal } from "@/hooks/use-modal-projects";
import { defaultAvatar } from "@/public/assets/images";
import { IconGithub, IconLink } from "@/public/assets/svgs";

import { Button } from "@codevs/ui/button";
import { Dialog, DialogContent } from "@codevs/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@codevs/ui/hover-card";

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
  } = data || {}

  const isModalOpen = isOpen && type === "projectViewModal";

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
              <p className="text-md text-gray">Date Started: {created_at}</p>
              <p className="text-md text-gray">
                Lead by:{" "}
                <span className="text-blue-100">
                  {team_leader?.first_name} {team_leader?.last_name}
                </span>
              </p>
            </div>
          </div>
          <div className="dark:bg-dark-200 flex flex-col gap-4 rounded-lg p-4">
            <p className="text-2xl">Contributors</p>
            <div className="flex h-40 max-h-40 flex-col gap-3 overflow-y-auto xl:h-auto xl:max-h-max xl:flex-row">
              {users?.map(({ user }: any) => {
                if (!user) return null;
                return (
                  <div key={user.id} className="flex items-center gap-1">
                    <HoverCard>
                      <HoverCardTrigger className="cursor-pointer">
                        <div className="from-teal to-violet relative size-[55px] overflow-hidden rounded-full bg-gradient-to-b bg-cover object-cover p-[2px]">
                          <Image
                            alt={`${user.first_name} ${user.last_name}`}
                            src={user.image_url || defaultAvatar}
                            width={60}
                            height={60}
                            className="from-violet h-auto w-full rounded-full bg-gradient-to-b to-blue-500 bg-cover object-cover"
                          />
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent
                        align="start"
                        className="ml-2 border-none"
                      >
                        <p className="text-base font-semibold">{`${user.first_name} ${user.last_name}`}</p>
                        <p className="text-xs text-gray-500">
                          {user.position.join(", ")}
                        </p>
                      </HoverCardContent>
                    </HoverCard>
                    <div className="ml-2 xl:hidden">
                      <p className="text-sm font-semibold">{`${user.first_name} ${user.last_name}`}</p>
                      <p className="text-xs text-gray-500">
                        {user.position.join(", ")}
                      </p>
                    </div>
                  </div>
                );
              })}
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
