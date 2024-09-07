import { approveAction, rejectAction } from "@/app/home/applicants/action"
import { useModal } from "@/hooks/use-modal-applicants";
import { useState } from "react";
import toast from "react-hot-toast"

const ApplicantsApprovalButtons = ({ email_address }: { email_address: string }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { onOpen } = useModal()
    const handleAccept = async (email_address: string) => {
        setIsLoading(true);
        const { success, error } = await approveAction(email_address);


        if (!success) {
            setIsLoading(false);
            console.error("accept applicant error", error);

            return toast.error("Something went wrong");

        }
        setIsLoading(false);
        return toast.success("Applicant has been accepted");
    };

    const handleDeny = async (email_address: string) => {
        setIsLoading(true);
        const { success, error } = await rejectAction(email_address);


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
                className="cursor-pointer h-max w-max rounded-md bg-blue-100 px-4 py-1 text-white transition duration-300 hover:bg-blue-500"
                onClick={isLoading ? undefined : () => handleAccept(email_address as string)}
            >
                Accept
            </span>
            <span
                className="cursor-pointer h-max w-max rounded-md border border-none px-4 py-1 hover:underline"
                onClick={isLoading ? undefined : () => handleDeny(email_address as string)}
            >
                Deny
            </span>
            <span
                className="cursor-pointer h-max w-max rounded-md border border-none px-4 py-1 hover:underline"
                onClick={isLoading ? undefined : () => onOpen("applicantsEditModal")}
            >
                Edit
            </span >
        </>
    );
};

export default ApplicantsApprovalButtons;

