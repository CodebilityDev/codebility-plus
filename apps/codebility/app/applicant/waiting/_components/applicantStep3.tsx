import React from "react";
import Link from "next/link";
import Logo from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";

export default function ApplicantStep3({
  setActiveStep,
  user,
}: {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  user: any;
}) {
  const handleTakeTest = () => {
    setActiveStep(1);
  };

  return (
    <div className="my-20 flex flex-col items-center gap-8 text-center lg:gap-10">
      <div className="flex flex-col items-center gap-4">
        <p className="mb-2 text-lg md:text-lg lg:text-2xl">
          Congratulations for passing the test!
        </p>

        <p className="text-gray mx-auto text-xs md:text-lg lg:max-w-[500px] lg:text-lg">
          Congratulations {user.first_name}, You have successfully completed the
          test. For now join the Waiting List in order to get updates on your
          application status.
        </p>

        <p className="text-gray mx-auto text-xs md:text-lg lg:max-w-[500px] lg:text-lg">
          Join also our Discord server. Once you joined, check the #lobby and
          messege us your
          <span className="block">
            full-name - position - years of exp - Onboarding
          </span>
          <span className="block">
            i.e. Juan Dela Cruz - Frontend - 2.4 - Onboarding
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-6 sm:flex-row sm:gap-4">
        <Link
          href={process.env.NEXT_PUBLIC_MESSENGER_WAITLIST || ""}
          target="_blank"
        >
          <Button className="from-customTeal to-violet h-10  rounded-full bg-gradient-to-r via-blue-100 p-0.5 hover:bg-gradient-to-br xl:h-12">
            <span className="bg-black-100 flex h-full w-full items-center justify-center rounded-full px-4 text-lg text-white lg:text-lg">
              Join Waiting List
            </span>
          </Button>
        </Link>

        <Link href={process.env.NEXT_PUBLIC_DISCORD_LINK || ""} target="_blank">
          <Button className="from-customTeal to-violet h-10  rounded-full bg-gradient-to-r via-blue-100 p-0.5 hover:bg-gradient-to-br xl:h-12">
            <span className="bg-black-100 flex h-full w-full items-center justify-center rounded-full px-4 text-lg text-white lg:text-lg">
              Join Discord Server
            </span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
