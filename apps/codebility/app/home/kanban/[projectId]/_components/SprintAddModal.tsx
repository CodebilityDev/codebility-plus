"use client";

import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { useModal } from "@/hooks/use-modal-sprints";
import { Form, FormField } from "@codevs/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import toast from "react-hot-toast";

import DatePicker from "@/Components/ui/date/date-picker";
import { createNewSprint } from "../actions";

const formSchema = z.object({
  startAt: z.date({ required_error: "Start date is required" }),
  endAt: z.date({ required_error: "End date is required" }),
});

type FormValues = z.infer<typeof formSchema>;

const SprintAddModal = () => {
  const { isOpen, onClose, type, projectId } = useModal();
  const isModalOpen = isOpen && type === "sprintAddModal";

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startAt: undefined,
      endAt: undefined,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("projectId", projectId || "");
      formData.append("startAt", values.startAt.toISOString());
      formData.append("endAt", values.endAt.toISOString());

      const response = await createNewSprint(formData);
      if (response.success) {
        toast.success("Sprint created successfully");
        form.reset();
        onClose();
      } else {
        console.error("Create sprint error:", response.error);
        toast.error(response.error || "Failed to create sprint");
      }
    } catch (error) {
      console.error("Error creating sprint:", error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent aria-describedby={undefined} className="w-[90%] max-w-3xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <DialogHeader className="relative">
              <DialogTitle className="mb-2 text-left text-lg">
                Add New Sprint
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h2>Timeline</h2>
                <div className="flex flex-col gap-2 md:flex-row">
                  <FormField
                    control={form.control}
                    name="startAt"
                    render={({ field }) => (
                      <DatePicker
                        label="Start Date"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endAt"
                    render={({ field }) => (
                      <DatePicker
                        label="End Date"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="flex flex-col gap-2 lg:flex-row">
              <Button
                type="button"
                variant="hollow"
                className="order-2 w-full sm:order-1 sm:w-[130px]"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                className="order-1 w-full sm:order-2 sm:w-[130px]"
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add Sprint"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SprintAddModal;
