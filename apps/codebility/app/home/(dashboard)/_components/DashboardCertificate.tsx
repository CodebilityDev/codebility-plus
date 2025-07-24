import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/codev-store";
import { BookDown } from "lucide-react";

import Certificate, {
	CertificateProps,
	handleDownload,
} from "./DashboardDownloadCertificate";

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
					<Certificate {...certData} ref={certRef} />
				</div>
				{
					hasLevelTwoBadge(user?.level) && (
						<Button
							className="md:p-15 md:w-15 h-6 w-10 p-2"
							onClick={() => handleDownload(certRef, certData.name)}
						>
							<BookDown />
						</Button>
					)
				}
			</div>
		</>
	);
};

function hasLevelTwoBadge(level: Record<string, number> | undefined): boolean {
	const validLevels = Object.entries(level!).filter(
		([, levelValue]) => levelValue > 0,
	);

	return validLevels.some(([, levelValue]) => levelValue >= 2);
}

export default DashboardCertificate;
