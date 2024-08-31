import Image from "next/image";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@codevs/ui/input";
import { Button } from "@/Components/ui/button";
import { IconClose } from "@/public/assets/svgs";
import { useModal } from "@/hooks/use-modal-clients";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { ClientFormValues, clientSchema } from "@/app/home/clients/_lib/schema";
import { DEFAULT_AVATAR } from "@/app/home/clients/_lib/constants";
import { updateClientAction } from "@/app/home/clients/action";

const ClientEditModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "clientEditModal";

  const [companyLogo, setCompanyLogo] = useState<string>(DEFAULT_AVATAR);
  const [isLoading, setIsLoading] = useState(false);

  console.log("data edit: ", data)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (data) {
      setCompanyLogo(data.logo || DEFAULT_AVATAR);
      reset({
        id: data.id ? Number(data.id) : undefined,
        name: data.name,
        email: data.email || "",
        location: data.location || "",
        contact_number: data.contact_number || "",
        linkedin_link: data.linkedin_link || "",
        start_time: data.start_time || "",
        end_time: data.end_time || "",
        logo: data.logo || "",
      });
    }
  }, [data, reset]);

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      reset();
    }
    onClose();
  };

  const handleUpdateClient = async (data: ClientFormValues) => {
    if (!data.id) {
      toast.error("Can't update client: Invalid client ID");
      return;
    }

    setIsLoading(true);

    try {
        const response = await updateClientAction(data.id, data);
        
        if (response.success) {
            toast.success("Client updated successfully");
            handleDialogChange(false);
        } else {
            toast.error(`Error: ${response.error}`);
        }
    } catch (error) {
        console.log("Error updating client: ", error);
        toast.error("Error updating client");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleDialogChange}>
      <DialogContent
        className="flex h-[32rem] w-[90%] max-w-4xl flex-col gap-6 overflow-x-auto overflow-y-auto lg:h-auto"
      >
        <button onClick={() => handleDialogChange(false)} className="absolute right-4 top-4">
          <IconClose />
        </button>
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
                src={companyLogo}
                alt="Logo"
                fill
                className="h-auto w-auto rounded-full bg-dark-400 bg-cover object-cover"
              />
            </div>

            <div className="flex flex-col justify-center gap-2">
              <p className="text-md text-gray">Image size 1080 x 768 px</p>
              <div className="gap-4">
                <div className="relative">
                  {!data?.logo && <label htmlFor="companylogo">
                    <p className="cursor-pointer text-center text-blue-100 md:text-left">Upload Image</p>
                  </label>}
                  <input
                    id="companylogo"
                    type="file"
                    className="hidden"
                    // Handle file change if necessary
                  />
                  <input type="hidden" name="logo" value={companyLogo} />
                </div>
                {data?.logo && <p className="cursor-pointer text-center text-violet md:text-left">
                  Remove Image
                </p>}
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
                className={errors.name ? "border border-red-500 focus:outline-none" : ""}
              />
              {errors.name && <span className="text-sm text-red-400">{errors.name.message}</span>}
              <Input
                variant="lightgray"
                label="Email"
                placeholder="Enter Company Email Address"
                type="email"
                {...register("email")}
                className={errors.email ? "border border-red-500 focus:outline-none" : ""}
              />
              {errors.email && <span className="text-sm text-red-400">{errors.email.message}</span>}
              <Input
                variant="lightgray"
                label="Address"
                placeholder="Enter Company Address"
                {...register("location")}
                className={errors.location ? "border border-red-500 focus:outline-none" : ""}
              />
              {errors.location && <span className="text-sm text-red-400">{errors.location.message}</span>}
            </div>
            <div className="flex flex-1 flex-col gap-4">
              <Input
                variant="lightgray"
                label="Contact Number"
                placeholder="Enter Company Contact Number"
                type="number"
                {...register("contact_number")}
                className={errors.contact_number ? "border border-red-500 focus:outline-none" : ""}
              />
              {errors.contact_number && <span className="text-sm text-red-400">{errors.contact_number.message}</span>}
              <Input
                variant="lightgray"
                label="Linkedin"
                placeholder="Enter Company Linkedin Link"
                {...register("linkedin_link")}
                className={errors.linkedin_link ? "border border-red-500 focus:outline-none" : ""}
              />
              {errors.linkedin_link && <span className="text-sm text-red-400">{errors.linkedin_link.message}</span>}
              <div className="flex flex-col gap-4 lg:flex-row">
                <div className="w-full">
                  <Input
                    variant="lightgray"
                    label="Start Time"
                    placeholder="Enter Start Time"
                    type="time"
                    {...register("start_time")}
                    className={errors.start_time ? "border border-red-500 focus:outline-none" : ""}
                  />
                  {errors.start_time && (
                    <span className="text-sm text-red-400">{errors.start_time.message}</span>
                  )}
                </div>
                <div className="w-full">
                  <Input
                    variant="lightgray"
                    label="End Time"
                    placeholder="Enter End Time"
                    type="time"
                    {...register("end_time")}
                    className={errors.end_time ? "border border-red-500 focus:outline-none" : ""}
                  />
                  {errors.end_time && (
                    <span className="text-sm text-red-400">{errors.end_time.message}</span>
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
            <Button type="submit" className="order-1 w-full sm:order-2 sm:w-[130px]" disabled={isLoading}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientEditModal;
