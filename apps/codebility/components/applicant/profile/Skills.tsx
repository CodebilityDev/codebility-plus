"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Box from "@/components/global/layout/Box";
import { Button } from "@/components/global/ui/button";
import { useModal } from "@/hooks/global/use-modal";
import { useTechStackStore } from "@/hooks/global/use-techstack";
import { IconEdit } from "@/public/assets/svgs/index";
import toast from "react-hot-toast";

import { updateCodev } from "@/actions/applicant/profile/applicant-profile";
import { TECH_STACK_MAPPING } from "@/constants/applicant/profile/profile";
import type { SkillsProps, TechStackStore } from "@/types/applicant/profile/profile";


const Skills = ({ data, earnedCategories }: SkillsProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { onOpen } = useModal();
  const hasPoints = earnedCategories.some((category) => ["tech_stacks"].includes(category));
  const { stack, setStack } = useTechStackStore() as TechStackStore;

  useEffect(() => {
    if (data?.tech_stacks?.length) {
      setStack(data.tech_stacks.map((stack) => stack.toLowerCase()));
    } else {
      setStack([]);
    }
  }, [data?.tech_stacks, setStack]);

  // Check if user has earned points for tech stacks

  const handleEditMode = () => {
    setIsEditMode(true);
    onOpen("techStackModal");
  };

  const handleCancel = () => {
    try {
      // Reset to original data
      if (data?.tech_stacks?.length) {
        setStack(data.tech_stacks.map((stack) => stack.toLowerCase()));
      } else {
        setStack([]);
      }
      setIsEditMode(false);
    } catch (error) {
      console.error("Error resetting tech stack:", error);
      toast.error("Failed to reset tech stack");
    }
  };

  const handleSave = async () => {
    const toastId = toast.loading("Updating your tech stack...");
    setIsLoading(true);

    try {
      await updateCodev({
        tech_stacks: stack,
        updated_at: new Date().toISOString(),
      });

      setIsEditMode(false);
      toast.success("Tech stack updated successfully!", { id: toastId });
    } catch (error) {
      console.error("Error updating tech stack:", error);
      toast.error("Failed to update tech stack", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  // Check if there are no skills added
  const hasNoSkills = !data?.tech_stacks || data.tech_stacks.length === 0;

  // Show message only if: no skills AND hasn't earned points yet
  const shouldShowMessage = hasNoSkills && !hasPoints;

  return (
    <Box className="bg-light-900 dark:bg-dark-100 relative">
      <div className="flex items-center justify-between">
        <p className="text-lg">Skills</p>

        <div className="flex items-center gap-2">
          {shouldShowMessage && (
            <span className="text-xs text-green-600 flex items-center gap-1">
              <svg 
                className="h-3 w-3" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                  clipRule="evenodd" 
                />
              </svg>
              Add all your skills to earn points
            </span>
          )}

          {!isEditMode && (
            <IconEdit
              className="h-15 w-15 cursor-pointer invert dark:invert-0"
              onClick={handleEditMode}
            />
          )}
        </div>
      </div>

      <div className="mt-4 flex w-full flex-wrap items-center justify-start gap-2">
        {stack?.map(
          (item, index) =>
            item && (
              <div key={`${item}-${index}`} className="flex items-center">
                <Image
                  src={`/assets/svgs/techstack/icon-${
                    TECH_STACK_MAPPING[item.toLowerCase()] || item.toLowerCase()
                  }.svg`}
                  alt={`${item} icon`}
                  width={40}
                  height={40}
                  title={item}
                  className="h-[40px] w-[40px] transition duration-300 hover:-translate-y-0.5"
                />
              </div>
            ),
        )}

        {(!stack || stack.length === 0) && (
          <p className="text-gray-500">No skills added yet</p>
        )}
      </div>

      {isEditMode && (
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="hollow" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      )}
    </Box>
  );
};

export default Skills;