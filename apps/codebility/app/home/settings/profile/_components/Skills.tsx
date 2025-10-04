"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Box } from "@/components/shared/dashboard";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { useTechStackStore } from "@/hooks/use-techstack";
import { IconEdit } from "@/public/assets/svgs";
import toast from "react-hot-toast";

import { updateCodev } from "../action";

type SkillsProps = {
  data: {
    id?: string;
    tech_stacks?: string[] | null;
    level?: Record<string, any> | null;
  };
};

type TechStackStore = {
  stack: string[];
  setStack: (stack: string[]) => void;
};

const Skills = ({ data }: SkillsProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasTechStackPoints, setHasTechStackPoints] = useState(false);
  const { onOpen } = useModal();
  const { stack, setStack } = useTechStackStore() as TechStackStore;

  useEffect(() => {
    if (data?.tech_stacks?.length) {
      setStack(data.tech_stacks.map((stack) => stack.toLowerCase()));
    } else {
      setStack([]);
    }
  }, [data?.tech_stacks, setStack]);

  // Check if user has earned points for tech stacks
  useEffect(() => {
    async function checkTechStackPoints() {
      if (!data.id) return;

      try {
        const res = await fetch(`/api/profile-points/${data.id}`);
        if (res.ok) {
          const pointsData: { points?: { category: string; points: number }[] } = 
            await res.json() as { points?: { category: string; points: number }[] };
          
          const techStackPoint = pointsData?.points?.find(
            (point) => point.category === 'tech_stacks'
          );
          
          setHasTechStackPoints(!!techStackPoint && techStackPoint.points > 0);
        }
      } catch (error) {
        console.error("Failed to check tech stack points:", error);
      }
    }

    checkTechStackPoints();
  }, [data.id, data.tech_stacks]);

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
  const shouldShowMessage = hasNoSkills && !hasTechStackPoints;

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
                  src={`/assets/svgs/icon-${item.toLowerCase()}.svg`}
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