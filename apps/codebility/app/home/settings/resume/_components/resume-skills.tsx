/* eslint-disable no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Box } from "@/Components/shared/dashboard";
import { Button } from "@/Components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { useTechStackStore } from "@/hooks/use-techstack";
import { IconEdit } from "@/public/assets/svgs";
import toast from "react-hot-toast";

import { Profile_Types } from "../_types/resume";
import { updateProfile } from "../action";

type Skills_Prop = {
  data: Profile_Types;
};

const Skills = ({ data }: Skills_Prop) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading] = useState(false);
  const { onOpen } = useModal();
  const { stack, setStack } = useTechStackStore();
  useEffect(() => {
    if (data?.tech_stacks) {
      setStack(data.tech_stacks.map((stack: string) => stack.toLowerCase()));
    }
  }, [data, setStack]);
  const handleEditMode = () => {
    setIsEditMode(true);
    onOpen("techStackModal");
  };

  const handleCancel = async () => {
    try {
      if (data?.tech_stacks) {
        setStack(data.tech_stacks.map((stack: string) => stack.toLowerCase()));
      } else {
        setStack([]);
      }
      setIsEditMode(false);
    } catch (error) {
      toast.error("Failed to update your tech stack");
    }
  };

  const handleSave = () => {
    const toastId = toast.loading("Your tech stack was being updated");
    updateProfile({ tech_stacks: stack });
    setIsEditMode(false);
    toast.success("Successfully updated your tech stacks!", { id: toastId });
  };
  return (
    <Box className="bg-light-900 dark:bg-dark-100 relative">
      <IconEdit
        className="w-15 h-15 absolute right-6 top-6 cursor-pointer invert dark:invert-0"
        onClick={handleEditMode}
      />
      <p className="text-lg">Skills</p>
      <div className="mt-4 flex w-full flex-wrap items-center justify-start gap-2">
        {stack &&
          stack.map((item: any, i: any) => (
            <div key={i} className="flex items-center">
              {item && (
                <Image
                  src={`/assets/svgs/icon-${item.toLowerCase()}.svg`}
                  alt={`${item} icon`}
                  width={40}
                  height={40}
                  title={item}
                  className="h-[40px] w-[40px] transition duration-300 hover:-translate-y-0.5"
                />
              )}
            </div>
          ))}
      </div>
      {isEditMode ? (
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="hollow" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="default"
            type="submit"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      ) : null}
    </Box>
  );
};

export default Skills;
