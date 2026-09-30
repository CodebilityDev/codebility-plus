"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Box from "@/components/global/layout/Box";
import { Button } from "@/components/global/ui/button";

import type { WorkExperience } from "@/types/global/codev";
import toast from "react-hot-toast";




import { deleteWorkExperience } from "@/actions/applicant/profile/applicant-profile";
import { ExperienceForm } from "@/components/applicant/profile/ExperienceForm";
import type { ExperienceProps, EditModePerItem } from "@/types/applicant/profile/profile";


const Experience = ({ data, codevId, earnedCategories }: ExperienceProps) => {
  const [experienceData, setExperienceData] = useState<WorkExperience[]>(data);
  const [isLoadingMain, setIsLoadingMain] = useState(false);
  const editModePerItem = useRef<EditModePerItem>({});

  const hasPoints = earnedCategories.some((category) => category === "work_experience");

  const handleUpdateExperience = (
    itemNo: number,
    name: string,
    value: string | boolean,
  ) => {
    const updatedExperiences = experienceData.map((item, id) =>
      id === itemNo ? { ...item, [name]: value } : item,
    );
    setExperienceData(updatedExperiences);
  };

  const handleDeleteExperience = async (itemNo: number, id: string) => {
    try {
      setIsLoadingMain(true);
      if (id) {
        await deleteWorkExperience(id);
      }
      const updatedExperiences = experienceData.filter(
        (_, id) => id !== itemNo,
      );
      setExperienceData(updatedExperiences);

      editModePerItem.current[itemNo] = false;
      toast.success("Work Experience deleted successfully");
    } catch (error) {
      toast.error("Something went wrong while deleting");
    } finally {
      setIsLoadingMain(false);
    }
  };

  const handleEditModePerItem = useCallback(
    (itemNo: number, editable: boolean) => {
      editModePerItem.current[itemNo] = editable;
    },
    [],
  );

  const canAddNew = useCallback(() => {
    const experienceLast = experienceData[experienceData.length - 1];
    const hasEditMode = Object.values(editModePerItem.current).some(
      (value) => value,
    );

    if (hasEditMode) {
      toast.error("Please save your changes first");
      return false;
    }

    return true;
  }, [experienceData]);

  // Check if there are no experiences or all are empty
  const hasNoExperience = experienceData.length === 0;

  // Show message only if: no experiences added AND hasn't earned points yet
  const shouldShowMessage = hasNoExperience && !hasPoints;

  return (
    <Box className="bg-light-900 dark:bg-dark-100 relative flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-lg">Experience</p>

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
              Add your work experiences to earn points
            </span>
        )}
      </div>

      <Button
        onClick={() => {
          if (canAddNew()) {
            setExperienceData((prev) => [
              ...prev,
              {
                id: "",
                codev_id: "",
                position: "",
                description: "",
                date_from: "",
                date_to: null,
                company_name: "",
                location: "",
                profile_id: undefined,
                is_present: false,
              },
            ]);
          }
        }}
        variant="outline"
        className="w-[10rem] border border-black px-[20px] py-6 text-black transition-colors hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
      >
        Add Experience
      </Button>

      {experienceData?.map((item, index) => (
        <ExperienceForm
          key={item.id || index}
          handleUpdateExperience={handleUpdateExperience}
          itemNo={index}
          experience={item}
          totalNo={experienceData.length}
          editModePerItem={editModePerItem}
          handleEditModePerItem={handleEditModePerItem}
          handleDeleteExperience={handleDeleteExperience}
          isLoadingMain={isLoadingMain}
        />
      ))}
    </Box>
  );
};

export default Experience;