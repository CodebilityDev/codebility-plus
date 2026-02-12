import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@codevs/ui/checkbox";
import { ApplicantType } from "../_service/type";
import { applicantUpdateJoinedStatus } from "../_service/action";

export default function ApplicantStep3({
  setActiveStep,
  user,
  applicantData,
}: {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  user: any;
  applicantData: ApplicantType;
}) {
  const [joinedDiscord, setJoinedDiscord] = useState(applicantData.joined_discord);
  const [joinedMessenger, setJoinedMessenger] = useState(applicantData.joined_messenger);
  const [isUpdating, setIsUpdating] = useState(false);
  const isOnboarding = user.application_status === "onboarding";
  const router = useRouter();

  const handleTakeTest = () => {
    setActiveStep(1);
  };

  const handleDiscordChange = async (checked: boolean) => {
    setIsUpdating(true);
    try {
      await applicantUpdateJoinedStatus({
        applicantId: applicantData.id,
        joinedDiscord: checked,
      });
      setJoinedDiscord(checked);
    } catch (error) {
      console.error("Error updating Discord status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMessengerChange = async (checked: boolean) => {
    setIsUpdating(true);
    try {
      await applicantUpdateJoinedStatus({
        applicantId: applicantData.id,
        joinedMessenger: checked,
      });
      setJoinedMessenger(checked);
    } catch (error) {
      console.error("Error updating Messenger status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStartOnboarding = () => {
    router.push("/applicant/onboarding");
  };

  return (
    <div className="my-20 flex flex-col items-center gap-8 text-center lg:gap-10">
      <div className="flex flex-col items-center gap-4">
        <p className="mb-2 text-lg md:text-lg lg:text-2xl">
          Congratulations for passing the test!
        </p>

        {!isOnboarding && (
          <p className="text-gray mx-auto text-xs md:text-lg lg:max-w-[500px] lg:text-lg">
            Congratulations {user.first_name}, You have successfully completed the
            test. For now join the Waiting List in order to get updates on your
            application status.
          </p>
        )}

        {isOnboarding && (
          <p className="text-gray mx-auto text-xs md:text-lg lg:max-w-[500px] lg:text-lg">
            Congratulations {user.first_name}, You have successfully completed the
            test and are now in the onboarding process.
          </p>
        )}

        <div className="text-gray mx-auto flex flex-col gap-2 text-xs md:text-lg lg:max-w-[500px] lg:text-lg">
          <p>Join our community and stay connected:</p>
          <ul className="list-inside list-disc space-y-1">
            <li>Join our Discord server</li>
            <li>Follow us on <Link href="https://www.linkedin.com/company/codebilitytech" target="_blank" className="text-blue-500 underline hover:text-blue-600">LinkedIn</Link></li>
            <li>Like our <Link href="https://www.facebook.com/Codebilitydev" target="_blank" className="text-blue-500 underline hover:text-blue-600">Facebook page</Link></li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-8 sm:flex-row sm:gap-6">
        {/* Messenger Section - Only show when not onboarding */}
        {!isOnboarding && (
          <div className="flex flex-col items-center gap-5">
            {!joinedMessenger && ( 
              <Link
                href={process.env.NEXT_PUBLIC_MESSENGER_WAITLIST || ""}
                target="_blank"
              >
                <Button className="from-customTeal to-customViolet-100 h-10  rounded-full bg-gradient-to-r via-customBlue-100 p-0.5 hover:bg-gradient-to-br xl:h-12">
                  <span className="bg-black-100 flex h-full w-full items-center justify-center rounded-full px-4 text-lg text-white lg:text-lg">
                    Join Waiting List
                  </span>
                </Button>
              </Link>
            )}

            <div className="flex items-center gap-3 p-3">
              <Checkbox
                id="joined-messenger"
                checked={joinedMessenger}
                onCheckedChange={handleMessengerChange}
                disabled={isUpdating}
                className="h-5 w-5"
              />
              <label
                htmlFor="joined-messenger"
                className="text-base text-gray-200 cursor-pointer font-medium"
              >
                I have joined the waiting list
              </label>
            </div>
          </div>
        )}

        {/* Discord Section */}
        <div className="flex flex-col items-center gap-5">
          {!joinedDiscord && (
            <Link href={process.env.NEXT_PUBLIC_DISCORD_LINK || ""} target="_blank">
              <Button className="from-customTeal to-customViolet-100 h-10  rounded-full bg-gradient-to-r via-customBlue-100 p-0.5 hover:bg-gradient-to-br xl:h-12">
                <span className="bg-black-100 flex h-full w-full items-center justify-center rounded-full px-4 text-lg text-white lg:text-lg">
                  Join Discord Server
                </span>
              </Button>
            </Link>
          )}
          
          <div className="flex items-center gap-3 p-3">
            <Checkbox
              id="joined-discord"
              checked={joinedDiscord}
              onCheckedChange={handleDiscordChange}
              disabled={isUpdating}
              className="h-5 w-5"
            />
            <label
              htmlFor="joined-discord"
              className="text-base text-gray-200 cursor-pointer font-medium"
            >
              I have joined Discord
            </label>
          </div>
        </div>
      </div>

      {/* Start Onboarding Button - Only show when onboarding */}
      {isOnboarding && (
        <div className="mt-8 flex flex-col items-center gap-4">
          <Button
            onClick={handleStartOnboarding}
            disabled={!joinedDiscord}
            className="from-customTeal to-customViolet-100 h-12 rounded-full bg-gradient-to-r via-customBlue-100 p-0.5 hover:bg-gradient-to-br disabled:opacity-50 xl:h-14"
          >
            <span className="bg-black-100 flex h-full w-full items-center justify-center rounded-full px-8 text-lg text-white lg:text-xl">
              Start Onboarding
            </span>
          </Button>
          {!joinedDiscord && (
            <p className="text-sm text-gray-500">
              Please join Discord and check the box above to start onboarding
            </p>
          )}
        </div>
      )}
    </div>
  );
}
