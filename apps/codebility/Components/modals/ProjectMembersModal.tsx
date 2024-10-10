import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { DEFAULT_AVATAR } from "@/app/home/projects/_lib/constants";
import { Member, User } from "@/app/home/projects/_types/projects";
import { updateProjectMembers } from "@/app/home/projects/actions";
import { Button } from "@/Components/ui/button";
import { useModal } from "@/hooks/use-modal-projects";
import toast from "react-hot-toast";

import { useSupabase } from "@codevs/supabase/hooks/use-supabase";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

const ProjectMembersModal = () => {
  const supabase = useSupabase();

  const { isOpen, type, onClose, data } = useModal();
  const isModalOpen = isOpen && type === "projectMembersModal";

  const [users, setUsers] = useState<User[]>([]);
  const [teamLead, setTeamLead] = useState<User[]>([]);
  const team_leader_id = data?.team_leader_id;
  const parseMembers = (membersData: string[]): Member[] => {
    return membersData.map((member) => JSON.parse(member) as Member);
  };
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [teamLeadLoading, setTeamLeadLoading] = useState(true);

  const getTeamLead = async () => {
    if (!team_leader_id) {
      console.log("Team leader ID is undefined");
      return;
    }

    setTeamLeadLoading(true);

    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .eq("id", team_leader_id)
      .single();

    if (error) {
      console.error("Error fetching team lead:", error);
    } else {
      setTeamLead(data ? [data] : []);
    }
    setTeamLeadLoading(false);
  };

  useEffect(() => {
    getTeamLead();
  }, [isOpen, team_leader_id]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("profile").select("*");

      if (error) {
        if (error) throw error;
        console.error("Error fetching users:", error);
      } else {
        setUsers(data);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (data?.members) {
      const membersParsed = parseMembers(data.members);
      setSelectedMembers(membersParsed);
    }
  }, [data]);

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
          image_url: userToAdd.image_url,
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
      <DialogContent className="flex h-[32rem] w-[90%] max-w-4xl flex-col gap-5 overflow-y-auto lg:h-[44rem] lg:overflow-hidden">
        <DialogHeader className="relative">
          <DialogTitle className="mb-2 text-left text-xl">
            Project Members
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="dark:bg-dark-200 flex flex-1 flex-col gap-2 rounded-lg p-4">
              <p className="text-md text-gray">Lead by: </p>
              <div className="flex items-center gap-2">
                <div className="relative h-8 w-8 rounded-full bg-cover object-cover">
                  <Image
                    alt={`${teamLead[0]?.first_name} ${teamLead[0]?.last_name} avatar`}
                    src={teamLead[0]?.image_url || DEFAULT_AVATAR}
                    fill
                    title={`${teamLead[0]?.first_name} ${teamLead[0]?.last_name}`}
                    className="h-auto w-full rounded-full bg-cover object-cover"
                    loading="eager"
                  />
                </div>
                {teamLead[0] && (
                  <span>
                    {teamLead[0].first_name} {teamLead[0].last_name}
                  </span>
                )}
              </div>
            </div>
            <div className="dark:bg-dark-200 flex h-44 flex-col gap-2 overflow-auto rounded-lg p-4 md:h-52 lg:h-[25rem]">
              <p className="text-md text-gray">Members </p>
              {users?.map((member: User) => {
                const isChecked = selectedMembers.some(
                  (m) => m.id === member.id,
                );
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
                          src={member.image_url || DEFAULT_AVATAR}
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
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectMembersModal;
