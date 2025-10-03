"use client";

import { useEffect, useState } from "react";
import Box from "@/components/shared/dashboard/Box";
import InputField from "@/components/shared/dashboard/InputPhone";
import { Button } from "@/components/ui/button";
import { IconEdit } from "@/public/assets/svgs";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Input } from "@codevs/ui/input";

import { updateSocialLinks } from "../action";

type ContactInfoProps = {
  data: {
    id?: string;
    facebook?: string | null;
    linkedin?: string | null;
    github?: string | null;
    discord?: string | null;
    portfolio_website?: string | null;
    phone_number?: string | null;
  };
};

type FormValues = {
  facebook?: string;
  linkedin?: string;
  github?: string;
  discord?: string;
  portfolio_website?: string;
  phone_number?: string;
};

const ContactInfo = ({ data }: ContactInfoProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasContactPoints, setHasContactPoints] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      phone_number: data.phone_number || "",
      portfolio_website: data.portfolio_website || "",
      github: data.github || "",
      linkedin: data.linkedin || "",
      facebook: data.facebook || "",
      discord: data.discord || "",
    },
  });

  // Check if user has earned points for any contact field
  useEffect(() => {
    async function checkContactPoints() {
      if (!data.id) return;

      try {
        const res = await fetch(`/api/profile-points/${data.id}`);
        if (res.ok) {
          const pointsData: { points?: { category: string; points: number }[] } = 
            await res.json() as { points?: { category: string; points: number }[] };
          
          // Check if any contact-related categories have points
          const contactCategories = ['phone_number', 'github', 'facebook', 'linkedin', 'discord', 'portfolio_website'];
          const hasAnyContactPoints = pointsData?.points?.some(
            (point) => contactCategories.includes(point.category) && point.points > 0
          );
          
          setHasContactPoints(!!hasAnyContactPoints);
        }
      } catch (error) {
        console.error("Failed to check contact points:", error);
      }
    }

    checkContactPoints();
  }, [data.id, data.phone_number, data.github, data.facebook, data.linkedin, data.discord, data.portfolio_website]);

  const onSubmit = async (formData: FormValues) => {
    const toastId = toast.loading("Your contact info is being updated");
    try {
      setIsLoading(true);
      await updateSocialLinks(formData);
      toast.success("Your contact info was successfully updated!", {
        id: toastId,
      });
      setIsEditMode(false);

      // Re-check points after update
      if (data.id) {
        const res = await fetch(`/api/profile-points/${data.id}`);
        if (res.ok) {
          const pointsData: { points?: { category: string; points: number }[] } = 
            await res.json() as { points?: { category: string; points: number }[] };
          
          const contactCategories = ['phone_number', 'github', 'facebook', 'linkedin', 'discord', 'portfolio_website'];
          const hasAnyContactPoints = pointsData?.points?.some(
            (point) => contactCategories.includes(point.category) && point.points > 0
          );
          
          setHasContactPoints(!!hasAnyContactPoints);
        }
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

  return (
    <Box className="bg-light-900 dark:bg-dark-100 relative flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-lg">Contact Info</p>

        <div className="flex items-center gap-2">
          {!hasContactPoints && (
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
              Complete all contact info to earn points
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
      
      <form className="px-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 pt-4">
          <InputField
            id="phone_number"
            control={control}
            type="phone"
            label="Phone Number"
            placeholder="eg. 9054936302"
            disabled={!isEditMode}
            className={`transition-colors ${
              isEditMode
                ? "dark:bg-dark-200 border-gray-300 bg-white text-gray-900 dark:border-zinc-700 dark:text-white"
                : "dark:bg-dark-200 border-transparent bg-gray-100 text-gray-500 dark:text-gray-400"
            }`}
            inputClassName={`transition-colors ${
              isEditMode
                ? "border-gray-300 bg-white text-gray-900 dark:border-zinc-700 dark:bg-dark-200 dark:text-white"
                : "bg-gray-100 text-gray-500 dark:bg-dark-200 dark:text-gray-400 border-transparent"
            }`}
            {...register("phone_number")}
          />

          <Input
            id="portfolio_website"
            {...register("portfolio_website")}
            label="Website"
            placeholder="eg. Codebility.tech"
            disabled={!isEditMode}
            parentClassName="flex w-full flex-col justify-between gap-2"
            variant={isEditMode ? "lightgray" : "darkgray"}
            className="rounded"
          />

          <Input
            parentClassName="flex w-full flex-col justify-between gap-2"
            variant={isEditMode ? "lightgray" : "darkgray"}
            className="rounded"
            id="github"
            placeholder="eg. https://github.com/CodebilityDev/"
            {...register("github")}
            label="Github"
            disabled={!isEditMode}
          />

          <Input
            id="facebook"
            {...register("facebook")}
            label="Facebook"
            placeholder="eg. https://www.facebook.com/Codebilitydev"
            disabled={!isEditMode}
            parentClassName="flex w-full flex-col justify-between gap-2"
            variant={isEditMode ? "lightgray" : "darkgray"}
            className="rounded"
          />

          <Input
            id="linkedin"
            {...register("linkedin")}
            label="LinkedIn"
            disabled={!isEditMode}
            placeholder="eg. https://www.linkedin.com/company/codebilitytech/"
            parentClassName="flex w-full flex-col justify-between gap-2"
            variant={isEditMode ? "lightgray" : "darkgray"}
            className="rounded"
          />

          <Input
            id="discord"
            {...register("discord")}
            label="Discord"
            placeholder="eg. discord.gg/codebility"
            disabled={!isEditMode}
            parentClassName="flex w-full flex-col justify-between gap-2"
            variant={isEditMode ? "lightgray" : "darkgray"}
            className="rounded"
          />
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
    </Box>
  );
};

export default ContactInfo;