"use client";

import { useState } from "react";
import Box from "@/components/global/layout/Box";
import { Button } from "@/components/global/ui/button";



import type { JobStatus } from "@/types/global/codev";
import toast from "react-hot-toast";



import { deleteJobStatus } from "@/actions/applicant/profile/applicant-profile";
import { JobStatusForm } from "@/components/applicant/profile/JobStatusForm";
import type { JobStatusProps, EditModePerItem } from "@/types/applicant/profile/profile";


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
              },
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

export default JobStatuses;
