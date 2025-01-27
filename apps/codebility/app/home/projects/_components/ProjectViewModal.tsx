import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getMembers, getTeamLead } from "@/app/home/projects/actions";
import DefaultAvatar from "@/Components/DefaultAvatar";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { useModal } from "@/hooks/use-modal-projects";
import { IconFigma, IconGithub, IconLink } from "@/public/assets/svgs";
import { Codev } from "@/types/home/codev";
import { format, parseISO } from "date-fns";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@codevs/ui/hover-card";

const ProjectViewModal = () => {
  const { isOpen, type, onClose, onOpen, data } = useModal();
  const isModalOpen = isOpen && type === "projectViewModal";

  const [teamLead, setTeamLead] = useState<Codev | null>(null);
  const [members, setMembers] = useState<Codev[]>([]);

  const formattedDate = data?.created_at
    ? format(parseISO(data.created_at), "MM/dd/yyyy hh:mm:ss a")
    : null;

  useEffect(() => {
    const fetchTeamLeadAndMembers = async () => {
      if (!data) return;

      // Fetch Team Lead
      if (data.team_leader_id) {
        const { error, data: fetchedTeamLead } = await getTeamLead(
          data.team_leader_id,
        );
        if (!error && fetchedTeamLead) {
          setTeamLead(fetchedTeamLead);
        }
      }

      // Fetch Members
      if (data.members && data.members.length > 0) {
        const { error, data: fetchedMembers } = await getMembers(data.members);
        if (!error && fetchedMembers) {
          setMembers(fetchedMembers);
        }
      }
    };

    if (isModalOpen) {
      fetchTeamLeadAndMembers();
    }
  }, [isModalOpen, data]);

  const handleDialogChange = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleDialogChange}>
      <DialogContent
        aria-describedby={undefined}
        className="xs:w-[80%] h-[32rem] w-[95%] max-w-3xl overflow-x-auto overflow-y-auto sm:w-[70%] lg:h-auto"
      >
        <DialogHeader>
          <DialogTitle className="mb-2 text-left text-xl">
            Project View
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-8">
          {/* Project Image */}
          <div className="dark:bg-dark-100 flex justify-center rounded-lg bg-slate-300">
            {data?.main_image ? (
              <Image
                alt={`${data?.name} project image`}
                src={data.main_image}
                width={120}
                height={91}
                className="h-[120px] w-[91px] object-contain"
                loading="eager"
                priority
              />
            ) : (
              <DefaultAvatar size={120} />
            )}
          </div>

          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Project Details */}
            <div className="dark:bg-dark-200 flex flex-1 flex-col gap-4 rounded-lg p-4">
              <p className="text-2xl">{data?.name}</p>
              {data?.description && (
                <p className="md:text-md text-gray max-h-20 overflow-auto text-sm lg:text-lg">
                  {data.description}
                </p>
              )}
              <div className="flex items-center gap-2">
                {data?.github_link && (
                  <Link href={data.github_link} target="_blank">
                    <IconGithub className="size-5 invert duration-300 hover:-translate-y-1 dark:invert-0" />
                  </Link>
                )}
                {data?.website_url && (
                  <Link href={data.website_url} target="_blank">
                    <IconLink className="size-5 invert duration-300 hover:-translate-y-1 dark:invert-0" />
                  </Link>
                )}
                {data?.figma_link && (
                  <Link href={data.figma_link} target="_blank">
                    <IconFigma className="size-5 invert duration-300 hover:-translate-y-1 dark:invert-0" />
                  </Link>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="dark:bg-dark-200 flex flex-1 flex-col gap-2 rounded-lg p-4">
              <p className="text-2xl">Status</p>
              <p className="text-lg text-orange-400">{data?.status}</p>
              <p className="text-md text-gray">Date Started: {formattedDate}</p>
              <p className="text-md text-gray">
                Lead by:{" "}
                <span className="capitalize text-blue-100">
                  {teamLead
                    ? `${teamLead.first_name} ${teamLead.last_name}`
                    : "Unknown"}
                </span>
              </p>
            </div>
          </div>

          {/* Contributors */}
          <div className="dark:bg-dark-200 flex flex-col gap-4 rounded-lg p-4">
            <p className="text-2xl">Contributors</p>
            <div className="flex h-40 max-h-40 flex-col gap-3 overflow-y-auto xl:h-auto xl:max-h-max xl:flex-row">
              {members.map((user) => (
                <div key={user.id} className="flex items-center gap-1">
                  <HoverCard>
                    <HoverCardTrigger className="cursor-pointer">
                      {user.image_url ? (
                        <div className="relative size-[55px] overflow-hidden rounded-full">
                          <Image
                            src={user.image_url}
                            alt={`${user.first_name} ${user.last_name}`}
                            width={55}
                            height={55}
                            className="rounded-full object-cover"
                          />
                        </div>
                      ) : (
                        <DefaultAvatar size={55} className="p-[2px]" />
                      )}
                    </HoverCardTrigger>

                    <HoverCardContent
                      align="start"
                      className="ml-2 border-none"
                    >
                      <p className="text-base font-semibold capitalize">
                        {`${user.first_name} ${user.last_name}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user.display_position}
                      </p>
                    </HoverCardContent>
                  </HoverCard>
                  <div className="ml-2 xl:hidden">
                    <p className="text-sm font-semibold capitalize">{`${user.first_name} ${user.last_name}`}</p>
                    <p className="text-xs text-gray-500">
                      {user.display_position}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-4 md:flex-row md:justify-end">
            <Button
              variant="destructive"
              className="w-full lg:w-[130px]"
              onClick={() => onOpen("projectDeleteModal", data)}
            >
              Delete
            </Button>
            <Button
              variant="hollow"
              className="w-full lg:w-[130px]"
              onClick={handleDialogChange}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectViewModal;
