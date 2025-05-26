"use client";

import { useEffect, useState } from "react";
/* import {
  ApplicantsFormValues,
  applicantsSchema,
} from "@/app/home/applicants/_lib/applicants-schema";
import { updateAction } from "@/app/home/applicants/action"; */
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/Components/ui/dialog";
import { useModal as useModalTechkStack } from "@/hooks/use-modal";
import { useModal } from "@/hooks/use-modal-applicants";
import { useTechStackStore } from "@/hooks/use-techstack";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Input } from "@codevs/ui/input";

const ApplicantsEditModal = () => {
  return <></>;

  /*  const { isOpen, onClose, type, data } = useModal();
  const { onOpen: onOpenTechkStack } = useModalTechkStack();
  const { stack, clearStack, setStack } = useTechStackStore();
  const isModalOpen = isOpen && type === "applicantsEditModal";
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toString = (tostring: string[] = []) => {
    return tostring.map((item) => item).join(", ");
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ApplicantsFormValues>({
    resolver: zodResolver(applicantsSchema),
    mode: "onChange",
  });

  const handleDialogChange = () => {
    reset();
    clearStack();
    onClose();
  };

  const handleOnSubmit = async (newData: ApplicantsFormValues) => {
    if (!newData.id) {
      toast.error("Can't update applicant: Invalid applicant ID");
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("first_name", newData.first_name);
      formData.append("last_name", newData.last_name);
      formData.append("email_address", newData.email_address);
      if (newData.github) formData.append("github", newData.github);
      if (newData.portfolio_website)
        formData.append("portfolio_website", newData.portfolio_website);
      if (newData.tech_stacks)
        formData.append("tech_stacks", newData.tech_stacks);

      const { success, error } = await updateAction(newData.id, formData);

      if (!success) throw error;
      handleDialogChange();
      return toast.success(`Applicant updated successfully`);
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update applicant");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (data) {
      reset({
        id: data.id,
        first_name: data.first_name,
        last_name: data.last_name,
        email_address: data.email_address,
        github: data.github || "",
        portfolio_website: data.portfolio_website || "",
        tech_stacks: toString(data.tech_stacks),
      });
      setStack(data.tech_stacks || []);
    }
  }, [data, reset]);

  useEffect(() => {
    if (isMounted) {
      setValue("tech_stacks", toString(stack));
    }
    setIsMounted(true);
    return () => setIsMounted(false);
  }, [stack, isMounted, setValue]);

  return (
    <Dialog open={isModalOpen} onOpenChange={handleDialogChange}>
      <DialogContent
        aria-describedby={undefined}
        className="flex h-[32rem] w-[90%] max-w-4xl flex-col gap-6 overflow-x-auto overflow-y-auto lg:h-auto"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Applicants</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex w-full flex-col gap-4">
              <div>
                <Input
                  variant="lightgray"
                  type="text"
                  label="First Name"
                  placeholder="Enter your First Name"
                  {...register("first_name")}
                />
                {errors.first_name && (
                  <span className="text-sm text-red-400">
                    {errors.first_name.message}
                  </span>
                )}
              </div>

              <div>
                <Input
                  variant="lightgray"
                  type="text"
                  label="Last Name"
                  placeholder="Enter your Last Name"
                  {...register("last_name")}
                />
                {errors.last_name && (
                  <span className="text-sm text-red-400">
                    {errors.last_name.message}
                  </span>
                )}
              </div>

              <div>
                <Input
                  variant="lightgray"
                  type="email"
                  label="Email Address"
                  placeholder="Enter your Email"
                  {...register("email_address")}
                />
                {errors.email_address && (
                  <span className="text-sm text-red-400">
                    {errors.email_address.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex w-full flex-col gap-4">
              <div>
                <Input
                  variant="lightgray"
                  type="text"
                  label="Github"
                  placeholder="Enter your Github Link (Optional)"
                  {...register("github")}
                />
                {errors.github && (
                  <span className="text-sm text-red-400">
                    {errors.github.message}
                  </span>
                )}
              </div>

              <div>
                <Input
                  variant="lightgray"
                  type="text"
                  label="Website"
                  placeholder="Enter your Website (Optional)"
                  {...register("portfolio_website")}
                />
                {errors.portfolio_website && (
                  <span className="text-sm text-red-400">
                    {errors.portfolio_website.message}
                  </span>
                )}
              </div>

              <div>
                <Input
                  variant="lightgray"
                  type="text"
                  label="Tech Stack"
                  placeholder="Enter your Tech Stack"
                  {...register("tech_stacks")}
                  readOnly
                  value={toString(stack)}
                  onClick={() =>
                    onOpenTechkStack("techStackModal", data?.tech_stacks)
                  }
                />
                {errors.tech_stacks && (
                  <span className="text-sm text-red-400">
                    {errors.tech_stacks.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-8 flex flex-col gap-2 lg:flex-row">
            <Button
              type="button"
              variant="hollow"
              className="order-2 w-full sm:order-1 sm:w-[130px]"
              onClick={handleDialogChange}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="order-1 w-full sm:order-2 sm:w-[130px]"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  ); */
};

export default ApplicantsEditModal;
