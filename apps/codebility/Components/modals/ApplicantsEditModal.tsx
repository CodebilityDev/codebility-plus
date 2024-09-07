import { useEffect, useState } from "react";
import { Button } from "@/Components/ui/button";
import { useModal } from "@/hooks/use-modal-applicants";
import { useModal as useModalTechkStack } from "@/hooks/use-modal";
import { IconClose } from "@/public/assets/svgs";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { useTechStackStore } from "@/hooks/use-techstack";
import toast from "react-hot-toast";
import { updateAction } from "@/app/home/applicants/action";

import { Input } from "@codevs/ui/input";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
} from "@/Components/ui/dialog";
import { ApplicantsFormValues, applicantsSchema } from "@/app/home/applicants/_lib/applicants-schema";
const ApplicantsEditModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const { onOpen: onOpenTechkStack } = useModalTechkStack();
    const { stack, clearStack, setStack } = useTechStackStore();
    const isModalOpen = isOpen && type === "applicantsEditModal";
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const toString = (tostring: string[]) => {
        return tostring.map((item) => item).join(", ")
    }


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
            if (newData.first_name) formData.append("first_name", newData.first_name);
            if (newData.last_name) formData.append("last_name", newData.last_name);
            if (newData.email_address) formData.append("email_address)", newData.email_address);
            if (newData.github_link) formData.append("github_link", newData.github_link);
            if (newData.portfolio_website) formData.append("portfolio_website", newData.portfolio_website);
            if (newData.tech_stacks) formData.append("tech_stacks", newData.tech_stacks);


            const { success, error } = await updateAction(newData?.id, formData);

            if (!success) throw error;
            handleDialogChange()
            return toast.success(`Applicant updated successfully ${newData.email_address}`);
        } catch (error) {

            console.error("the error client:", error);
            toast.error(JSON.stringify(error));
            // toast.error("Error updating client");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (data) {
            const empty = ""
            reset({
                id: data.id || empty,
                first_name: data?.first_name || empty,
                last_name: data?.last_name || empty,
                email_address: data?.email_address || empty,
                github_link: data?.github_link || empty,
                portfolio_website: data?.portfolio_website || empty,
                tech_stacks: toString(data?.tech_stacks) || empty
            });
            setStack(data?.tech_stacks);

        }
    }, [data, reset]);


    useEffect(() => {
        if (isMounted) {
            setValue("tech_stacks", toString(stack));
        }
        setIsMounted(true);

        return () => {
            setIsMounted(false);
        };
    }, [stack, isMounted, setValue]);

    return (
        <Dialog open={isModalOpen} onOpenChange={handleDialogChange}>
            <DialogContent className="flex h-[32rem] w-[90%] max-w-4xl flex-col gap-6 overflow-x-auto overflow-y-auto lg:h-auto">
                <button
                    onClick={() => handleDialogChange()}
                    className="absolute right-4 top-4"
                >
                    <IconClose />
                </button>
                <DialogHeader>
                    <DialogTitle className="text-2xl">Edit Applicants</DialogTitle>
                </DialogHeader>


                <form onSubmit={handleSubmit(handleOnSubmit)}>

                    <div className="flex flex-col gap-4  md:flex-row ">

                        <div className="flex flex-col w-full">

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

                        <div className="flex flex-col w-full">
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
                                readOnly
                                value={toString(stack)}
                                onClick={() => onOpenTechkStack('techStackModal', data?.tech_stacks)}
                            />
                            {errors.tech_stacks && (
                                <span className="text-sm text-red-400">
                                    {errors.tech_stacks.message}
                                </span>
                            )}

                        </div>
                        <div className="border-1 dark:border-gray-200">
                            {errors?.email_address?.message && <span className="text-sm text-red-400">{errors?.email_address?.message}</span>}
                            {errors?.tech_stacks?.message && <span className="text-sm text-red-400">{errors?.tech_stacks?.message}</span>}
                            {errors?.github_link?.message && <span className="text-sm text-red-400">{errors?.github_link?.message}</span>}
                            {errors?.portfolio_website?.message && <span className="text-sm text-red-400">{errors?.portfolio_website?.message}</span>}
                            {errors?.first_name?.message && <span className="text-sm text-red-400">{errors?.first_name?.message}</span>}
                            {errors?.last_name?.message && <span className="text-sm text-red-400">{errors?.last_name?.message}</span>}
                            {errors?.id?.message && <span className="text-sm text-red-400">{errors?.id?.message}</span>}
                        </div>
                    </div>

                    <DialogFooter className="mt-8 flex flex-col gap-2 lg:flex-row">
                        <Button
                            type="button"
                            variant="hollow"
                            className="order-2 w-full sm:order-1 sm:w-[130px]"
                            onClick={() => handleDialogChange()}
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
        </Dialog >
    );
};

export default ApplicantsEditModal;
