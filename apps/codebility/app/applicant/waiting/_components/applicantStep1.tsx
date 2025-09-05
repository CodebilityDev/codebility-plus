import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";

import { applicantMoveToOnboard } from "../_service/action";

export default function ApplicantStep1({
  setActiveStep,
  user,
}: {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  user: any;
}) {
  const [loading, setLoading] = React.useState(false);

  const prioRoles = ["QA Engineer", "Project Manager", "Admin", "Marketing"];

  const handleTakeTest = () => {
    setActiveStep(1);
  };

  const handleOnboard = async () => {
    setLoading(true);
    try {
      await applicantMoveToOnboard({
        codevId: user.id,
      });

      setActiveStep(2);
    } catch (error) {
      console.error("Error moving to onboarding:", error);
    }
    setLoading(false);
  };

  return (
    <div className="my-20 flex flex-col items-center gap-8 text-center lg:gap-10">
      <div className="flex flex-col items-center gap-4">
        {prioRoles.includes(user.display_position) ? (
          <p className="mb-2 text-lg md:text-lg lg:text-2xl">
            Click the onboard button to proceed to the next step
          </p>
        ) : (
          <p className="mb-2 text-lg md:text-lg lg:text-2xl">
            Take the test to procced to the next step
          </p>
        )}

        {/*  */}
        {prioRoles.includes(user.display_position) ? (
          <p className="text-gray mx-auto text-xs md:text-lg lg:max-w-[500px] lg:text-lg">
            {`Hello ${user.first_name}, thank you for applying to Codebility as a
            ${user.display_position}. We're excited to move forward with
            your application! As a ${user.display_position}, you are on our
            priority list and have the privilege to skip the assessment. Please
            click the onboard button to proceed to the next step.`}
          </p>
        ) : (
          <p className="text-gray mx-auto text-xs md:text-lg lg:max-w-[500px] lg:text-lg">
            Hello {user.first_name}, thank you for applying to Codebility.
            We&apos;re excited to move forward with your application and would
            like to invite you to complete our assessment.
          </p>
        )}
      </div>

      <div className="flex gap-4">
        {prioRoles.includes(user.display_position) ? (
          <Button
            className="from-customTeal to-customViolet-100 h-10 w-32 rounded-full bg-gradient-to-r via-customBlue-100 p-0.5 hover:bg-gradient-to-br xl:h-12 xl:w-36"
            onClick={handleOnboard}
            disabled={loading}
          >
            <span className="bg-black-100 flex h-full w-full items-center justify-center rounded-full text-lg text-white lg:text-lg">
              {loading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
              Onboard
            </span>
          </Button>
        ) : (
          <Button
            className="from-customTeal to-customViolet-100 h-10 w-32 rounded-full bg-gradient-to-r via-customBlue-100 p-0.5 hover:bg-gradient-to-br xl:h-12 xl:w-36"
            onClick={handleTakeTest}
          >
            <span className="bg-black-100 flex h-full w-full items-center justify-center rounded-full text-lg text-white lg:text-lg">
              Take Test
            </span>
          </Button>
        )}
      </div>
    </div>
  );
}
