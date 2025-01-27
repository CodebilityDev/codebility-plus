import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { getMembers, updateProjectMembers } from "@/app/home/projects/actions";
import DefaultAvatar from "@/Components/DefaultAvatar";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { useModal } from "@/hooks/use-modal-projects";
import { Codev } from "@/types/home/codev";
import toast from "react-hot-toast";

const ProjectMembersModal = () => {
  const { isOpen, type, onClose, data } = useModal();
  const isModalOpen = isOpen && type === "projectMembersModal";

  const [users, setUsers] = useState<Codev[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<Codev[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsersAndMembers = async () => {
      try {
        const membersResponse = data?.members
          ? await getMembers(data.members)
          : { data: [], error: null };
        const { data: fetchedMembers, error: membersError } = membersResponse;

        if (membersError) throw new Error(membersError);

        setSelectedMembers(fetchedMembers || []);
      } catch (error) {
        console.error("Failed to fetch members:", error);
        toast.error("Error fetching project members.");
      }
    };

    if (isModalOpen) {
      fetchUsersAndMembers();
    }
  }, [isModalOpen, data?.members]);

  const teamLeader = users.find((user) => user.id === data?.team_leader_id);

  const handleDialogChange = () => {
    onClose();
  };

  const handleCheckboxChange = (memberId: string) => {
    setSelectedMembers((prevMembers) =>
      prevMembers.some((member) => member.id === memberId)
        ? prevMembers.filter((member) => member.id !== memberId)
        : [...prevMembers, users.find((user) => user.id === memberId)!],
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!data?.id) {
      toast.error("Project ID is missing. Cannot update members.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await updateProjectMembers(data.id, selectedMembers);
      if (response.success) {
        toast.success("Project members updated successfully!");
        onClose();
      } else {
        toast.error(response.error || "Failed to update project members.");
      }
    } catch (error) {
      console.error("Error updating project members:", error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleDialogChange}>
      <DialogContent
        aria-describedby={undefined}
        className="flex h-[32rem] w-[90%] max-w-4xl flex-col gap-5 overflow-y-auto lg:h-[44rem] lg:overflow-hidden"
      >
        <DialogHeader>
          <DialogTitle className="mb-2 text-left text-xl">
            Project Members
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="dark:bg-dark-200 flex flex-1 flex-col gap-2 rounded-lg p-4">
            <p className="text-md text-gray">Lead by:</p>
            {teamLeader && (
              <div className="flex items-center gap-2">
                {teamLeader.image_url ? (
                  <div className="relative size-[32px] overflow-hidden rounded-full">
                    <Image
                      src={teamLeader.image_url}
                      alt={`${teamLeader.first_name} ${teamLeader.last_name}`}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <DefaultAvatar size={32} className="rounded-full" />
                )}
                <span className="capitalize">
                  {teamLeader.first_name} {teamLeader.last_name}
                </span>
              </div>
            )}
          </div>
          <div className="dark:bg-dark-200 flex h-44 flex-col gap-2 overflow-auto rounded-lg p-4 md:h-52 lg:h-[25rem]">
            <p className="text-md text-gray">Members</p>
            {users.map((user) => {
              const isChecked = selectedMembers.some((m) => m.id === user.id);
              return (
                <div key={user.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`member-${user.id}`}
                    checked={isChecked}
                    onChange={() => handleCheckboxChange(user.id)}
                  />
                  <label
                    htmlFor={`member-${user.id}`}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    {user.image_url ? (
                      <div className="relative size-[32px] overflow-hidden rounded-full">
                        <Image
                          src={user.image_url}
                          alt={`${user.first_name} ${user.last_name}`}
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                        />
                      </div>
                    ) : (
                      <DefaultAvatar size={32} className="rounded-full" />
                    )}
                    <span className="capitalize">
                      {user.first_name} {user.last_name}
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
              {isLoading ? "Saving..." : "Save"}
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
