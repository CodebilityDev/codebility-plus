import { useState } from "react";
import { updateProfile } from "@/app/api/resume";
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
import useToken from "@/hooks/use-token";
import { IconEdit } from "@/public/assets/svgs";
import { User } from "@/types";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Input } from "@codevs/ui/input";
import { Label } from "@codevs/ui/label";

const PersonalInfo = ({ user }: { user: User }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { id, pronoun, first_name, last_name, address, main_position } = user;
  const { token } = useToken();

  const [selectedPronoun, setSelectedPronoun] = useState<string | null>(
    pronoun || null,
  );
  const [selectedPosition, setSelectedPosition] = useState<string | null>(
    main_position || null,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: {},
  } = useForm({
    defaultValues: {
      pronoun: pronoun,
      first_name: first_name,
      last_name: last_name,
      address: address,
      main_position: main_position,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const updatedData = {
        ...data,
        pronoun: selectedPronoun,
        main_position: selectedPosition,
      };

      await updateProfile(id, updatedData, token).then((response) => {
        if (response) {
          toast.success("Successfully Updated!");
          reset(updatedData);
          setIsEditMode(false);
        } else if (!response) {
          toast.error(response.statusText);
        }
      });
    } catch (e) {
      toast.error("Something went wrong!");
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
                  aria-label="Pronoun"
                  className={` ${
                    isEditMode
                      ? "dark:bg-dark-200 bg-white"
                      : "text-dark-200 dark:bg-dark-200 dark:text-gray  border-none bg-white"
                  } h-11 w-full`}
                >
                  <SelectValue
                    placeholder={pronoun ? pronoun : `Please select`}
                  >
                    {selectedPronoun}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent className=" dark:bg-dark-200 bg-white">
                  <SelectGroup>
                    <SelectLabel className="text-gray text-xs">
                      Please select
                    </SelectLabel>
                    {profilePronoun.map((pronoun, i) => (
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
          />
          <Input
            id="last_name"
            {...register("last_name")}
            label="Last Name"
            disabled={!isEditMode}
            parentClassName="flex w-full flex-col justify-between gap-2"
            variant={isEditMode ? "lightgray" : "darkgray"}
            className="rounded capitalize"
          />
          <Input
            id="address"
            {...register("address")}
            label="Address"
            disabled={!isEditMode}
            parentClassName="flex w-full flex-col justify-between gap-2 "
            variant={isEditMode ? "lightgray" : "darkgray"}
            className="rounded capitalize"
          />

          <div className="flex w-full flex-col justify-between gap-1 pt-5">
            <Label className="text-md">Position</Label>

            <Select
              onValueChange={(value) => setSelectedPosition(value)}
              disabled={!isEditMode}
            >
              <SelectTrigger
                aria-label="Position"
                className={` ${
                  isEditMode
                    ? "dark:bg-dark-200 bg-white"
                    : "text-dark-200 dark:bg-dark-200 dark:text-gray  border-none bg-white"
                } h-11 w-full`}
              >
                <SelectValue
                  placeholder={main_position ? main_position : `Please select`}
                >
                  {selectedPosition}
                </SelectValue>
              </SelectTrigger>

              <SelectContent className=" rounded-md">
                <SelectGroup>
                  <SelectLabel className="">Please select</SelectLabel>
                  {positions.map((position, i) => (
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
