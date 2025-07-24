"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ClientFormValues,
  clientSchema,
  FormItems,
  getFormItemLabels,
} from "@/app/home/clients/_lib/schema";
import { createClientAction, fetchCountry } from "@/app/home/clients/action";
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

export default function ClientAddModal() {
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "clientAddModal";

  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [country, setCountry] = useState<{ value: string; label: string }[]>(
    [],
  );

  useEffect(() => {
    const getCountries = async () => {
      try {
        const countryList = (await fetchCountry()) ?? [];

        if (!countryList.length) {
          console.warn("Country list is empty or undefined.");
          return;
        }

        setCountry(countryList);
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      }
    };

    if (isModalOpen) {
      getCountries();
    }
  }, [isModalOpen]);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      website: "",
      client_type: "",
      country: "",
      phone_number: "",
      company_logo: undefined,
    },
    mode: "onBlur",
  });

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      form.reset();
      setLogoPreview(null);
    }
    onClose();
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("company_logo", file); // store as `company_logo`
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    form.setValue("company_logo", undefined);
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

      formData.append("client_type", data.client_type ?? "");
      formData.append("country", data.country?.toUpperCase() ?? "");

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

        
          <form
            onSubmit={form.handleSubmit(handleCreateClient)}
            className="space-y-4"
          >
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {getFormItemLabels(country).map(
                (
                  {
                    labelText,
                    placeHolderText,
                    inputType,
                    formDefaultValue,
                    options,
                  },
                  idx,
                ) => (
                  <FormField
                    key={idx}
                    control={form.control}
                    name={formDefaultValue as keyof ClientFormValues}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{labelText}</FormLabel>
                        <FormControl>
                          {options ? (
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={String(field.value) ?? ""}
                            >
                              <SelectTrigger className="focus:ring-inherit">
                                <SelectValue placeholder={placeHolderText}>
                                  {options.find(
                                    (opt) => opt.value === field.value,
                                  )?.label || placeHolderText}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent className="background-lightbox_darkbox">
                                {options.map(({ value, label }) => (
                                  <SelectItem key={value} value={value}>
                                    {label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              placeholder={placeHolderText}
                              type={inputType}
                              {...field}
                              value={field.value as string}
                              className={`${
                                form.formState.errors[
                                  formDefaultValue as keyof ClientFormValues
                                ]
                                  ? "border border-red-500 focus:outline-none"
                                  : ""
                              }`}
                            />
                          )}
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ),
              )}
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
                disabled={isLoading || !form.formState.isValid}
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        
      </DialogContent>
    </Dialog>
  );
}
