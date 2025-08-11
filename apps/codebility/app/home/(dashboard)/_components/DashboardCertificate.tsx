import { useRef } from "react";
import Image from "next/image";
import { useUserStore } from "@/store/codev-store";
import { BookDown } from "lucide-react";
import certificateSvg from "@/public/assets/ssvgs/certificate.svg";

import Certificate, {
	CertificateProps,
	handleDownload,
} from "./DashboardDownloadCertificate";
import { cn } from "@codevs/ui";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@codevs/ui/tooltip";
import { CertificateIcon, CertificateOffIcon } from "./DashboardCertificateIcons";
import { Button } from "@codevs/ui/button";

function hasLevelTwoBadge(level: Record<string, number> | undefined): boolean {
	const validLevels = Object.entries(level!).filter(
		([, levelValue]) => levelValue > 0,
	);

	return validLevels.some(([, levelValue]) => levelValue >= 2);
}

const DashboardCertificate = () => {
	const { user, userLevel } = useUserStore();

	// Check certificate type based on user
	let certificateType = "intern";
	// if (user?.role_id == 4) certificateType = "intern";
	if (user?.role_id == 10) {
		if (userLevel == 2) certificateType = "codev 2";
		else certificateType = "codev 1";
	}
	if (user?.role_id == 5) certificateType = "mentor";

	const certRef = useRef<HTMLDivElement>(null);
	const fullName = `${user!.first_name} ${user!.last_name}`;

	const certData: CertificateProps = (() => {
		switch (certificateType) {
			case "codev 1":
				return {
					title: "PROMOTION",
					name: fullName || "Codev",
					mainSentence: (
						<p className="text-sm">
							has been promoted to <strong>Codev – Level 1</strong> at
							<b> Codebility </b>
						</p>
					),
					description1: (
						<p>
							The recipient has earned this position by meeting the required
							technical standards, exhibiting reliability, and showing readiness
							to contribute in a full development role.
						</p>
					),
				};
			case "codev 2":
				return {
					title: "PROMOTION",
					name: fullName || "Codev",
					mainSentence: (
						<p className="text-sm">
							has been promoted to <strong>Codev – Level 2</strong> at
							<b> Codebility </b>
						</p>
					),
					description1: (
						<p>
							The recipient has achieved this advancement through consistent
							delivery on development tasks, increased technical proficiency,
							and active participation in team efforts.
						</p>
					),
				};
			case "mentor":
				return {
					title: "PROMOTION",
					name: fullName || "Mentor",
					mainSentence: (
						<p className="text-sm">
							has been promoted to <strong>Mentor</strong> at
							<b> Codebility </b>
						</p>
					),
					description1: (
						<p>
							Recognized for leadership, technical guidance, and contributions
							to the development of peers within the organization, reflecting a
							strong commitment to mentorship and team growth.
						</p>
					),
				};
			// Intern
			default:
				return {
					title: "COMPLETION",
					name: fullName || "Intern",
					mainSentence: (
						<p className="text-sm">
							has successfully completed the{" "}
							<strong>Internship Training Program</strong> at
							<b> Codebility </b>
						</p>
					),
					description1: (
						<p>
							The recipient has demonstrated a foundational understanding of
							software development practices, a commitment to learning, and the
							ability to collaborate effectively within a development team.
						</p>
					),
				};
		}
	})();

	const isCertificateUnlocked = hasLevelTwoBadge(user?.level);

	return (
		<>
			<div className="absolute left-4 top-4 z-10">
				<div
					style={{
						position: "absolute",
						left: "-9999px",
						top: 0,
						width: "1000px",
						height: "700px",
						overflow: "hidden",
						visibility: "hidden",
						pointerEvents: "none",
					}}
					aria-hidden="true"
				>
					<Certificate {...certData} ref={certRef} />
				</div>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							size="icon"
							variant="ghost"
							className={cn(
								"rounded-full inline-flex items-center justify-center",
								"transition-colors duration-200",
								isCertificateUnlocked
									? "hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
									: "cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-900"
							)}
							onClick={() => isCertificateUnlocked && handleDownload(certRef, certData.name)}
						>
							{isCertificateUnlocked ? (
								<CertificateIcon className="h-6 w-6 text-[#9747FF]" />
							) : (
								<CertificateOffIcon className="h-6 w-6 opacity-50" />
							)}
						</Button>
					</TooltipTrigger>
					<TooltipContent side="bottom" align="start">
						{isCertificateUnlocked
							? "Download your certificate"
							: "Reach level 2 to unlock the certificate"}
					</TooltipContent>
				</Tooltip>
			</div>
		</>
	);
};



export default DashboardCertificate;
