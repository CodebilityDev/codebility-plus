"use client";

import { Button } from "@/Components/ui/button";
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogFooter } from "@/Components/ui/dialog";
import { useModal } from "@/hooks/use-modal";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@codevs/ui/form";
import { Input } from "@codevs/ui/input";
import { Textarea } from "@codevs/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getCodev } from "../_service/actions";
import { z } from "zod";
import { toast } from "@/Components/ui/use-toast";
import { Codev } from "@/types/home/codev";
import { useEffect, useState } from "react";
import { sentHireCodevEmail } from "../_service/emailAction";

const formSchema = z.object({
	name: z.string().min(1, { message: "Name is required" }),
	email: z.string().email({ message: "Invalid email" }),
	message: z.string().min(1, { message: "Message is required" }),
});

type FormValues = z.infer<typeof formSchema>;
export type HireCodevEmail = FormValues;

export function CodevHireCodevModal() {
	const { isOpen, onClose, type, data: codevId } = useModal();
	const isModalOpen = isOpen && type === "marketingCodevHireCodevModal";
	const [codev, setCodev] = useState<Codev | null>(null);

	useEffect(() => {
		getCodev(codevId).then((data) => {
			setCodev(data);
		});
	}, [codevId]);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			message: "",
		},
	});

	const onSubmit = async (values: FormValues) => {
		try {
			// Prepare template parameters
			const templateParams = {
				from_name: values.name,
				from_email: values.email,
				message: values.message,
				codev_id: codevId,
				codev_first_name: codev?.first_name,
				codev_last_name: codev?.last_name,
				codev_display_position: codev?.display_position,
			};

			const response = await sentHireCodevEmail({
				name: values.name,
				email: values.email,
				message: values.message,
				codev: codev!,
			});


			if (response) {
				toast({
					title: "Email sent successfully",
					description: "We'll get back to you soon!",
					duration: 4000,
				});
			}

			// Reset form and close modal
			form.reset();
			handleClose();

		} catch (error: any) {
			toast({
				title: "Email failed to send",
				description: error?.text || "An error occurred while sending the email.",
				variant: "destructive",
			});
		}
	};

	const handleClose = () => {
		form.reset();
		onClose();
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Hire Codev</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-4"
						autoComplete="off"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<>
									<FormItem>
										<FormControl>
											<Input
												label="Name"
												placeholder="Your name"
												value={field.value}
												onChange={field.onChange}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								</>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<>
									<FormItem>
										<FormControl>
											<Input
												label="Email"
												placeholder="your@email.com"
												value={field.value}
												onChange={field.onChange}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								</>
							)}
						/>
						<FormField
							control={form.control}
							name="message"
							render={({ field }) => (
								<>
									<FormItem>
										<FormControl>
											<Textarea
												label="Message"
												rows={4}
												placeholder="Your message"
												className="bg-muted/50"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								</>
							)}
						/>
						<DialogFooter className="flex flex-col gap-2 lg:flex-row">
							<Button
								type="button"
								variant="hollow"
								className="order-2 w-full sm:order-1 sm:w-[130px]"
								onClick={handleClose}
								disabled={form.formState.isSubmitting}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								variant="default"
								className="order-1 w-full sm:order-2 sm:w-[130px]"
								disabled={form.formState.isSubmitting}
							>
								{form.formState.isSubmitting ? "Sending..." : "Send Email"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
