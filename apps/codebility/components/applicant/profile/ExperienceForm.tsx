"use client";

import { createWorkExperience, updateWorkExperience } from "@/actions/applicant/profile/applicant-profile";
import { Button } from "@/components/global/ui/button";
import { IconDelete, IconEdit } from "@/public/assets/svgs/index";
import type { ExperienceFormProps } from "@/types/applicant/profile/profile";
import { Input } from "@codevs/ui/input";
import { Textarea } from "@codevs/ui/textarea";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export const ExperienceForm = ({
  experience,
  handleUpdateExperience,
  itemNo,
  totalNo,
  editModePerItem,
  handleEditModePerItem,
  handleDeleteExperience,
  isLoadingMain,
}: ExperienceFormProps) => {
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const isNewEmpty =
      totalNo === itemNo + 1 &&
      !experience.position &&
      !experience.description &&
      !experience.date_from &&
      !experience.date_to &&
      !experience.company_name &&
      !experience.location;

    handleEditModePerItem(itemNo, isNewEmpty);
  }, [experience, handleEditModePerItem, itemNo, totalNo]);

  useEffect(() => {
    setEditMode(editModePerItem.current[itemNo] ?? false);
  }, [editModePerItem, itemNo]);

  const handleSaveAndUpdate = async () => {
    if (
      !experience.position ||
      !experience.description ||
      !experience.date_from ||
      !experience.company_name ||
      !experience.location ||
      (!experience.date_to && !experience.is_present)
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const data = {
      position: experience.position,
      description: experience.description,
      date_from: experience.date_from,
      date_to: experience.date_to,
      company_name: experience.company_name,
      location: experience.location,
      codev_id: experience.codev_id,
      profile_id: experience.profile_id,
      is_present: experience.is_present,
    };

    try {
      setIsLoading(true);
      if (!experience.id) {
        const result = await createWorkExperience(
          data,
        );
        if (result[0]) {
          experience.id = result[0].id;
        }
        toast.success("Experience added successfully!");
      } else {
        await updateWorkExperience(experience.id, data);
        toast.success("Experience updated successfully!");
      }
      handleEditModePerItem(itemNo, false);
      setEditMode(false);
    } catch {
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
              handleDeleteExperience(itemNo, experience.id);
            }
          }}
          className="cursor-pointer text-red-500 invert dark:invert-0"
        />
        {!editMode && (
          <IconEdit
            onClick={() => {
              if (!isLoadingMain) setEditMode(true);
            }}
            className="cursor-pointer invert dark:invert-0"
          />
        )}
      </div>

      <div className="w-full">
        <label>
          Position
          <Input
            onChange={(e) =>
              handleUpdateExperience(itemNo, e.target.name, e.target.value)
            }
            value={experience.position}
            type="text"
            name="position"
            variant={editMode ? "lightgray" : "darkgray"}
            className="rounded capitalize"
            disabled={!editMode || isLoading}
          />
        </label>
      </div>

      <div className="mt-4 w-full">
        <label>Company Name</label>
        <Input
          onChange={(e) =>
            handleUpdateExperience(itemNo, e.target.name, e.target.value)
          }
          value={experience.company_name}
          type="text"
          name="company_name"
          variant={editMode ? "lightgray" : "darkgray"}
          className="rounded"
          disabled={!editMode || isLoading}
        />
      </div>

      <div className="mt-4 w-full">
        <label>Location</label>
        <Input
          onChange={(e) =>
            handleUpdateExperience(itemNo, e.target.name, e.target.value)
          }
          value={experience.location}
          type="text"
          name="location"
          variant={editMode ? "lightgray" : "darkgray"}
          className="rounded"
          disabled={!editMode || isLoading}
        />
      </div>

      <div className="mt-4 w-full">
        <label>Description</label>
        <Textarea
          variant="resume"
          onChange={(e) =>
            handleUpdateExperience(itemNo, e.target.name, e.target.value)
          }
          value={experience.description ?? ""}
          name="description"
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
          Date From
          <Input
            onChange={(e) =>
              handleUpdateExperience(itemNo, e.target.name, e.target.value)
            }
            value={experience.date_from}
            type="date"
            name="date_from"
            variant={editMode ? "lightgray" : "darkgray"}
            className="rounded"
            disabled={!editMode || isLoading}
          />
        </label>
        <label className="flex-1">
          Date To
          <Input
            onChange={(e) =>
              handleUpdateExperience(itemNo, e.target.name, e.target.value)
            }
            value={experience.date_to ?? ""}
            type="date"
            name="date_to"
            variant={editMode ? "lightgray" : "darkgray"}
            className="rounded"
            disabled={!editMode || isLoading || experience.is_present}
          />
          <div className="mt-2">
            <input
              type="checkbox"
              name="is_present"
              checked={experience.is_present}
              onChange={(e) =>
                handleUpdateExperience(itemNo, e.target.name, e.target.checked)
              }
              disabled={!editMode || isLoading}
            />
            <label className="ml-2">Present</label>
          </div>
        </label>
      </div>

      {editMode && (
        <div className="mt-6 flex flex-col-reverse items-center justify-center gap-2 md:flex-row md:justify-end">
          <Button
            onClick={() => {
              if (
                !experience.position &&
                !experience.description &&
                !experience.date_from &&
                !experience.date_to &&
                !experience.company_name &&
                !experience.location
              ) {
                handleDeleteExperience(itemNo, experience.id);
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