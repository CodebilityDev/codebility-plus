import React from "react";
import { Paragraph } from "@/components/shared/home";
import Logo from "@/components/shared/Logo";
import { getCodevs } from "@/lib/server/codev.service";
import { Codev } from "@/types/home/codev";

import ProfileCloseButton from "./_components/ProfileCloseButton";
import ProfileContent from "./_components/ProfileContent";

interface Props {
	params: Promise<{ id: string }>;
}

export default async function CodevBioPage(props: Props) {
	const params = await props.params;
	const id = params.id;

	// Fetch data for the profile
	const { data, error } = await getCodevs({ filters: { id } });

	if (error) {
		console.error("Failed to fetch Codev data:", error);
		return <div>ERROR: Failed to fetch Codev data. {error.message}</div>;
	}

	if (!data || data.length === 0) {
		return <div>No profiles found.</div>;
	}

	const codev = data[0] as Codev;
	const availableSchedule = codev.work_schedules ? codev.work_schedules[0] : null;

	return (
		<section className="from-black-500 to-black-100 relative flex min-h-screen flex-col bg-gradient-to-l">
			<div className="bg-section-wrapper absolute inset-0 bg-fixed bg-repeat opacity-20"></div>

			<div className="relative flex-grow px-5 py-5 md:px-10 md:py-10 lg:px-32 lg:py-20">
				<div className="flex justify-between gap-2">
					<Logo />
					<ProfileCloseButton />
				</div>

				<ProfileContent
					codev={codev}
					availableSchedule={availableSchedule}
				/>
			</div>

			<div className="relative flex flex-col items-center gap-4 pb-10">
				<Logo />
				<Paragraph>© 2023 Codebility. All Rights Reserved</Paragraph>
			</div>
		</section>
	);
}
