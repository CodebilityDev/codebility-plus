import { useState } from "react";
import { ApplicantsList_Types } from "@/app/home/applicants/_types/applicants";
import { approveAction, rejectAction } from "@/app/home/applicants/action";
import { useModal } from "@/hooks/use-modal-applicants";
import toast from "react-hot-toast";

const ApplicantsApprovalButtons = ({
  applicant,
}: {
  applicant: ApplicantsList_Types;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { onOpen } = useModal();

  const handleAccept = async (id: string) => {
    setIsLoading(true);
    const { success, error } = await approveAction(id);

    if (!success) {
      setIsLoading(false);
      console.error("accept applicant error", error);

      return toast.error("Something went wrong");
    }
    setIsLoading(false);
    return toast.success("Applicant has been accepted");
  };

  const handleDeny = async (id: string) => {
    setIsLoading(true);
    const { success, error } = await rejectAction(id);

    if (!success) {
      setIsLoading(false);
      console.error("deny applicant error", error);
      return toast.error("Something went wrong");
    }

    setIsLoading(false);
    return toast.success("Applicant has been denied");
  };

  return (
    <>
      <span
        className="h-max w-max cursor-pointer rounded-md bg-blue-100 px-4 py-1 text-white transition duration-300 hover:bg-blue-500"
        onClick={
          isLoading ? undefined : () => handleAccept(applicant.id as string)
        }
      >
        Accept
      </span>
      <span
        className="h-max w-max cursor-pointer rounded-md border border-none px-4 py-1 hover:underline"
        onClick={
          isLoading ? undefined : () => handleDeny(applicant.id as string)
        }
      >
        Deny
      </span>
      <span
        className="h-max w-max cursor-pointer rounded-md border border-none px-4 py-1 hover:underline"
        onClick={
          isLoading ? undefined : () => onOpen("applicantsEditModal", applicant)
        }
      >
        Edit
      </span>
    </>
  );
};

export default ApplicantsApprovalButtons;
