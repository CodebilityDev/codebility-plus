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
import { positions, profilePronoun } from "@/constants";
import { IconEdit } from "@/public/assets/svgs";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Input } from "@codevs/ui/input";
import { Label } from "@codevs/ui/label";

import { Profile_Types } from "../_types/resume";
import { updateProfile } from "../action";

type Profile_Props = {
  data: Profile_Types;
};

const PersonalInfo = ({ data }: Profile_Props) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { pronoun, first_name, last_name, address, main_position } = data;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      pronoun,
      first_name,
      last_name,
      address,
      main_position,
    },
  });

  const onSubmit = async (data: Profile_Types) => {
    const toastId = toast.loading("Your info is being updated");
    try {
      setIsLoading(true);

      await updateProfile(data);
      toast.success("Your personal information was sucessfully updated!", {
        id: toastId,
      });
      setIsEditMode(false);
    } catch (error) {
      console.log(error);
      toast.error("Your personal info failed to update!");
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
        className={`${isEditMode ? "hidden" : "w-15 h-15 absolute right-6 top-6 cursor-pointer invert dark:invert-0"}`}
        onClick={() => setIsEditMode(true)}
      />
      <p className="text-lg">Personal Information</p>
      <div className="flex flex-col gap-6 px-2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex w-full flex-col justify-between pt-5">
            <Label className="text-md ">Pronoun</Label>
            <div className="flex flex-col gap-2 pt-2">
              <Select
                onValueChange={(value) =>
                  setValue("pronoun", value, { shouldDirty: true })
                }
                value={watch("pronoun") ?? "Please select"}
                disabled={!isEditMode}
              >
                <SelectTrigger
                  aria-label="pronoun"
                  className={` ${
                    isEditMode
                      ? "dark:bg-dark-200 bg-white"
                      : "text-dark-200 dark:bg-dark-200 dark:text-gray  border-none bg-white"
                  } h-11 w-full`}
                >
                  <SelectValue
                    placeholder={watch("pronoun") || `Please select`}
                  />
                </SelectTrigger>

                <SelectContent className=" dark:bg-dark-200 bg-white">
                  <SelectGroup>
                    <SelectLabel className="text-gray text-xs">
                      Please select
                    </SelectLabel>
                    {profilePronoun.map((pronoun: any, i: number) => (
                      <SelectItem key={i} className="text-sm" value={pronoun}>
                        {pronoun}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Input
            parentClassName="flex w-full flex-col justify-between gap-2 "
            label="First Name"
            id="first_name"
            {...register("first_name")}
            disabled={!isEditMode}
            variant={isEditMode ? "lightgray" : "darkgray"}
            className="rounded capitalize"
            placeholder="Your name"
          />
          <Input
            id="last_name"
            {...register("last_name")}
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
            parentClassName="flex w-full flex-col justify-between gap-2 "
            variant={isEditMode ? "lightgray" : "darkgray"}
            className="rounded capitalize"
            placeholder="Your Address"
          />

          <div className="flex w-full flex-col justify-between gap-1 pt-5">
            <Label className="text-md">Position</Label>

            <Select
              onValueChange={(value) =>
                setValue("main_position", value, { shouldDirty: true })
              }
              value={watch("main_position") ?? "Please select"}
            >
              <SelectTrigger
                aria-label="main_position"
                className={` ${
                  isEditMode
                    ? "dark:bg-dark-200 bg-white"
                    : "text-dark-200 dark:bg-dark-200 dark:text-gray  border-none bg-white"
                } h-11 w-full`}
              >
                <SelectValue placeholder={main_position || "Please select"} />
              </SelectTrigger>

              <SelectContent className=" rounded-md">
                <SelectGroup>
                  <SelectLabel className="">Please select</SelectLabel>
                  {positions.map((position: any, i: number) => (
                    <SelectItem key={i} className="text-sm" value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {isEditMode ? (
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
          ) : null}
        </form>
      </div>
    </Box>
  );
};

export default PersonalInfo;
