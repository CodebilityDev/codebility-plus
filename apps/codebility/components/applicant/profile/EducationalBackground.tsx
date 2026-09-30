"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Box from "@/components/global/layout/Box";
import { Button } from "@/components/global/ui/button";

import type { Education } from "@/types/global/codev";
import toast from "react-hot-toast";




import { deleteEducation } from "@/actions/applicant/profile/applicant-profile";
import { EducationForm } from "@/components/applicant/profile/EducationForm";
import type { EducationProps, EditModePerItem } from "@/types/applicant/profile/profile";


const EducationalBackground = ({ data, codevId, earnedCategories }: EducationProps) => {
  const [educationData, setEducationData] = useState<Education[]>(data);
  const [isLoadingMain, setIsLoadingMain] = useState(false);
  const editModePerItem = useRef<EditModePerItem>({});

  const hasPoints = earnedCategories.some((category) => category === "education");

  const handleUpdateEducation = (
    itemNo: number,
    name: string,
    value: string | boolean,
  ) => {
    const updatedEducation = educationData.map((item, id) =>
      id === itemNo ? { ...item, [name]: value } : item,
    );
    setEducationData(updatedEducation);
  };

  const handleDeleteEducation = async (itemNo: number, id: string) => {
    try {
      setIsLoadingMain(true);
      if (id) {
        await deleteEducation(id);
      }
      const updatedEducation = educationData.filter(
        (_, id) => id !== itemNo,
      );
      setEducationData(updatedEducation);

      editModePerItem.current[itemNo] = false;
      toast.success("Education deleted successfully");
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
    const hasEditMode = Object.values(editModePerItem.current).some(
      (value) => value,
    );

    if (hasEditMode) {
      toast.error("Please save your changes first");
      return false;
    }

    return true;
  }, []);

  // Check if there are no education entries or all are empty
  const hasNoEducation = educationData.length === 0;

  // Show message only if: no education added AND hasn't earned points yet
  const shouldShowMessage = hasNoEducation && !hasPoints;

  return (
    <Box className="bg-light-900 dark:bg-dark-100 relative flex flex-col gap-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-lg">Educational Background</p>

        {shouldShowMessage && (
          <span className="text-xs text-green-600 flex items-center gap-1 whitespace-nowrap">
            <svg 
              className="h-3 w-3 flex-shrink-0" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                clipRule="evenodd" 
              />
            </svg>
            <span className="hidden sm:inline">Add your educational background to earn points</span>
            <span className="sm:hidden">Add education to earn points</span>
          </span>
        )}
      </div>

      <Button
        onClick={() => {
          if (canAddNew()) {
            setEducationData((prev) => [
              ...prev,
              {
                id: "",
                codev_id: "",
                institution: "",
                degree: "",
                major_subject: "",
                description: "",
                achievements: "",
                start_date: "",
                end_date: null,
                profile_id: undefined,
                created_at: "",
                updated_at: "",
              },
            ]);
          }
        }}
        variant="outline"
        className="w-[10rem] border border-black px-[20px] py-6 text-black transition-colors hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
      >
        Add Education
      </Button>

      {educationData?.map((item, index) => (
        <EducationForm
          key={item.id || index}
          handleUpdateEducation={handleUpdateEducation}
          itemNo={index}
          education={item}
          totalNo={educationData.length}
          editModePerItem={editModePerItem}
          handleEditModePerItem={handleEditModePerItem}
          handleDeleteEducation={handleDeleteEducation}
          isLoadingMain={isLoadingMain}
        />
      ))}
    </Box>
  );
};

export default EducationalBackground;