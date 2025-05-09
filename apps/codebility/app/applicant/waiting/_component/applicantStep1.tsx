import React from "react";
import Link from "next/link";
import Logo from "@/Components/shared/Logo";
import { Button } from "@/Components/ui/button";

export default function ApplicantStep1({
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
          Take the test to procced to the next step
        </p>
        <p className="text-gray mx-auto text-xs md:text-lg lg:max-w-[500px] lg:text-lg">
          Hello {user.first_name}, thank you for applying to Codebility. We&apos;re
          excited to move forward with your application and would like to invite
          you to complete our coding assessment.
        </p>
      </div>

      <div className="flex gap-4">
        <Button
          className="from-teal to-violet h-10 w-32 rounded-full bg-gradient-to-r via-blue-100 p-0.5 hover:bg-gradient-to-br xl:h-12 xl:w-36"
          onClick={handleTakeTest}
        >
          <span className="bg-black-100 flex h-full w-full items-center justify-center rounded-full text-lg text-white lg:text-lg">
            Take Test
          </span>
        </Button>
      </div>
    </div>
  );
}
