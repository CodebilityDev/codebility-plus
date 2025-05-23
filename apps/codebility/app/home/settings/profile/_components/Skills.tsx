"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Box } from "@/Components/shared/dashboard";
import { Button } from "@/Components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { useTechStackStore } from "@/hooks/use-techstack";
import { IconEdit } from "@/public/assets/svgs";
import toast from "react-hot-toast";

import { updateCodev } from "../action";

type SkillsProps = {
  data: {
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
  const { onOpen } = useModal();
  const { stack, setStack } = useTechStackStore() as TechStackStore;

  useEffect(() => {
    if (data?.tech_stacks?.length) {
      setStack(data.tech_stacks.map((stack) => stack.toLowerCase()));
    } else {
      setStack([]);
    }
  }, [data?.tech_stacks, setStack]);

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

  return (
    <Box className="bg-light-900 dark:bg-dark-100 relative">
      {!isEditMode && (
        <Image
          src={IconEdit}
          alt="Edit"
          className="h-15 w-15 absolute right-6 top-6 cursor-pointer invert dark:invert-0"
          onClick={handleEditMode}
        />
      )}
      <p className="text-lg">Skills</p>

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
