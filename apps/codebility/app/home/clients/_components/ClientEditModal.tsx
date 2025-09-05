"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  clientSchema,
  ClientWithStatusFormValues,
  getFormItemLabels,
} from "@/app/home/clients/_lib/schema";
import DefaultAvatar from "@/components/DefaultAvatar";
import { Button } from "@codevs/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@codevs/ui/dialog";
import { useModal } from "@/hooks/use-modal-clients";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@codevs/ui/form";
import { Input } from "@codevs/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@codevs/ui/select";

import { updateClientAction } from "../action";
import { useCountries } from "@/hooks/useCountries"; // New centralized hook

export default function ClientEditModal() {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "clientEditModal";
  
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Use centralized country hook
  const { countries } = useCountries();

  const form = useForm<ClientWithStatusFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      website: "",
      client_type: "",
      country: "",
      phone_number: "",
      status: "active"
    },
    mode: "onChange",
  });

  const { handleSubmit, reset, setValue, watch, formState: { isValid } } = form;
  const currentStatus = watch("status");

  // Simple data population on modal open
  useEffect(() => {
    if (data && isModalOpen) {
      // Reset form with data - React Hook Form handles null/undefined gracefully
      reset({
        id: data.id,
        name: data.name || "",
        email: data.email || "",
        phone_number: data.phone_number || "",
        address: data.address || "",
        website: data.website || "",
        client_type: data.client_type || "",
        country: data.country || "",
        status: data.status === "active" ? "active" : "inactive",
      });
      
      setLogoPreview(data.company_logo || null);
    }
  }, [data, isModalOpen, reset]);

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

  const handleUpdateClient = async (formData: ClientWithStatusFormValues) => {
    if (!formData.id) {
      toast.error("Client ID is missing");
      return;
    }

    setIsLoading(true);

    try {
      const dataToSend = new FormData();
      
      // Add required fields
      dataToSend.append("name", formData.name);
      dataToSend.append("status", formData.status);
      
      // Add optional fields only if they exist
      if (formData.email) dataToSend.append("email", formData.email);
      if (formData.phone_number) dataToSend.append("phone_number", formData.phone_number);
      if (formData.address) dataToSend.append("address", formData.address);
      if (formData.website) dataToSend.append("website", formData.website);
      if (formData.client_type) dataToSend.append("client_type", formData.client_type);
      if (formData.country) dataToSend.append("country", formData.country.toUpperCase());
      if (formData.company_logo) dataToSend.append("logo", formData.company_logo as File);

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
    <Dialog open={isModalOpen} onOpenChange={handleDialogChange} modal={true}>
      <DialogContent
        aria-describedby={undefined}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex h-[32rem] w-[90%] max-w-4xl flex-col gap-6 overflow-x-auto overflow-y-auto lg:h-auto"
      >
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100 text-2xl">
            Edit Company
          </DialogTitle>
        </DialogHeader>

        {/* Logo Upload Section */}
        <div className="flex flex-col gap-4">
          <label className="text-gray-900 dark:text-gray-100 md:text-md text-sm lg:text-lg">
            Logo
          </label>

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
              <p className="text-md text-gray-600 dark:text-gray-400">
                Recommended size 1080 x 768 px
              </p>
              <div className="gap-4">
                {!logoPreview && (
                  <label htmlFor="edit_company_logo">
                    <p className="cursor-pointer text-center text-customBlue-600 dark:text-customBlue-400 md:text-left">
                      Upload Image
                    </p>
                  </label>
                )}
                <Input
                  id="edit_company_logo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoChange}
                />
                {logoPreview && (
                  <p
                    onClick={handleRemoveLogo}
                    className="text-red-600 dark:text-red-400 cursor-pointer text-center md:text-left"
                  >
                    Remove Image
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status Section */}
        <div className="flex items-center justify-end border-b pb-3">
          <div className="flex gap-4 items-center">
            <p className="text-sm text-gray-900 dark:text-gray-100">
              Status:{" "}
              <span className={currentStatus === "active" ? "text-green-600" : "text-red-600"}>
                {currentStatus}
              </span>
            </p>

            <Select
              value={currentStatus}
              onValueChange={(value) => setValue("status", value as "active" | "inactive")}
              disabled={isLoading}
            >
              <SelectTrigger className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                <SelectItem value="active" className="text-gray-900 dark:text-gray-100">
                  Active
                </SelectItem>
                <SelectItem value="inactive" className="text-gray-900 dark:text-gray-100">
                  Inactive
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Form Fields */}
        <Form {...form}>
          <form onSubmit={handleSubmit(handleUpdateClient)}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {getFormItemLabels(countries).map(
                ({ labelText, placeHolderText, inputType, formDefaultValue, options }, idx) => (
                  <FormField
                    key={idx}
                    control={form.control}
                    name={formDefaultValue as keyof ClientWithStatusFormValues}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900 dark:text-gray-100">
                          {labelText}
                        </FormLabel>
                        <FormControl>
                          {options ? (
                            <Select
                              onValueChange={field.onChange}
                              value={String(field.value) || ""}
                            >
                              <SelectTrigger className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600">
                                <SelectValue placeholder={placeHolderText} />
                              </SelectTrigger>
                              <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                                {options.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    className="text-gray-900 dark:text-gray-100"
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              type={inputType || "text"}
                              placeholder={placeHolderText}
                              {...field}
                              className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                              value={field.value as string}
                              onBlur={(e) => {
                                const value = e.target.value.trim().toLowerCase();
                                if (formDefaultValue === "website" && value && 
                                    !value.startsWith("http://") && !value.startsWith("https://")) {
                                  field.onChange(`https://${value}`);
                                }
                              }}
                            />
                          )}
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )
              )}
            </div>

            <DialogFooter className="mt-8 flex flex-col gap-2 lg:flex-row">
              <Button
                type="button"
                variant="outline"
                className="order-2 w-full sm:order-1 sm:w-[130px] bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                onClick={() => handleDialogChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="order-1 w-full sm:order-2 sm:w-[130px] bg-customBlue-600 hover:bg-customBlue-700 text-white"
                disabled={isLoading || !isValid}
              >
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}