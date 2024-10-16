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

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      pronoun: "",
      first_name: "",
      last_name: "",
      address: "",
      main_position: "",
    },
  });
  const [selectedPronoun, setSelectedPronoun] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      reset({
        pronoun: data.pronoun || "",
        first_name: data.first_name,
        last_name: data.last_name,
        address: data.address,
        main_position: data.main_position || "",
      });
      setSelectedPronoun(data.pronoun || "");
      setSelectedPosition(data.main_position || "");
    }
  }, [data, reset]);

  const onSubmit = async (data: Profile_Types) => {
    const toastId = toast.loading("Your info was being updated");
    try {
      setIsLoading(true);
      const { first_name, last_name, address } = data;
      await updateProfile({
        first_name,
        last_name,
        address,
        pronoun: selectedPronoun,
        main_position: selectedPosition,
      });
      toast.success("Your personal information was sucessfully updated!", {
        id: toastId,
      });
      setIsEditMode(false);
    } catch (error) {
      console.log(error);
      toast.error("Your personal info was failed to update!");
    } finally {
      setIsLoading(false);
    }
  };
  const handleEditClick = () => {
    setIsEditMode(!isEditMode);
  };
  const handleSaveClick = () => {
    setIsEditMode(false);
  };

  return (
    <Box className="bg-light-900 dark:bg-dark-100 relative flex flex-col gap-2">
      <IconEdit
        className={`${isEditMode ? "hidden" : "w-15 h-15 absolute right-6 top-6 cursor-pointer invert dark:invert-0"}`}
        onClick={handleEditClick}
      />
      <p className="text-lg">Personal Information</p>
      <div className="flex flex-col gap-6 px-2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex w-full flex-col justify-between pt-5">
            <Label className="text-md ">Pronoun</Label>
            <div className="flex flex-col gap-2 pt-2">
              <Select
                onValueChange={(value) => setSelectedPronoun(value)}
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
                  <SelectValue placeholder={selectedPronoun || `Please select`}>
                    {selectedPronoun}
                  </SelectValue>
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
              onValueChange={(value) => setSelectedPosition(value)}
              disabled={!isEditMode}
              {...register("main_position")}
            >
              <SelectTrigger
                aria-label="main_position"
                className={` ${
                  isEditMode
                    ? "dark:bg-dark-200 bg-white"
                    : "text-dark-200 dark:bg-dark-200 dark:text-gray  border-none bg-white"
                } h-11 w-full`}
              >
                <SelectValue placeholder={selectedPosition || `Please select`}>
                  {selectedPosition}
                </SelectValue>
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
                onClick={handleSaveClick}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button variant="default" type="submit" disabled={isLoading}>
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
