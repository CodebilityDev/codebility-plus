import { useEffect, useState } from "react";
import {
  ApplicantsFormValues,
  applicantsSchema,
} from "@/app/home/applicants/_lib/applicants-schema";
import { ApplicantsList_Types } from "@/app/home/applicants/_types/applicants";
import { createAction } from "@/app/home/applicants/action";
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
import { IconClose } from "@/public/assets/svgs";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Input } from "@codevs/ui/input";

const ApplicantsAddModal = () => {
  const { isOpen, onClose, type } = useModal();
  const { onOpen: onOpenTechkStack } = useModalTechkStack();
  const { stack, clearStack } = useTechStackStore();
  const isModalOpen = isOpen && type === "applicantsAddModal";
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const techStack = stack.map((item) => item).join(", ");

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

  const handleOnSubmit = async (data: ApplicantsFormValues) => {
    setIsLoading(true);
    const formData = {
      ...data,
      tech_stacks: stack,
    } as ApplicantsList_Types;

    const { success, error } = await createAction(formData);

    if (!success) {
      console.error("create applicant error", error as string);
      setIsLoading(false);
      return toast.error(`${error as string}`);
    }

    handleDialogChange();
    setIsLoading(false);
    return toast.success("Applicant has been created");
  };

  useEffect(() => {
    if (isMounted) {
      setValue("tech_stacks", techStack);
    }
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, [techStack, isMounted, setValue]);

  return (
    <Dialog open={isModalOpen} onOpenChange={handleDialogChange}>
      <DialogContent
        aria-describedby={undefined}
        className="flex h-[32rem] w-[90%] max-w-4xl flex-col gap-6 overflow-x-auto overflow-y-auto lg:h-auto"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Applicants</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <div className="flex flex-col gap-4  md:flex-row ">
            <div className="flex w-full flex-col">
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

            <div className="flex w-full flex-col">
              <Input
                variant="lightgray"
                type="text"
                label="Github Link"
                placeholder="Enter your Github Link (Optional)"
                {...register("github_link")}
              />
              {errors.github_link && (
                <span className="text-sm text-red-400">
                  {errors.github_link.message}
                </span>
              )}

              <Input
                variant="lightgray"
                type="text"
                label="Webiste"
                placeholder="Enter your Website (Optional)"
                {...register("portfolio_website")}
                className={
                  errors.portfolio_website
                    ? "border border-red-500 focus:outline-none"
                    : ""
                }
              />
              {errors.portfolio_website && (
                <span className="text-sm text-red-400">
                  {errors.portfolio_website.message}
                </span>
              )}

              <Input
                variant="lightgray"
                type="text"
                label="Tech Stack"
                placeholder="Enter your Tech Stack"
                {...register("tech_stacks")}
                value={techStack}
                readOnly
                onClick={() => onOpenTechkStack("techStackModal")}
              />
              {errors.tech_stacks && (
                <span className="text-sm text-red-400">
                  {errors.tech_stacks.message}
                </span>
              )}
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
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicantsAddModal;
