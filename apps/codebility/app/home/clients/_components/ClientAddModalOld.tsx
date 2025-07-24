"use client";

import { useState } from "react";
import Image from "next/image";
import { ClientFormValues, clientSchema } from "@/app/home/clients/_lib/schema";
import { createClientAction } from "@/app/home/clients/action";
import DefaultAvatar from "@/components/DefaultAvatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-clients";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Input } from "@codevs/ui/input";

export default function ClientAddModal() {
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "clientAddModal";

  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

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

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      reset();
      setLogoPreview(null);
    }
    onClose();
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("company_logo", file); // store as `company_logo`
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setValue("company_logo", undefined);
  };

  const handleCreateClient = async (data: ClientFormValues) => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      // Required in your schema
      formData.append("name", data.name);

      // Optional fields
      if (data.email) formData.append("email", data.email);
      if (data.phone_number) formData.append("phone_number", data.phone_number);
      if (data.address) formData.append("address", data.address);
      if (data.website) formData.append("website", data.website);

      // File upload
      if (data.company_logo) {
        formData.append("logo", data.company_logo as File);
      }

      const response = await createClientAction(formData);

      if (response.success) {
        toast.success("Client created successfully");
        handleDialogChange(false);
      } else {
        toast.error(`Error: ${response.error}`);
      }
    } catch (error) {
      console.log("Error creating new client:", error);
      toast.error("Error creating new client");
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
          <DialogTitle className="text-2xl">Add New Company</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex justify-center md:justify-start">
            <label className="md:text-md text-sm lg:text-lg">Logo</label>
          </div>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative mx-auto flex size-[100px] md:mx-0 md:size-[80px]">
              {logoPreview ? (
                <Image
                  src={logoPreview}
                  alt="Company Logo"
                  fill
                  className="bg-dark-400 h-auto w-auto rounded-full bg-cover object-cover"
                />
              ) : (
                <DefaultAvatar />
              )}
            </div>

            <div className="flex flex-col justify-center gap-2">
              <p className="text-md text-gray text-center">
                Image size 1080 x 768 px
              </p>
              <div className="gap-4">
                {!logoPreview && (
                  <label htmlFor="company_logo">
                    <p className="cursor-pointer text-center text-blue-100 md:text-left">
                      Upload Image
                    </p>
                  </label>
                )}
                <input
                  id="company_logo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  name="company_logo"
                  onChange={handleLogoChange}
                />
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

        <form onSubmit={handleSubmit(handleCreateClient)}>
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
                {...register("address")}
                className={
                  errors.address
                    ? "border border-red-500 focus:outline-none"
                    : ""
                }
              />
              {errors.address && (
                <span className="text-sm text-red-400">
                  {errors.address.message}
                </span>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-4">
              <Input
                variant="lightgray"
                label="Phone Number"
                placeholder="Enter Company Phone Number"
                type="tel"
                {...register("phone_number")}
                className={
                  errors.phone_number
                    ? "border border-red-500 focus:outline-none"
                    : ""
                }
              />
              {errors.phone_number && (
                <span className="text-sm text-red-400">
                  {errors.phone_number.message}
                </span>
              )}

              <Input
                variant="lightgray"
                label="Website"
                placeholder="https://example.com"
                {...register("website")}
                className={
                  errors.website
                    ? "border border-red-500 focus:outline-none"
                    : ""
                }
              />
              {errors.website && (
                <span className="text-sm text-red-400">
                  {errors.website.message}
                </span>
              )}
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
              disabled={isLoading || !isValid}
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
