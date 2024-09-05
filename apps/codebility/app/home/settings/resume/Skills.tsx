import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Box } from "@/Components/shared/dashboard";
import { Button } from "@/Components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { useTechStackStore } from "@/hooks/use-techstack";
import { IconEdit } from "@/public/assets/svgs";
import { resume_SkillsT } from "@/types/protectedroutes";

const Skills = ({ tech_stacks, updateProfile }: resume_SkillsT) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading] = useState(false);

  const { onOpen } = useModal();
  const { stack, setStack } = useTechStackStore();

  useEffect(() => {
    setStack(tech_stacks.map((stack) => stack.toLowerCase()));
  }, [tech_stacks, setStack]);

  const handleEditMode = () => {
    setIsEditMode(true);
    onOpen("techStackModal");
  };

  const handleCancel = () => {
    setStack(tech_stacks.map((stack) => stack.toLowerCase()));
    setIsEditMode(false);
  };

  const handleSave = () => {
    updateProfile({ tech_stacks: stack });
    setIsEditMode(false);
  };

  return (
    <Box className="bg-light-900 dark:bg-dark-100 relative">
      <IconEdit
        className="w-15 h-15 absolute right-6 top-6 cursor-pointer invert dark:invert-0"
        onClick={handleEditMode}
      />
      <p className="text-lg">Skills</p>
      <div className="mt-4 flex h-full w-full flex-wrap items-center justify-start gap-2">
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
