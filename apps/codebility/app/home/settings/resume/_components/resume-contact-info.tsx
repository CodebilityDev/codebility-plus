"use client";

import { useEffect, useState } from "react";
import Box from "@/Components/shared/dashboard/Box";
import InputPhone from "@/Components/shared/dashboard/InputPhone";
import { Button } from "@/Components/ui/button";
import { IconEdit } from "@/public/assets/svgs";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Input } from "@codevs/ui/input";

import { Social_Types } from "../_types/resume";
import { updateSocial } from "../action";

type Social_Props = {
  data: Social_Types;
};

const ContactInfo = ({ data }: Social_Props) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    phone_no,
    portfolio_website,
    github,
    linkedin,
    facebook,
    telegram,
    whatsapp,
    skype,
  } = data;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      phone_no,
      portfolio_website,
      github,
      linkedin,
      facebook,
      telegram,
      whatsapp,
      skype,
    },
  });

  const onSubmit = async (data: Social_Types) => {
    const toastId = toast.loading("Your social info is being updated");
    try {
      setIsLoading(true);
      await updateSocial(data);
      toast.success("Your contact info was sucessfully updated!", {
        id: toastId,
      });
      setIsEditMode(false);
    } catch (error) {
      console.log(error);
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
        className={` ${
          isEditMode
            ? "hidden"
            : "w-15 h-15 absolute right-6 top-6 cursor-pointer invert dark:invert-0"
        }  `}
        onClick={() => setIsEditMode(true)}
      />
      <form className="px-2" onSubmit={handleSubmit(onSubmit)}>
        <p className="text-lg">Contact Info</p>

        <div className="flex flex-col pt-4">
          <InputPhone
            id="phone_no"
            control={control}
            label="eg. 9054936302"
            disabled={!isEditMode}
            inputClassName={` ${
              isEditMode
                ? " border border-lightgray bg-white text-black-100 dark:border-zinc-700 dark:bg-dark-200 dark:text-white"
                : " bg-white  text-dark-200 dark:bg-dark-200 dark:text-gray"
            }`}
            {...register("phone_no", {
              // pattern: {
              //   value: /^\d{3}[-\s]?\d{3}[-\s]?\d{4}$/,
              //   message: "Invalid phone number. Please enter a 10-digit number.",
              // },
            })}
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
            label="Linkedin"
            disabled={!isEditMode}
            placeholder="eg. https://www.linkedin.com/company/codebilitytech/"
            parentClassName="flex w-full flex-col justify-between gap-2"
            variant={isEditMode ? "lightgray" : "darkgray"}
            className="rounded"
          />

          <Input
            id="telegram"
            {...register("telegram")}
            label="Telegram"
            placeholder="eg. https://www.telegram.com/codebility"
            disabled={!isEditMode}
            parentClassName="flex w-full flex-col justify-between gap-2"
            variant={isEditMode ? "lightgray" : "darkgray"}
            className="rounded"
          />

          <Input
            id="whatsapp"
            {...register("whatsapp")}
            label="Whatsapp"
            placeholder="eg. https://www.whatsapp.com/codebility"
            disabled={!isEditMode}
            parentClassName="flex w-full flex-col justify-between gap-2"
            variant={isEditMode ? "lightgray" : "darkgray"}
            className="rounded"
          />

          <Input
            id="skype"
            {...register("skype")}
            label="Skype"
            placeholder="eg. https://www.skype.com/codebility"
            disabled={!isEditMode}
            parentClassName="flex w-full flex-col justify-between gap-2"
            variant={isEditMode ? "lightgray" : "darkgray"}
            className="rounded"
          />
        </div>
        {isEditMode ? (
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
        ) : null}
      </form>
    </Box>
  );
};

export default ContactInfo;
