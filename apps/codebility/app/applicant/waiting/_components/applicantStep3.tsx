import React, { useState } from "react";
import Link from "next/link";
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

      <div className="flex flex-col gap-8 sm:flex-row sm:gap-6">
        {/* Messenger Section */}
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
              I have joined Discord and sent the message
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
