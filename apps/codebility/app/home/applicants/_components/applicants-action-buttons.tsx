import { useState } from "react";

const ApplicantsActionButtons = ({ email_address }: { email_address: string }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleAccept = async (email_address: string) => {

    };

    const handleDeny = async (email_address: string) => {

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

export default ApplicantsActionButtons;

