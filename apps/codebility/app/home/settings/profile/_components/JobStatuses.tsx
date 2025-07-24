"use client";

import React, { useEffect, useState } from "react";
import Box from "../components/shared/dashboard/Box";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { EMPLOYMENT_TYPES } from "@/constants/employement";
import { IconDelete, IconEdit } from "@/public/assets/svgs";
import { JobStatus } from "@/types/home/codev";
import toast from "react-hot-toast";

import { Input } from "@codevs/ui/input";

import { createJobStatus, deleteJobStatus, updateJobStatus } from "../action";

interface JobStatusProps {
  data: JobStatus[];
}

interface EditModePerItem {
  [key: string]: boolean;
}

interface JobStatusFormProps {
  jobStatus: JobStatus;
  handleUpdateJobStatus: (
    itemNo: number,
    name: keyof JobStatus,
    value: string | boolean,
  ) => void;
  itemNo: number;
  editModePerItem: EditModePerItem;
  handleEditModePerItem: (itemNo: number, editable: boolean) => void;
  handleDeleteJobStatus: (itemNo: number, id: string) => void;
  isLoadingMain: boolean;
}

const JobStatuses = ({ data }: JobStatusProps) => {
  const [jobStatusData, setJobStatusData] = useState<JobStatus[]>(data);
  const [isLoadingMain, setIsLoadingMain] = useState(false);
  const [editModePerItem, setEditModePerItem] = useState<EditModePerItem>({});

  const handleUpdateJobStatus = (
    itemNo: number,
    name: keyof JobStatus,
    value: string | boolean,
  ) => {
    const updatedStatuses = jobStatusData.map((item, id) =>
      id === itemNo ? { ...item, [name]: value } : item,
    );
    setJobStatusData(updatedStatuses);
  };

  const handleDeleteJobStatus = async (itemNo: number, id: string) => {
    try {
      setIsLoadingMain(true);
      if (id) {
        await deleteJobStatus(id);
      }
      const updatedStatuses = jobStatusData.filter((_, id) => id !== itemNo);
      setJobStatusData(updatedStatuses);
      toast.success("Job Status deleted successfully");
    } catch (error) {
      toast.error("Something went wrong while deleting");
    } finally {
      setIsLoadingMain(false);
    }
  };

  const handleEditModePerItem = (itemNo: number, editable: boolean) => {
    setEditModePerItem((prev) => ({ ...prev, [itemNo]: editable }));
  };

  const canAddNew = () => {
    const jobStatusLast = jobStatusData[jobStatusData.length - 1];
    const hasEditMode = Object.values(editModePerItem).some((value) => value);

    if (
      jobStatusLast &&
      (!jobStatusLast.job_title ||
        !jobStatusLast.company_name ||
        !jobStatusLast.employment_type)
    ) {
      toast.error("Please fill all empty fields first");
      return false;
    }

    if (hasEditMode) {
      toast.error("Please save your changes first");
      return false;
    }

    return true;
  };

  return (
    <Box className="bg-light-900 dark:bg-dark-100 relative flex flex-col gap-2">
      <p className="text-lg">Job Status</p>

      <Button
        onClick={() => {
          if (canAddNew()) {
            setJobStatusData((prev) => [
              ...prev,
              {
                id: "",
                codev_id: "",
                job_title: "",
                company_name: "",
                employment_type: "",
                description: "",
                status: "active",
                salary_range: "",
                work_setup: "",
                shift: "",
              } as JobStatus,
            ]);
          }
        }}
        variant="outline"
        className="border-black-100 w-[10rem] border px-[20px] py-6 text-black dark:border-white"
      >
        Add Job Status
      </Button>

      {jobStatusData.map((item, index) => (
        <JobStatusForm
          key={item.id || index}
          handleUpdateJobStatus={handleUpdateJobStatus}
          itemNo={index}
          jobStatus={item}
          editModePerItem={editModePerItem}
          handleEditModePerItem={handleEditModePerItem}
          handleDeleteJobStatus={handleDeleteJobStatus}
          isLoadingMain={isLoadingMain}
        />
      ))}
    </Box>
  );
};

const JobStatusForm = ({
  jobStatus,
  handleUpdateJobStatus,
  itemNo,
  editModePerItem,
  handleEditModePerItem,
  handleDeleteJobStatus,
  isLoadingMain,
}: JobStatusFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveAndUpdate = async () => {
    if (
      !jobStatus.job_title ||
      !jobStatus.company_name ||
      !jobStatus.employment_type ||
      !jobStatus.work_setup
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const data = {
      job_title: jobStatus.job_title.trim(),
      company_name: jobStatus.company_name.trim(),
      employment_type: jobStatus.employment_type,
      work_setup: jobStatus.work_setup,
      description: jobStatus.description?.trim() || null,
      status: "active",
      salary_range: jobStatus.salary_range || null,
      shift: jobStatus.shift || null,
    };

    try {
      setIsLoading(true);
      if (!jobStatus.id) {
        const result = await createJobStatus(data);
        if (result?.[0]) {
          handleUpdateJobStatus(itemNo, "id", result[0].id);
        }
      } else {
        await updateJobStatus(jobStatus.id, data);
      }
      handleEditModePerItem(itemNo, false);
      toast.success(
        jobStatus.id ? "Updated successfully" : "Added successfully",
      );
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save changes");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dark:bg-dark-500 mt-8 flex w-full flex-col gap-4 rounded-md bg-slate-50 px-[24px] py-[29px]">
      <div className="flex w-full items-end justify-end gap-2">
        <IconDelete
          onClick={() => {
            if (!isLoadingMain) handleDeleteJobStatus(itemNo, jobStatus.id);
          }}
          className="cursor-pointer text-red-500 invert dark:invert-0"
        />
        <IconEdit
          onClick={() => handleEditModePerItem(itemNo, true)}
          className="cursor-pointer invert dark:invert-0"
        />
      </div>

      <div className="flex flex-col gap-4">
        <Input
          name="job_title"
          value={jobStatus.job_title}
          onChange={(e) =>
            handleUpdateJobStatus(itemNo, "job_title", e.target.value)
          }
          placeholder="Job Title"
          disabled={!editModePerItem[itemNo] || isLoading}
        />

        <Input
          name="company_name"
          value={jobStatus.company_name}
          onChange={(e) =>
            handleUpdateJobStatus(itemNo, "company_name", e.target.value)
          }
          placeholder="Company Name"
          disabled={!editModePerItem[itemNo] || isLoading}
        />

        <Select
          onValueChange={(value) =>
            handleUpdateJobStatus(itemNo, "employment_type", value)
          }
          value={jobStatus.employment_type || ""}
          disabled={!editModePerItem[itemNo] || isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Employment Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.entries(EMPLOYMENT_TYPES).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) =>
            handleUpdateJobStatus(itemNo, "shift", value)
          }
          value={jobStatus.shift || ""}
          disabled={!editModePerItem[itemNo] || isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Shift" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Morning">Morning</SelectItem>
              <SelectItem value="Afternoon">Afternoon</SelectItem>
              <SelectItem value="Graveyard">Graveyard</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) =>
            handleUpdateJobStatus(itemNo, "work_setup", value)
          }
          value={jobStatus.work_setup || ""}
          disabled={!editModePerItem[itemNo] || isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Work Setup" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Remote">Remote</SelectItem>
              <SelectItem value="Onsite">Onsite</SelectItem>
              <SelectItem value="Hybrid">Hybrid</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) =>
            handleUpdateJobStatus(itemNo, "salary_range", value)
          }
          value={jobStatus.salary_range || ""}
          disabled={!editModePerItem[itemNo] || isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Salary Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="₱20,000 - ₱30,000">
                ₱20,000 - ₱50,000
              </SelectItem>
              <SelectItem value="₱30,000 - ₱40,000">
                ₱51,000 - ₱100,000
              </SelectItem>
              <SelectItem value="₱40,000 - ₱50,000">
                ₱101,000 - ₱150,000
              </SelectItem>

              <SelectItem value="₱50,000+">₱150,000+</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {editModePerItem[itemNo] && (
        <div className="mt-6 flex flex-col-reverse items-center justify-center gap-2 md:flex-row md:justify-end">
          <Button
            onClick={() => handleEditModePerItem(itemNo, false)}
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

export default JobStatuses;
