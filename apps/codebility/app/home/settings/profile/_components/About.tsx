"use client";

import { useState } from "react";
import Box from "@/components/shared/dashboard/Box";
import { Button } from "@/components/ui/button";
import { IconEdit } from "@/public/assets/svgs";
import { Codev } from "@/types/home/codev";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Label } from "@codevs/ui/label";
import { Textarea } from "@codevs/ui/textarea";

import { updateCodev } from "../action";

type AboutProps = {
  data: Codev;
};

type FormValues = {
  about: string;
};

const About = ({ data }: AboutProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      about: data.about ?? "",
    },
  });

  const onSubmit = async (formData: FormValues) => {
    const toastId = toast.loading("Your info is being updated");
    try {
      setIsLoading(true);
      await updateCodev(formData);
      toast.success("Your about was successfully updated!", { id: toastId });
      setIsEditMode(false);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong, please try again later!");
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
        className={`${
          isEditMode
            ? "hidden"
            : "h-15 w-15 absolute right-6 top-6 cursor-pointer invert dark:invert-0"
        }`}
        onClick={() => setIsEditMode(true)}
      />

      <p className="text-lg">About</p>

      <div className="flex flex-col gap-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex w-full flex-col justify-between gap-1 p-2 dark:border-zinc-700">
            <Label>Tell more about yourself</Label>

            <div>
              <Textarea
                variant="resume"
                placeholder="Write something about yourself..."
                id="about_me"
                {...register("about")}
                disabled={!isEditMode}
                value={watch("about") || ""}
                className={`placeholder-${
                  !isEditMode
                    ? "lightgray dark:placeholder-gray"
                    : "black-100 dark:placeholder-gray-400"
                } ${
                  isEditMode
                    ? "border-lightgray text-black-100 dark:bg-dark-200 border bg-white dark:border-zinc-700 dark:text-white"
                    : "text-dark-200 dark:bg-dark-200 dark:text-gray border-none bg-white"
                }`}
              />
            </div>
          </div>

          {isEditMode && (
            <div className="mt-4 flex justify-end gap-2">
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

export default About;
