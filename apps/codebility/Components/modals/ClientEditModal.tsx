import { useEffect, useState } from "react";
import Image from "next/image";
import { DEFAULT_AVATAR } from "@/app/home/clients/_lib/constants";
import { ClientFormValues, clientSchema } from "@/app/home/clients/_lib/schema";
import { updateClientAction } from "@/app/home/clients/action";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { useModal } from "@/hooks/use-modal-clients";
import { IconClose } from "@/public/assets/svgs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Input } from "@codevs/ui/input";

const ClientEditModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "clientEditModal";

  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null | undefined>(
    null,
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (data) {
      setLogoPreview(data.logo);

      setValue("id", data.id ? Number(data.id) : undefined);
      setValue("name", data.name);
      setValue("email", data.email || "");
      setValue("location", data.location || "");
      setValue("contact_number", data.contact_number || "");
      setValue("linkedin_link", data.linkedin_link || "");
      setValue("start_time", data.start_time || "");
      setValue("end_time", data.end_time || "");
    }
  }, [data, reset, setValue]);

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      reset();
    }
    onClose();
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("logo", file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setValue("logo", undefined);
  };

  const handleUpdateClient = async (data: ClientFormValues) => {
    if (!data.id) {
      toast.error("Can't update client: Invalid client ID");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.email) formData.append("email", data.email);
      if (data.location) formData.append("location", data.location);
      if (data.contact_number)
        formData.append("contact_number", data.contact_number);
      if (data.linkedin_link)
        formData.append("linkedin_link", data.linkedin_link);
      if (data.start_time) formData.append("start_time", data.start_time);
      if (data.end_time) formData.append("end_time", data.end_time);
      if (data.logo) formData.append("logo", data.logo as File);

      const response = await updateClientAction(data.id, formData);

      if (response.success) {
        toast.success("Client updated successfully");
        handleDialogChange(false);
      } else {
        toast.error(`Error: ${response.error}`);
      }
    } catch (error) {
      console.log("Error updating client:", error);
      toast.error("Error updating client");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleDialogChange}>
      <DialogContent
        aria-describedby={undefined}
        className="flex h-[32rem] w-[90%] max-w-4xl flex-col gap-6 overflow-x-auto overflow-y-auto lg:h-auto"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Company</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex justify-center md:justify-start">
            <label className="md:text-md text-sm lg:text-lg">Logo</label>
          </div>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative mx-auto flex size-[100px] md:mx-0 md:size-[80px]">
              <Image
                src={logoPreview || DEFAULT_AVATAR}
                alt="Logo"
                fill
                className="bg-dark-400 h-auto w-auto rounded-full bg-cover object-cover"
              />
            </div>

            <div className="flex flex-col justify-center gap-2">
              <p className="text-md text-gray">Image size 1080 x 768 px</p>
              <div className="gap-4">
                <div className="relative">
                  {!logoPreview && (
                    <label htmlFor="logo">
                      <p className="cursor-pointer text-center text-blue-100 md:text-left">
                        Upload Image
                      </p>
                    </label>
                  )}
                  <input
                    id="logo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    name="logo"
                    onChange={handleLogoChange}
                  />
                </div>
                {logoPreview && (
                  <p
                    onClick={handleRemoveLogo}
                    className="text-violet cursor-pointer text-center md:text-left"
                  >
                    Remove Image
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleUpdateClient)}>
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="flex flex-1 flex-col gap-4">
              <Input
                variant="lightgray"
                label="Name"
                placeholder="Enter Company Name"
                {...register("name")}
                className={
                  errors.name ? "border border-red-500 focus:outline-none" : ""
                }
              />
              {errors.name && (
                <span className="text-sm text-red-400">
                  {errors.name.message}
                </span>
              )}
              <Input
                variant="lightgray"
                label="Email"
                placeholder="Enter Company Email Address"
                type="email"
                {...register("email")}
                className={
                  errors.email ? "border border-red-500 focus:outline-none" : ""
                }
              />
              {errors.email && (
                <span className="text-sm text-red-400">
                  {errors.email.message}
                </span>
              )}
              <Input
                variant="lightgray"
                label="Address"
                placeholder="Enter Company Address"
                {...register("location")}
                className={
                  errors.location
                    ? "border border-red-500 focus:outline-none"
                    : ""
                }
              />
              {errors.location && (
                <span className="text-sm text-red-400">
                  {errors.location.message}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-4">
              <Input
                variant="lightgray"
                label="Contact Number"
                placeholder="Enter Company Contact Number"
                type="number"
                {...register("contact_number")}
                className={
                  errors.contact_number
                    ? "border border-red-500 focus:outline-none"
                    : ""
                }
              />
              {errors.contact_number && (
                <span className="text-sm text-red-400">
                  {errors.contact_number.message}
                </span>
              )}
              <Input
                variant="lightgray"
                label="Linkedin"
                placeholder="Enter Company Linkedin Link"
                {...register("linkedin_link")}
                className={
                  errors.linkedin_link
                    ? "border border-red-500 focus:outline-none"
                    : ""
                }
              />
              {errors.linkedin_link && (
                <span className="text-sm text-red-400">
                  {errors.linkedin_link.message}
                </span>
              )}
              <div className="flex flex-col gap-4 lg:flex-row">
                <div className="w-full">
                  <Input
                    variant="lightgray"
                    label="Start Time"
                    placeholder="Enter Start Time"
                    type="time"
                    {...register("start_time")}
                    className={
                      errors.start_time
                        ? "border border-red-500 focus:outline-none"
                        : ""
                    }
                  />
                  {errors.start_time && (
                    <span className="text-sm text-red-400">
                      {errors.start_time.message}
                    </span>
                  )}
                </div>
                <div className="w-full">
                  <Input
                    variant="lightgray"
                    label="End Time"
                    placeholder="Enter End Time"
                    type="time"
                    {...register("end_time")}
                    className={
                      errors.end_time
                        ? "border border-red-500 focus:outline-none"
                        : ""
                    }
                  />
                  {errors.end_time && (
                    <span className="text-sm text-red-400">
                      {errors.end_time.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-8 flex flex-col gap-2 lg:flex-row">
            <Button
              type="button"
              variant="hollow"
              className="order-2 w-full sm:order-1 sm:w-[130px]"
              onClick={() => handleDialogChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="order-1 w-full sm:order-2 sm:w-[130px]"
              disabled={isLoading}
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientEditModal;
