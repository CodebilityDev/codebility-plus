"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Box from "@/Components/shared/dashboard/Box";
import { Button } from "@/Components/ui/button";
import { IconDelete, IconEdit } from "@/public/assets/svgs";
import { WorkExperience } from "@/types/home/codev";
import toast from "react-hot-toast";

import { Input } from "@codevs/ui/input";
import { Textarea } from "@codevs/ui/textarea";

import {
  createWorkExperience,
  deleteWorkExperience,
  updateWorkExperience,
} from "../action";

interface ExperienceProps {
  data: WorkExperience[];
}

interface EditModePerItem {
  [key: string]: boolean;
}

interface ExperienceFormProps {
  experience: WorkExperience;
  handleUpdateExperience: (
    itemNo: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  itemNo: number;
  totalNo: number;
  editModePerItem: React.MutableRefObject<EditModePerItem>;
  handleEditModePerItem: (itemNo: number, editable: boolean) => void;
  handleDeleteExperience: (itemNo: number, id: string) => void;
  isLoadingMain: boolean;
}

const Experience = ({ data }: ExperienceProps) => {
  const [experienceData, setExperienceData] = useState<WorkExperience[]>(data);
  const [isLoadingMain, setIsLoadingMain] = useState(false);
  const editModePerItem = useRef<EditModePerItem>({});

  const handleUpdateExperience = (
    itemNo: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const updatedExperiences = experienceData.map((item, id) => {
      if (id === itemNo) {
        return { ...item, [e.target.name]: e.target.value };
      }
      return item;
    });
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

      // Update edit mode indices
      delete editModePerItem.current[itemNo];
      const newObj: EditModePerItem = {};
      let i = 0;
      for (const key in editModePerItem.current) {
        newObj[i++] = editModePerItem.current[key];
      }
      editModePerItem.current = newObj;

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

    if (
      experienceLast &&
      (!experienceLast.position ||
        !experienceLast.description ||
        !experienceLast.date_to ||
        !experienceLast.date_from ||
        !experienceLast.company_name ||
        !experienceLast.location)
    ) {
      toast.error("Please fill all empty fields first");
      return false;
    }

    if (hasEditMode) {
      toast.error("Please save your changes first");
      return false;
    }

    return true;
  }, [experienceData]);

  return (
    <Box className="bg-light-900 dark:bg-dark-100 relative flex flex-col gap-2">
      <p className="text-lg">Experience</p>

      <Button
        onClick={() => {
          if (canAddNew()) {
            setExperienceData((prev) => [
              ...prev,
              {
                codev_id: "", // Will be set on save
                position: "",
                description: "",
                date_from: "",
                date_to: "",
                company_name: "",
                location: "",
                id: "", // Will be generated on save
                profile_id: undefined,
              },
            ]);
          }
        }}
        variant="outlined"
        className="border-black-100 w-[10rem] border px-[20px] py-6 text-black dark:border-white"
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

const ExperienceForm = ({
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
    setEditMode(editModePerItem.current[itemNo]);
  }, [editModePerItem, itemNo]);

  const handleSaveAndUpdate = async () => {
    const data = {
      position: experience.position,
      description: experience.description,
      date_from: experience.date_from,
      date_to: experience.date_to,
      company_name: experience.company_name,
      location: experience.location,
      codev_id: experience.codev_id,
      profile_id: experience.profile_id,
    };

    try {
      setIsLoading(true);
      if (!experience.id) {
        const result = await createWorkExperience(data);
        if (result && result.length) {
          experience.id = result[0].id;
        }
        toast.success("Experience added successfully!");
      } else {
        await updateWorkExperience(experience.id, data);
        toast.success("Experience updated successfully!");
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
            onChange={(e) => handleUpdateExperience(itemNo, e)}
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
          onChange={(e) => handleUpdateExperience(itemNo, e)}
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
          onChange={(e) => handleUpdateExperience(itemNo, e)}
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
          onChange={(e) => handleUpdateExperience(itemNo, e)}
          value={experience.description}
          name="description"
          className={`$ {
            editMode
              ? "border-lightgray text-black-100 dark:bg-dark-200 dark:text-white" : "text-dark-200 dark:bg-dark-200
              dark:text-gray bg-white" } border bg-white
          dark:border-zinc-700`}
          disabled={!editMode || isLoading}
        />
      </div>

      <div className="mt-4 flex w-full flex-col gap-8 lg:flex-row">
        <label className="flex-1">
          Date From
          <Input
            onChange={(e) => handleUpdateExperience(itemNo, e)}
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
            onChange={(e) => handleUpdateExperience(itemNo, e)}
            value={experience.date_to}
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
                handleUpdateExperience(itemNo, {
                  target: {
                    name: "is_present",
                    value: e.target.checked,
                  },
                })
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
            variant="outlined"
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

export default Experience;
