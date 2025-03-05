"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
// Import your types + form schema
import { ClientFormValues, clientSchema } from "@/app/home/clients/_lib/schema";
import DefaultAvatar from "@/Components/DefaultAvatar";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
// Hook controlling modal open/close + data
import { useModal } from "@/hooks/use-modal-clients";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Input } from "@codevs/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@codevs/ui/select";

// Your action that updates a client's fields
import { updateClientAction } from "../action";

/**
 * Extend your form type to include `status`.
 * Alternatively, define `status` directly inside your Zod schema
 * if you prefer.
 */
type ClientWithStatusFormValues = ClientFormValues & {
  status: "active" | "inactive";
};

export default function ClientEditModal() {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "clientEditModal";

  // For showing a local preview if we upload a new company logo
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<ClientWithStatusFormValues>({
    resolver: zodResolver(clientSchema),
    mode: "onChange",
  });

  // We'll watch the `status` field to show on the UI
  const currentStatus = watch("status");

  /**
   * On modal open, fill the form with existing client data.
   */
  useEffect(() => {
    if (data) {
      setValue("id", data.id);
      setValue("name", data.name || "");
      setValue("email", data.email || "");
      setValue("phone_number", data.phone_number || "");
      setValue("address", data.address || "");
      setValue("website", data.website || "");

      // If the DB client is "active", set form to "active", else "inactive"
      setValue("status", data.status === "active" ? "active" : "inactive");

      if (data.company_logo) {
        setLogoPreview(data.company_logo);
      }
    }
  }, [data, setValue]);

  /**
   * On close, reset the form + local states
   */
  const handleDialogChange = (open: boolean) => {
    if (!open) {
      reset();
      setLogoPreview(null);
    }
    onClose();
  };

  /**
   * If the user selects a new logo file
   */
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

  /**
   * Submit entire form, including `status`.
   */
  const handleUpdateClient = async (formData: ClientWithStatusFormValues) => {
    if (!formData.id) {
      toast.error("Client ID is missing");
      return;
    }

    setIsLoading(true);
    try {
      // We'll send everything as FormData to your existing action
      const dataToSend = new FormData();

      dataToSend.append("name", formData.name);
      if (formData.email) dataToSend.append("email", formData.email);
      if (formData.phone_number)
        dataToSend.append("phone_number", formData.phone_number);
      if (formData.address) dataToSend.append("address", formData.address);
      if (formData.website) dataToSend.append("website", formData.website);

      // Include the status in a single "save" operation
      dataToSend.append("status", formData.status);

      // If there's a new logo file
      if (formData.company_logo) {
        dataToSend.append("logo", formData.company_logo as File);
      }

      const response = await updateClientAction(formData.id, dataToSend);

      if (response.success) {
        toast.success("Client updated successfully");
        handleDialogChange(false);
      } else {
        toast.error(response.error || "Failed to update");
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

        {/* COMPANY LOGO UPLOAD */}
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
              <p className="text-md text-gray">
                Recommended size 1080 x 768 px
              </p>
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

        {/* STATUS FIELD (SIMPLE SELECT) */}
        <div className="flex items-center justify-between border-b pb-3">
          <span className="font-medium">Status</span>
          <div className="flex items-center gap-4">
            <p className="text-sm">
              Current:{" "}
              <span
                className={
                  currentStatus === "active" ? "text-green" : "text-red-600"
                }
              >
                {currentStatus}
              </span>
            </p>

            {/* A dropdown for "active" / "inactive" */}
            <Select
              value={currentStatus}
              onValueChange={(value) =>
                setValue("status", value as "active" | "inactive")
              }
              disabled={isLoading}
            >
              <SelectTrigger className="focus:ring-inherit">
                <SelectValue placeholder="status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* MAIN FORM FIELDS */}
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

          {/* FOOTER BUTTONS */}
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
