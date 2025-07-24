"use client";

import { useState } from "react";
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

  const onSubmit = async (formData: FormValues) => {
    const toastId = toast.loading("Your contact info is being updated");
    try {
      setIsLoading(true);
      await updateSocialLinks(formData);
      toast.success("Your contact info was successfully updated!", {
        id: toastId,
      });
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
    <Box className="bg-light-900 dark:bg-dark-100 relative flex flex-col gap-6">
      <IconEdit
        className={`${
          isEditMode
            ? "hidden"
            : "h-15 w-15 absolute right-6 top-6 cursor-pointer invert dark:invert-0"
        }`}
        onClick={() => setIsEditMode(true)}
      />
      <form className="px-2" onSubmit={handleSubmit(onSubmit)}>
        <p className="text-lg">Contact Info</p>

        <div className="flex flex-col pt-4">
          <InputField
            id="phone_number"
            control={control}
            type="phone"
            label="Phone Number"
            placeholder="eg. 9054936302"
            disabled={!isEditMode}
            inputClassName={`${
              isEditMode
                ? "border border-lightgray bg-white text-black-100 dark:border-zinc-700 dark:bg-dark-200 dark:text-white"
                : "bg-white text-dark-200 dark:bg-dark-200 dark:text-gray"
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
