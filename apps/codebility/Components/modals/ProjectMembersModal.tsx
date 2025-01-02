import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { DEFAULT_AVATAR } from "@/app/home/projects/_lib/constants";
import { Member, User } from "@/app/home/projects/_types/projects";
import { updateProjectMembers } from "@/app/home/projects/actions";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { useModal } from "@/hooks/use-modal-projects";
import toast from "react-hot-toast";

import { getSupabaseBrowserClient } from "@codevs/supabase/browser-client";

const ProjectMembersModal = () => {
  const supabase = getSupabaseBrowserClient();

  const { isOpen, type, onClose, data } = useModal();
  const isModalOpen = isOpen && type === "projectMembersModal";

  const [users, setUsers] = useState<User[] | any[] | null>([]);
  const parseMembers = (membersData: string[]): Member[] => {
    return membersData.map((member) => JSON.parse(member) as Member);
  };
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("codev")
        .select("*, user(*, profile(*))")
        .eq("application_status", "ACCEPTED");

      if (error) {
        if (error) throw error;
        console.error("Error fetching users:", error);
      } else {
        setUsers(data);
      }
    };

    if (isModalOpen) {
      fetchUsers();
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (data?.members) {
      const membersParsed = parseMembers(data.members);
      setSelectedMembers(membersParsed);
    }
  }, [data]);

  const team_leader =
    users?.filter((user) => user.id === data?.team_leader_id) || [];

  const handleDialogChange = () => {
    onClose();
  };

  const handleCheckboxChange = (memberId: string) => {
    if (selectedMembers.some((member) => member.id === memberId)) {
      setSelectedMembers((prevMembers) =>
        prevMembers.filter((member) => member.id !== memberId),
      );
    } else {
      const userToAdd = users?.find((user) => user.id === memberId);
      if (userToAdd) {
        const newMember: Member = {
          id: userToAdd.id,
          first_name: userToAdd.first_name,
          last_name: userToAdd.last_name,
          image_url: userToAdd.user.profile.image_url,
          position: userToAdd.main_position,
        };
        setSelectedMembers((prevMembers) => [...prevMembers, newMember]);
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!data?.id) return;

    setIsLoading(true);
    try {
      const response = await updateProjectMembers(data.id, selectedMembers);
      if (response.success) {
        toast.success("Project members updated succesfully!");
      } else {
        toast.error("Failed to update project members");
      }
    } catch (error) {
      console.error("Error updating project members:", error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleDialogChange}>
      <DialogContent
        aria-describedby={undefined}
        className="flex h-[32rem] w-[90%] max-w-4xl flex-col gap-5 overflow-y-auto lg:h-[44rem] lg:overflow-hidden"
      >
        <DialogHeader className="relative">
          <DialogTitle className="mb-2 text-left text-xl">
            Project Members
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="dark:bg-dark-200 flex flex-1 flex-col gap-2 rounded-lg p-4">
            <p className="text-md text-gray">Lead by: </p>
            {team_leader.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="relative h-8 w-8 rounded-full bg-cover object-cover">
                  <Image
                    alt={`${team_leader[0].first_name} ${team_leader[0].last_name} avatar`}
                    src={
                      team_leader[0].user.profile.image_url || DEFAULT_AVATAR
                    }
                    fill
                    title={`${team_leader[0].first_name} ${team_leader[0].last_name}`}
                    className="h-auto w-full rounded-full bg-cover object-cover"
                    loading="eager"
                  />
                </div>

                <span className="capitalize">
                  {team_leader[0].first_name} {team_leader[0].last_name}
                </span>
              </div>
            )}
          </div>
          <div className="dark:bg-dark-200 flex h-44 flex-col gap-2 overflow-auto rounded-lg p-4 md:h-52 lg:h-[25rem]">
            <p className="text-md text-gray">Members </p>
            {users?.map((member: User | any) => {
              const isChecked = selectedMembers.some((m) => m.id === member.id);
              return (
                <div key={member.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`member-${member.id}`}
                    checked={isChecked}
                    onChange={() => handleCheckboxChange(member.id)}
                  />
                  <label
                    htmlFor={`member-${member.id}`}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <div className="relative h-8 w-8 rounded-full bg-cover object-cover">
                      <Image
                        alt={`${member.first_name} ${member.last_name} avatar`}
                        src={member?.user?.profile?.image_url || DEFAULT_AVATAR}
                        fill
                        title={`${member.first_name} ${member.last_name}`}
                        className="h-auto w-full rounded-full bg-cover object-cover"
                        loading="eager"
                      />
                    </div>
                    <span className="capitalize">
                      {member.first_name} {member.last_name}
                    </span>
                  </label>
                </div>
              );
            })}
          </div>
          <DialogFooter className="flex flex-col gap-4 lg:flex-row">
            <Button
              type="submit"
              variant="default"
              className="w-full lg:w-[130px]"
              disabled={isLoading}
            >
              Save
            </Button>
            <Button
              type="button"
              variant="hollow"
              className="w-full lg:w-[130px]"
              onClick={handleDialogChange}
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectMembersModal;
