"use client";

import { useEffect, useState } from "react";
import Box from "@/Components/shared/dashboard/Box";
import { Button } from "@/Components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { positions } from "@/constants";
import { IconEdit } from "@/public/assets/svgs";
import { Codev } from "@/types/home/codev";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Input } from "@codevs/ui/input";
import { Label } from "@codevs/ui/label";

import { updateCodev } from "../action";

type PersonalInfoProps = {
  data: Codev;
};

type FormValues = {
  first_name: string;
  last_name: string;
  address: string | undefined;
  display_position: string | undefined;
  years_of_experience: number;
};

const PersonalInfo = ({ data }: PersonalInfoProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      first_name: data.first_name,
      last_name: data.last_name,
      address: data.address || undefined,
      display_position: data.display_position || undefined,
      years_of_experience: data.years_of_experience || 0,
    },
  });

  const onSubmit = async (formData: FormValues) => {
    const toastId = toast.loading("Updating your information");
    try {
      setIsLoading(true);
      await updateCodev(formData);
      toast.success("Personal information updated successfully!", {
        id: toastId,
      });
      setIsEditMode(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update personal information", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    toast("Update cancelled", {
      duration: 2000,
      icon: "⚠️",
    });
    setIsEditMode(false);
  };

  return (
    <Box className="bg-light-900 dark:bg-dark-100 relative flex flex-col gap-2">
      <IconEdit
        className={`$ {
          isEditMode
            ? "hidden"
            : "h-15 w-15 dark:invert-0" } absolute right-6 top-6 cursor-pointer
        invert`}
        onClick={() => setIsEditMode(true)}
      />
      <p className="text-lg">Personal Information</p>
      <div className="flex flex-col gap-6 px-2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            parentClassName="flex w-full flex-col justify-between gap-2"
            label="First Name"
            id="first_name"
            {...register("first_name", { required: true })}
            disabled={!isEditMode}
            variant={isEditMode ? "lightgray" : "darkgray"}
            className="rounded capitalize"
            placeholder="Your first name"
          />

          <Input
            id="last_name"
            {...register("last_name", { required: true })}
            label="Last Name"
            disabled={!isEditMode}
            parentClassName="flex w-full flex-col justify-between gap-2"
            variant={isEditMode ? "lightgray" : "darkgray"}
            className="rounded capitalize"
            placeholder="Your last name"
          />

          <Input
            id="address"
            {...register("address")}
            label="Address"
            disabled={!isEditMode}
            parentClassName="flex w-full flex-col justify-between gap-2"
            variant={isEditMode ? "lightgray" : "darkgray"}
            className="rounded"
            placeholder="Your address"
          />

          <div className="flex w-full flex-col justify-between gap-1 pt-5">
            <Label className="text-md">Position</Label>
            <Select
              onValueChange={(value) =>
                setValue("display_position", value, { shouldDirty: true })
              }
              value={watch("display_position") || undefined}
              disabled={!isEditMode}
            >
              <SelectTrigger
                aria-label="display_position"
                className={`$ {
                  isEditMode
                    ? "dark:bg-dark-200 bg-white"
                    : "text-dark-200 dark:bg-dark-200 dark:text-gray bg-white" }
                h-11 w-full border-none`}
              >
                <SelectValue placeholder="Select a position" />
              </SelectTrigger>

              <SelectContent className="rounded-md">
                <SelectGroup>
                  <SelectLabel>Select Position</SelectLabel>
                  {positions.map((position: string) => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Input
            id="years_of_experience"
            type="number"
            {...register("years_of_experience", {
              valueAsNumber: true,
              min: 0,
            })}
            label="Years of Experience"
            disabled={!isEditMode}
            parentClassName="flex w-full flex-col justify-between gap-2"
            variant={isEditMode ? "lightgray" : "darkgray"}
            className="rounded"
            placeholder="Years of experience"
          />

          {isEditMode && (
            <div className="mt-5 flex justify-end gap-2">
              <Button
                variant="hollow"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                type="submit"
                disabled={isLoading || !isDirty}
              >
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
        </form>
      </div>
    </Box>
  );
};

export default PersonalInfo;
