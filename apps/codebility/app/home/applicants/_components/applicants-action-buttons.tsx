import { approveAction, rejectAction } from "@/app/home/applicants/action"
import { useState } from "react";
import toast from "react-hot-toast"

const ApplicantsApprovalButtons = ({ email_address }: { email_address: string }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleAccept = async (email_address: string) => {
        setIsLoading(true);
        const { success, error } = await approveAction(email_address);
        setIsLoading(false);

        if (!success) {
            console.error("accept applicant error", error);
            return toast.error("Something went wrong");
        }

        return toast.success("Applicant has been accepted");
    };

    const handleDeny = async (email_address: string) => {
        setIsLoading(true);
        const { success, error } = await rejectAction(email_address);
        setIsLoading(false);

        if (!success) {
            console.error("deny applicant error", error);
            return toast.error("Something went wrong");
        }

        return toast.success("Applicant has been denied");
    };

    return (
        <>
            <button
                className="h-max w-max rounded-md bg-blue-100 px-4 py-1 text-white transition duration-300 hover:bg-blue-500"
                onClick={() => handleAccept(email_address as string)}
                disabled={isLoading}
            >
                Accept
            </button>
            <button
                className="h-max w-max rounded-md border border-none px-4 py-1 hover:underline"
                onClick={() => handleDeny(email_address as string)}
                disabled={isLoading}
            >
                Deny
            </button>
        </>
    );
};

export default ApplicantsApprovalButtons;

