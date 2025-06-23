import { Button } from "@/Components/ui/button";
import { CertificateProps, Codev } from "@/types/home/codev";
import { differenceInDays, isWeekend, startOfDay } from "date-fns";
import { BookDown } from "lucide-react";
import { useRef } from "react";

import Certificate, { handleDownload } from "./DashboardDownloadCertificate";

type Props = {
	user: Codev;
};

const DashboardCertificate = ({ user }: Props) => {
	const certRef = useRef<HTMLDivElement>(null);
	const requirement1 = has200HoursPassed(user.date_passed ? new Date(user.date_passed) : null);
	const requirement2 = hasLevelTwoBadge(user?.level);

	// Dummy data for the certificate
	// This should be replaced with actual data from the database
	const fullName = `${user.first_name} ${user.last_name}`;
	const certDummyData: CertificateProps = {
		background: "/assets/images/bg-certificate.png",
		logo: "/assets/images/codebility.png",
		name: fullName ?? "Intern",
		course: "Frontend Developer Training Program",
		date_from: "March 1, 2025",
		date_to: "May 1, 2025",
		description:
			"demonstrated a commitment to learning and growth and has mastered key skills in modern web technologies, including frameworks like NEXTJS, version control with Git, and the ability to create responsive and accessible web applications.",
		key_projects: [
			"Responsive Deadpool and Wolverine Website",
			"E-commerce Storefront",
		],
		signature: "/assets/images/signature1.png",
		// signature_name: "Jzeff Kendrew Somera",
		// signature_title: "C.E.O / Founder of Codebility",
	};

	return (
		<>
			<div className="absolute left-4 top-4">
				<div
					style={{
						position: "absolute",
						left: "-9999px",
						top: 0,
						width: "1000px",
						height: "700px",
						overflow: "hidden",
						zIndex: -1,
					}}
				>
					<Certificate {...certDummyData} ref={certRef} />
				</div>
				{requirement1 && requirement2 && (
					<Button
						className="md:p-15 md:w-15 h-6 w-10 p-2"
						onClick={() => handleDownload(certRef, certDummyData.name)}
					>
						<BookDown />
					</Button>
				)}
			</div>
		</>
	);
};

function has200HoursPassed(referenceDate: Date | null): boolean {
	const currentDate = startOfDay(new Date());

  // FIXME: This is a temporary fix to handle the case where the reference date is null
  if (!referenceDate) {
    return false;
  }

	const refDate = startOfDay(referenceDate);

	let totalDays = differenceInDays(currentDate, refDate);
	let weekdays = 0;

	// Count weekdays between dates
	for (let i = 0; i <= totalDays; i++) {
		const current = new Date(refDate);
		current.setDate(refDate.getDate() + i);
		if (!isWeekend(current)) {
			weekdays++;
		}
	}

	// Calculate total hours (8 hours per weekday)
	const totalHours = weekdays * 8;

	return totalHours >= 200;
}

function hasLevelTwoBadge(level: Record<string, number> | undefined): boolean {
	const validLevels = Object.entries(level!).filter(
		([, levelValue]) => levelValue > 0,
	);

	return validLevels.some(([, levelValue]) => levelValue >= 2);
}

export default DashboardCertificate;
