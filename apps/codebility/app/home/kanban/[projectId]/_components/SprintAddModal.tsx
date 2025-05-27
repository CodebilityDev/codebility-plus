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
import { Form, FormControl, FormField, FormMessage } from "@codevs/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import DatePicker from "@/Components/ui/date/date-picker";
import { Input } from "@codevs/ui/input";
import { createNewSprint } from "../actions";
import { isBefore, isEqual } from "date-fns";
import { objectToFormData } from "@/lib/form-data";

const formSchema = z.object({
	sprint: z.object({
		startAt: z.date({ required_error: "Start date is required" }),
		endAt: z.date({ required_error: "End date is required" }),
	}),
	board: z.object({
		name: z.string().min(1, { message: "Board name is required" }),
		description: z.string(),
	}),
})
.refine(
    (data) =>
      !data.sprint.startAt ||
      !data.sprint.endAt ||
      !isBefore(data.sprint.endAt, data.sprint.startAt) ||
      isEqual(data.sprint.endAt, data.sprint.startAt),
    {
      message: "End date must not be before start date",
      path: ["sprint.endAt"],
    },
  );

type FormValues = z.infer<typeof formSchema>;

const SprintAddModal = () => {
	const { isOpen, onClose, type, projectId } = useModal();
	const isModalOpen = isOpen && type === "sprintAddModal";

	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			sprint: {
				startAt: undefined,
				endAt: undefined,
			},
			board: {
				name: "",
				description: "",
			},
		},
	});

	const onSubmit = async (values: FormValues) => {
		setIsLoading(true);
		try {
      const formValues = {
        projectId: projectId as string,
        ...values,
      };

      const formData = objectToFormData(formValues);

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
			<DialogContent aria-describedby={undefined} className="w-[90%] max-w-xl">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-4"
					>
						<DialogHeader>
							<DialogTitle className="mb-2 text-left text-lg">
								Add New Sprint
							</DialogTitle>
						</DialogHeader>
						<div className="flex flex-col gap-6">
							<div className="flex flex-col gap-2">
								<h2 className="text-lg font-medium">Timeline</h2>
								<div className="flex flex-col gap-2 md:flex-row">
									<FormField
										control={form.control}
										name="sprint.startAt"
										render={({ field }) => (
											<div className="flex flex-col">
												<FormControl>
													<DatePicker
														label="Start Date"
														value={field.value}
														onChange={field.onChange}
													/>
												</FormControl>
												<FormMessage />
											</div>
										)}
									/>
									<FormField
										control={form.control}
										name="sprint.endAt"
										render={({ field }) => (
											<div className="flex flex-col">
												<FormControl>
													<DatePicker
														label="End Date"
														value={field.value}
														onChange={field.onChange}
													/>
												</FormControl>
												<FormMessage />
											</div>
										)}
									/>
								</div>
								<div className="flex flex-col">
									<h2 className="text-lg font-medium">Board</h2>
									<FormField
										control={form.control}
										name="board.name"
										render={({ field }) => (
											<div className="flex flex-col">
												<FormControl>
													<Input
														label="Board Name"
														placeholder="Enter board name..."
														value={field.value}
														onChange={field.onChange}
													/>
												</FormControl>
												<FormMessage />
											</div>
										)}
									/>
									<FormField
										control={form.control}
										name="board.description"
										render={({ field }) => (
											<FormControl>
												<Input
													label="Description"
													placeholder="Enter board description..."
													value={field.value}
													onChange={field.onChange}
												/>
											</FormControl>
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
