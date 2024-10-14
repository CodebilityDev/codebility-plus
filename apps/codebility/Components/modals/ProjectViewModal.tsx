import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { parseMembers } from "@/app/home/projects/_lib";
import { DEFAULT_AVATAR } from "@/app/home/projects/_lib/constants";
import { User } from "@/app/home/projects/_types/projects";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { useModal } from "@/hooks/use-modal-projects";
import { IconFigma, IconGithub, IconLink } from "@/public/assets/svgs";
import { format, parseISO } from "date-fns";

import { useSupabase } from "@codevs/supabase/hooks/use-supabase";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@codevs/ui/hover-card";

const ProjectViewModal = () => {
  const supabase = useSupabase();

  const { isOpen, type, onClose, onOpen, data } = useModal();
  const isModalOpen = isOpen && type === "projectViewModal";

  const [teamLead, setTeamLead] = useState<User[]>([]);
  const team_leader_id = data?.team_leader_id;
  const membersParsed = parseMembers(data?.members || []);
  const formattedDate = data?.created_at
    ? format(parseISO(data.created_at), "MM/dd/yyyy hh:mm:ss a")
    : null;

  useEffect(() => {
    const getTeamLead = async () => {
      if (!team_leader_id) {
        console.warn("ProjectViewModal: Team leader ID is undefined.");
        return;
      }

      const { data, error } = await supabase
        .from("codev")
        .select("*")
        .eq("id", team_leader_id);

      if (error) {
        if (error) throw error;
        console.error("Error fetching team lead:", error);
      } else {
        setTeamLead(data);
      }
    };
    getTeamLead();
  }, [isModalOpen, team_leader_id]);

  // Ensure view_type is a string before parsing, and use type assertion
  // const viewType: ViewType =
  //   typeof view_type === "string"
  //     ? (JSON.parse(view_type) as ViewType)
  //     : { first_name: "Unknown", last_name: "Unknown" };

  const handleDialogChange = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleDialogChange}>
      <DialogContent
        aria-describedby={undefined}
        className="xs:w-[80%] h-[32rem] w-[95%] max-w-3xl overflow-x-auto overflow-y-auto sm:w-[70%] lg:h-auto"
      >
        <DialogHeader className="relative hidden">
          <DialogTitle className="mb-2 text-left text-xl">
            Project View
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-8">
          <div className="dark:bg-dark-100 flex justify-center rounded-lg bg-slate-300">
            <Image
              alt={`${data?.name} project image`}
              src={data?.thumbnail || DEFAULT_AVATAR}
              width={120}
              height={91}
              className="h-[120px] w-[91px] object-contain"
              loading="eager"
              priority
            />
          </div>
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="dark:bg-dark-200 flex flex-1 flex-col gap-4 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <p className="text-2xl">{data?.name}</p>
              </div>
              {data?.summary && (
                <p className="md:text-md text-gray max-h-20 overflow-auto text-sm lg:text-lg">
                  {data.summary}
                </p>
              )}
              <div className="flex items-center gap-2">
                {data?.github_link && (
                  <Link href={data.github_link} target="_blank">
                    <IconGithub className="size-5 invert duration-300 hover:-translate-y-1 dark:invert-0" />
                  </Link>
                )}
                {data?.live_link && (
                  <Link href={data.live_link} target="_blank">
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
            <div className="dark:bg-dark-200 flex flex-1 flex-col gap-2 rounded-lg p-4">
              <p className="text-2xl">Status</p>
              <p className="text-lg text-orange-400">{data?.status}</p>
              <p className="text-md text-gray">Date Started: {formattedDate}</p>
              <p className="text-md text-gray">
                Lead by:{" "}
                <span className="capitalize text-blue-100">
                  {teamLead[0]?.first_name} {teamLead[0]?.last_name}
                </span>
                {/* <span className="text-blue-100">
                  {viewType.first_name} {viewType.last_name}
                </span> */}
              </p>
            </div>
          </div>
          <div className="dark:bg-dark-200 flex flex-col gap-4 rounded-lg p-4">
            <p className="text-2xl">Contributors</p>
            <div className="flex h-40 max-h-40 flex-col gap-3 overflow-y-auto xl:h-auto xl:max-h-max xl:flex-row">
              {membersParsed?.map((user) => (
                <div key={user.id} className="flex items-center gap-1">
                  <HoverCard>
                    <HoverCardTrigger className="cursor-pointer">
                      <div className="from-teal to-violet relative size-[55px] overflow-hidden rounded-full bg-gradient-to-b bg-cover object-cover p-[2px]">
                        <Image
                          alt={`${user.first_name} ${user.last_name}`}
                          src={user.image_url || DEFAULT_AVATAR}
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
                      <p className="text-base font-semibold capitalize">{`${user.first_name} ${user.last_name}`}</p>
                      <p className="text-xs text-gray-500">{user.position}</p>
                    </HoverCardContent>
                  </HoverCard>
                  <div className="ml-2 xl:hidden">
                    <p className="text-sm font-semibold capitalize">{`${user.first_name} ${user.last_name}`}</p>
                    <p className="text-xs text-gray-500">{user.position}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
