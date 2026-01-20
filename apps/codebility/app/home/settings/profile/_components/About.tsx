"use client";

import { useState, useEffect } from "react";
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
  const [hasAboutPoints, setHasAboutPoints] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);


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

  const currentAboutValue = watch("about");

  useEffect(() => {
    if (isEditMode) setIsExpanded(true);
    else setIsExpanded(false);
  }, [isEditMode]);

  // Check if user has earned points for the 'about' field
  useEffect(() => {
    async function checkAboutPoints() {
      if (!data.id) return;

      try {
        const res = await fetch(`/api/profile-points/${data.id}`);
        if (res.ok) {
            const pointsData: { points?: { category: string; points: number }[] } = await res.json() as { points?: { category: string; points: number }[] };
            const aboutPoint = pointsData?.points?.find(
              (point) => point.category === 'about'
            );
            setHasAboutPoints(!!aboutPoint && aboutPoint.points > 0);
          }
      } catch (error) {
        console.error("Failed to check about points:", error);
      }
    }

    checkAboutPoints();
  }, [data.id, data.about]); // Re-check when about field changes

  const onSubmit = async (formData: FormValues) => {
    const toastId = toast.loading("Your info is being updated");
    try {
      setIsLoading(true);
      await updateCodev(formData);
      toast.success("Your about was successfully updated!", { id: toastId });
      setIsEditMode(false);
      
      // Re-check points after update
            const res = await fetch(`/api/profile-points/${data.id}`);
            if (res.ok) {
              const pointsData: { points?: { category: string; points: number }[] } = await res.json() as { points?: { category: string; points: number }[] };
              const aboutPoint = pointsData?.points?.find(
                (point) => point.category === 'about'
              );
              setHasAboutPoints(!!aboutPoint && aboutPoint.points > 0);
            }
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

  // Show message only if: field is empty OR (field has content but no points earned yet)
  const shouldShowMessage = !currentAboutValue || (!hasAboutPoints && currentAboutValue);

  return (
    <Box className="bg-light-900 dark:bg-dark-100 relative flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-lg">About</p>
        
        <div className="flex items-center gap-2">
          {!hasAboutPoints && !currentAboutValue && (
            <span className="text-xs text-green-600 flex items-center gap-1">
              <svg 
                className="h-3 w-3" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                  clipRule="evenodd" 
                />
              </svg>
              Write something about yourself to earn points
            </span>
          )}
          
          <IconEdit
            className={`${
              isEditMode
                ? "hidden"
                : "h-15 w-15 cursor-pointer invert dark:invert-0"
            }`}
            onClick={() => setIsEditMode(true)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex w-full flex-col justify-between gap-1 p-2 dark:border-zinc-700">
            <Label>Tell more about yourself</Label>

            <div>
              {!isEditMode ? (
                <div className="relative">
                  <div
                    className="
                      w-full rounded-md
                      bg-light-200 dark:bg-dark-200
                      text-gray-500 dark:text-gray-400
                      overflow-hidden
                    "
                  >
                    <div
                      className={`
                        px-3 py-2
                        text-base leading-normal
                        whitespace-pre-wrap
                        ${
                          isExpanded ? "" : "line-clamp-2"
                        }
                      `}
                      style={!isExpanded ? { maxHeight: '3.7rem' } : {}}
                    >
                      {currentAboutValue || "Write something about yourself..."}
                    </div>
                  </div>

                  {currentAboutValue && currentAboutValue.length > 120 && (
                    <button
                      type="button"
                      onClick={() => setIsExpanded((prev) => !prev)}
                      className="
                        mt-1 text-xs underline
                        text-gray-500 dark:text-gray-400
                        hover:opacity-80
                        transition-opacity
                      "
                    >
                      {isExpanded ? "Show less" : "Show more"}
                    </button>
                  )}
                </div>
              ) : (
                <Textarea
                  variant="resume"
                  placeholder="Write something about yourself..."
                  id="about_me"
                  {...register("about")}
                  rows={8}
                  className="
                    px-3 py-2
                    text-base leading-normal
                    bg-light-100 dark:bg-dark-200
                    text-dark-900 dark:text-light-900
                    border-none
                    rounded-md
                  "
                />
              )}
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