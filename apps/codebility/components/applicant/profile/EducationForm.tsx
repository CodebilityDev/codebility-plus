"use client";

import { createEducation, updateEducation } from "@/actions/applicant/profile/applicant-profile";
import { Button } from "@/components/global/ui/button";
import { IconDelete, IconEdit } from "@/public/assets/svgs/index";
import type { EducationFormProps } from "@/types/applicant/profile/profile";
import type { Education } from "@/types/global/codev";
import { Input } from "@codevs/ui/input";
import { Textarea } from "@codevs/ui/textarea";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export const EducationForm = ({
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
