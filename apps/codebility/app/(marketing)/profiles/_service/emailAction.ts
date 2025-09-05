"use server";

import { Codev } from "@/types/home/codev";
import { Resend } from "resend";
import { HireCodevEmail } from "../_components/CodevHireCodevModal";
import { HTMLTemplate, TextTemplate } from "./template/hire-codev-template";

type EmailProps = HireCodevEmail & {
	codev: Codev;
}

export const sentHireCodevEmail = async (emailData: EmailProps) => {
	try {
		const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

		const email = {
			from_name: emailData.name,
			from_email: emailData.email,
			message: emailData.message,
			codev_id: emailData.codev.id,
			codev_first_name: emailData.codev.first_name,
			codev_last_name: emailData.codev.last_name,
			codev_display_position: emailData.codev.display_position,
		}


		const { data, error } = await resend.emails.send({
			from: "Codebility Team <Codebility.dev@codebility.tech>",
			to: "Codebility.dev@gmail.com",
			subject: "New Hire Codev Request - Codebility",
			text: TextTemplate(email),
			html: HTMLTemplate(email),
		})

		if (error) {
			console.error("Resend API error:", error);
			throw new Error("Failed to send email");
		}

		return data;
	} catch (error) {
		console.error("Error sending emails:", error);
		throw new Error("Failed to send email");
	}
}

