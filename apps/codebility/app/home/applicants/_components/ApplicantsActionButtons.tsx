import { useState } from "react";
import { approveAction, rejectAction } from "@/app/home/applicants/action";
import { useModal } from "@/hooks/use-modal-applicants";
import { Codev } from "@/types/home/codev";
import { Edit2 } from "lucide-react";
import toast from "react-hot-toast";

const ApplicantsApprovalButtons = ({ applicant }: { applicant: Codev }) => {
  const [isAcceptLoading, setIsAcceptLoading] = useState(false);
  const [isDenyLoading, setIsDenyLoading] = useState(false);
  const { onOpen } = useModal();

  const handleAccept = async (id: string) => {
    setIsAcceptLoading(true);
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
      setIsAcceptLoading(false);
    }
  };

  const handleDeny = async (id: string) => {
    setIsDenyLoading(true);
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
      setIsDenyLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        className={`rounded-md px-3 py-1 text-sm font-medium text-white transition-all 
         ${
           isAcceptLoading
             ? "cursor-not-allowed bg-gray-400"
             : "bg-indigo-500 hover:bg-indigo-600 hover:shadow-md active:scale-95"
         }`}
        disabled={isAcceptLoading || isDenyLoading}
        onClick={() => handleAccept(applicant.id)}
      >
        {isAcceptLoading ? "..." : "Accept"}
      </button>

      <button
        className={`rounded-md px-3 py-1 text-sm font-medium transition-all
         ${
           isDenyLoading
             ? "cursor-not-allowed border-gray-400 text-gray-400"
             : "border border-red-500 text-red-500 hover:bg-red-50 hover:shadow-md active:scale-95"
         }`}
        disabled={isAcceptLoading || isDenyLoading}
        onClick={() => handleDeny(applicant.id)}
      >
        {isDenyLoading ? "..." : "Deny"}
      </button>

      <button
        className="rounded-md p-1.5 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700 active:scale-95"
        disabled={isAcceptLoading || isDenyLoading}
        onClick={() => onOpen("applicantsEditModal", applicant)}
      >
        <Edit2 className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ApplicantsApprovalButtons;
