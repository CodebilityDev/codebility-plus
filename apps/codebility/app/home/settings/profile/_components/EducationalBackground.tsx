"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Box from "@/components/shared/dashboard/Box";
import { Button } from "@/components/ui/button";
import { IconDelete, IconEdit } from "@/public/assets/svgs";
import { Education } from "@/types/home/codev";
import toast from "react-hot-toast";

import { Input } from "@codevs/ui/input";
import { Textarea } from "@codevs/ui/textarea";

import {
  createEducation,
  deleteEducation,
  updateEducation,
} from "../action";

interface EducationProps {
  data: Education[];
  codevId?: string;
}

interface EditModePerItem {
  [key: string]: boolean;
}

interface EducationFormProps {
  education: Education;
  handleUpdateEducation: (
    itemNo: number,
    name: string,
    value: string | boolean,
  ) => void;
  itemNo: number;
  totalNo: number;
  editModePerItem: React.MutableRefObject<EditModePerItem>;
  handleEditModePerItem: (itemNo: number, editable: boolean) => void;
  handleDeleteEducation: (itemNo: number, id: string) => void;
  isLoadingMain: boolean;
}

const EducationalBackground = ({ data, codevId }: EducationProps) => {
  const [educationData, setEducationData] = useState<Education[]>(data);
  const [isLoadingMain, setIsLoadingMain] = useState(false);
  const [hasEducationPoints, setHasEducationPoints] = useState(false);
  const editModePerItem = useRef<EditModePerItem>({});

  // Check if user has earned points for education
  useEffect(() => {
    async function checkEducationPoints() {
      if (!codevId) return;

      try {
        const res = await fetch(`/api/profile-points/${codevId}`);
        if (res.ok) {
          const pointsData: { points?: { category: string; points: number }[] } = 
            await res.json() as { points?: { category: string; points: number }[] };
          
          const educationPoint = pointsData?.points?.find(
            (point) => point.category === 'education'
          );
          
          setHasEducationPoints(!!educationPoint && educationPoint.points > 0);
        }
      } catch (error) {
        console.error("Failed to check education points:", error);
      }
    }

    checkEducationPoints();
  }, [codevId, educationData.length]);

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
  const shouldShowMessage = hasNoEducation && !hasEducationPoints;

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
              } as Education,
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

const EducationForm = ({
  education,
  handleUpdateEducation,
  itemNo,
  totalNo,
  editModePerItem,
  handleEditModePerItem,
  handleDeleteEducation,
  isLoadingMain,
}: EducationFormProps) => {
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const isNewEmpty =
      totalNo === itemNo + 1 &&
      !education.institution &&
      !education.degree &&
      !education.major_subject &&
      !education.description &&
      !education.achievements &&
      !education.start_date &&
      !education.end_date;

    if (isNewEmpty) {
      handleEditModePerItem(itemNo, true);
      setEditMode(true);
    }
  }, [education, handleEditModePerItem, itemNo, totalNo]);

  useEffect(() => {
    setEditMode(editModePerItem.current[itemNo] ?? false);
  }, [editModePerItem, itemNo]);

  const handleSaveAndUpdate = async () => {
    // Check if at least one field is filled
    if (
      !education.institution &&
      !education.degree &&
      !education.major_subject &&
      !education.start_date &&
      !education.description &&
      !education.achievements
    ) {
      toast.error("Please fill at least one field");
      return;
    }

    const data = {
      institution: education.institution || null,
      degree: education.degree || null,
      major_subject: education.major_subject || null,
      description: education.description || null,
      achievements: education.achievements || null,
      start_date: education.start_date || null,
      end_date: education.end_date || null,
      codev_id: education.codev_id || undefined,
      profile_id: education.profile_id || undefined,
    };

    try {
      setIsLoading(true);
      if (!education.id) {
        const result = await createEducation(
          data as Omit<Education, "id" | "created_at" | "updated_at">,
        );
        if (result && result.length) {
          education.id = result[0].id;
        }
        toast.success("Education added successfully!");
      } else {
        await updateEducation(education.id, data);
        toast.success("Education updated successfully!");
      }
      handleEditModePerItem(itemNo, false);
      setEditMode(false);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dark:bg-dark-500 mt-8 flex w-full flex-col rounded-md bg-slate-50 px-[24px] py-[29px]">
      <div className="flex w-full items-end justify-end gap-2">
        <IconDelete
          onClick={() => {
            if (!isLoadingMain) {
              handleDeleteEducation(itemNo, education.id);
            }
          }}
          className="cursor-pointer text-red-500 invert dark:invert-0"
        />
        {!editMode && (
          <IconEdit
            onClick={() => {
              if (!isLoadingMain) {
                handleEditModePerItem(itemNo, true);
                setEditMode(true);
              }
            }}
            className="cursor-pointer invert dark:invert-0"
          />
        )}
      </div>

      <div className="w-full">
        <label>
          University/School Name (Optional)
          <Input
            onChange={(e) =>
              handleUpdateEducation(itemNo, e.target.name, e.target.value)
            }
            value={education.institution || ""}
            type="text"
            name="institution"
            variant={editMode ? "lightgray" : "darkgray"}
            className="rounded"
            disabled={!editMode || isLoading}
          />
        </label>
      </div>

      <div className="mt-4 w-full">
        <label>Degree (Optional)</label>
        <Input
          onChange={(e) =>
            handleUpdateEducation(itemNo, e.target.name, e.target.value)
          }
          value={education.degree || ""}
          type="text"
          name="degree"
          placeholder="e.g., Bachelor of Science, Master of Arts"
          variant={editMode ? "lightgray" : "darkgray"}
          className="rounded"
          disabled={!editMode || isLoading}
        />
      </div>

      <div className="mt-4 w-full">
        <label>Major Subject (Optional)</label>
        <Input
          onChange={(e) =>
            handleUpdateEducation(itemNo, e.target.name, e.target.value)
          }
          value={education.major_subject || ""}
          type="text"
          name="major_subject"
          placeholder="e.g., Computer Science, Business Administration"
          variant={editMode ? "lightgray" : "darkgray"}
          className="rounded"
          disabled={!editMode || isLoading}
        />
      </div>

      <div className="mt-4 w-full">
        <label>Description (Optional)</label>
        <Textarea
          variant="resume"
          onChange={(e) =>
            handleUpdateEducation(itemNo, e.target.name, e.target.value)
          }
          value={education.description || ""}
          name="description"
          placeholder="Brief description of your studies or coursework"
          className={`rounded transition-colors ${
            editMode
              ? "dark:bg-dark-200 border-gray-300 bg-white text-black dark:border-zinc-600 dark:text-white"
              : "dark:bg-dark-300 border-gray-200 bg-gray-100 text-gray-500 dark:border-zinc-800 dark:text-gray-400"
          }`}
          disabled={!editMode || isLoading}
        />
      </div>

      <div className="mt-4 w-full">
        <label>Achievements (Optional)</label>
        <Textarea
          variant="resume"
          onChange={(e) =>
            handleUpdateEducation(itemNo, e.target.name, e.target.value)
          }
          value={education.achievements || ""}
          name="achievements"
          placeholder="e.g., Dean's List, Cum Laude, Academic Awards, Honors"
          className={`rounded transition-colors ${
            editMode
              ? "dark:bg-dark-200 border-gray-300 bg-white text-black dark:border-zinc-600 dark:text-white"
              : "dark:bg-dark-300 border-gray-200 bg-gray-100 text-gray-500 dark:border-zinc-800 dark:text-gray-400"
          }`}
          disabled={!editMode || isLoading}
        />
      </div>

      <div className="mt-4 flex w-full flex-col gap-8 lg:flex-row">
        <label className="flex-1">
          Start Date (Optional)
          <Input
            onChange={(e) =>
              handleUpdateEducation(itemNo, e.target.name, e.target.value)
            }
            value={education.start_date || ""}
            type="date"
            name="start_date"
            variant={editMode ? "lightgray" : "darkgray"}
            className="rounded"
            disabled={!editMode || isLoading}
          />
        </label>
        <label className="flex-1">
          End Date (Optional)
          <Input
            onChange={(e) =>
              handleUpdateEducation(itemNo, e.target.name, e.target.value)
            }
            value={education.end_date || ""}
            type="date"
            name="end_date"
            variant={editMode ? "lightgray" : "darkgray"}
            className="rounded"
            disabled={!editMode || isLoading}
          />
        </label>
      </div>

      {editMode && (
        <div className="mt-6 flex flex-col-reverse items-center justify-center gap-2 md:flex-row md:justify-end">
          <Button
            onClick={() => {
              if (
                !education.institution &&
                !education.degree &&
                !education.major_subject &&
                !education.description &&
                !education.achievements &&
                !education.start_date &&
                !education.end_date
              ) {
                handleDeleteEducation(itemNo, education.id);
              } else {
                handleEditModePerItem(itemNo, false);
                setEditMode(false);
              }
            }}
            variant="outline"
            className="border-black-100 text-black-100 w-[10rem] px-[20px] py-6 dark:border-white dark:text-white"
            disabled={isLoading || isLoadingMain}
          >
            Cancel
          </Button>
          <Button
            disabled={isLoading || isLoadingMain}
            onClick={handleSaveAndUpdate}
            variant="default"
            className="w-[10rem] px-[20px] py-6"
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EducationalBackground;