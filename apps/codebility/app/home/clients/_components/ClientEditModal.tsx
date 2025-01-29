"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ClientFormValues, clientSchema } from "@/app/home/clients/_lib/schema";
import { updateClientAction } from "@/app/home/clients/action";
import DefaultAvatar from "@/Components/DefaultAvatar";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { useModal } from "@/hooks/use-modal-clients";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Input } from "@codevs/ui/input";

/**
 * This edit modal aligns with your actual DB columns:
 *  - name, email, phone_number, address, website, company_logo
 */
export default function ClientEditModal() {
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
      // If your data object has different keys, adjust them accordingly
      setValue("id", data.id);
      setValue("name", data.name || "");
      setValue("email", data.email || "");
      setValue("phone_number", data.phone_number || "");
      setValue("address", data.address || "");
      setValue("website", data.website || "");

      // For the logo preview
      setLogoPreview(data.company_logo);
    }
  }, [data, reset, setValue]);

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
      setValue("company_logo", file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveLogo = () => {
    setValue("company_logo", undefined);
    setLogoPreview(null);
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
      if (data.phone_number) formData.append("phone_number", data.phone_number);
      if (data.address) formData.append("address", data.address);
      if (data.website) formData.append("website", data.website);

      // File upload if changed
      if (data.company_logo) {
        formData.append("logo", data.company_logo as File);
      }

      const response = await updateClientAction(data.id, formData);

      if (response.success) {
        toast.success("Client updated successfully");
        handleDialogChange(false);
      } else {
        toast.error(`Error: ${response.error}`);
      }
    } catch (error) {
      console.error("Error updating client:", error);
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
              <p className="text-md text-gray">Image size 1080 x 768 px</p>
              <div className="gap-4">
                {!logoPreview && (
                  <label htmlFor="edit_company_logo">
                    <p className="cursor-pointer text-center text-blue-100 md:text-left">
                      Upload Image
                    </p>
                  </label>
                )}
                <input
                  id="edit_company_logo"
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
