import { useState } from "react";
import { updateProfile } from "@/app/api/resume";
import Box from "@/Components/shared/dashboard/Box";
import { Button } from "@/Components/ui/button";
import useToken from "@/hooks/use-token";
import { IconEdit } from "@/public/assets/svgs";
import { User } from "@/types";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Label } from "@codevs/ui/label";
import { Textarea } from "@codevs/ui/textarea";

const About = ({ user }: { user: User }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { id, about_me } = user;
  const { token } = useToken();

  const {
    register,
    handleSubmit,
    reset,
    formState: {},
  } = useForm({
    defaultValues: {
      about_me: about_me,
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const updatedData = { ...data };
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
        className={` ${
          isEditMode
            ? "hidden"
            : "w-15 h-15 absolute right-6 top-6 cursor-pointer invert dark:invert-0"
        } `}
        onClick={handleEditClick}
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
                {...register("about_me")}
                disabled={!isEditMode}
                className={` placeholder-${
                  !isEditMode
                    ? "lightgray dark:placeholder-gray"
                    : "black-100 dark:placeholder-gray-400"
                }  ${
                  isEditMode
                    ? " border-lightgray text-black-100 dark:bg-dark-200 border bg-white dark:border-zinc-700 dark:text-white"
                    : "text-dark-200 dark:bg-dark-200 dark:text-gray  border-none bg-white"
                }`}
              />
            </div>
          </div>

          {isEditMode ? (
            <div className="mt-4 flex justify-end gap-2">
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

export default About;
