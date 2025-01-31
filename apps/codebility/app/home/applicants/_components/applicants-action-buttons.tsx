import { useState } from "react";
import { approveAction, rejectAction } from "@/app/home/applicants/action";
import { useModal } from "@/hooks/use-modal-applicants";
import { Codev } from "@/types/home/codev"; // Ensure this matches your schema

import { Edit2 } from "lucide-react";
import toast from "react-hot-toast";

const ApplicantsApprovalButtons = ({ applicant }: { applicant: Codev }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { onOpen } = useModal();

  const handleAccept = async (id: string) => {
    setIsLoading(true);
    try {
      const { success, error } = await approveAction(id);
      if (!success) {
        console.error("Error accepting applicant:", error);
        toast.error("Something went wrong while accepting the applicant.");
      } else {
        toast.success("Applicant has been successfully accepted.");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeny = async (id: string) => {
    setIsLoading(true);
    try {
      const { success, error } = await rejectAction(id);
      if (!success) {
        console.error("Error rejecting applicant:", error);
        toast.error("Something went wrong while rejecting the applicant.");
      } else {
        toast.success("Applicant has been successfully rejected.");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        className={`h-max w-max cursor-pointer rounded-md px-4 py-1 text-white transition duration-300 ${
          isLoading ? "bg-gray-300" : "bg-blue-500 hover:bg-blue-600"
        }`}
        disabled={isLoading}
        onClick={() => handleAccept(applicant.id)}
      >
        {isLoading ? "Processing..." : "Accept"}
      </button>
      <button
        className={`h-max w-max cursor-pointer rounded-md border border-red-600 px-4 py-1 text-red-600 transition duration-300 ${
          isLoading ? "opacity-50" : "hover:bg-red-600 hover:text-white"
        }`}
        disabled={isLoading}
        onClick={() => handleDeny(applicant.id)}
      >
        {isLoading ? "Processing..." : "Deny"}
      </button>
      <button
        className="h-max w-max cursor-pointer rounded-md p-2 text-gray-700 transition duration-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        onClick={() => onOpen("applicantsEditModal", applicant)}
      >
        <Edit2 className="h-5 w-5" />
      </button>
    </div>
  );
};

export default ApplicantsApprovalButtons;
