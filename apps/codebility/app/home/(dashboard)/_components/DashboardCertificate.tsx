import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/codev-store";
import { cn } from "@codevs/ui";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@codevs/ui/tooltip";
import { CertificateIcon, CertificateOffIcon } from "./DashboardCertificateIcons";
import { Button } from "@codevs/ui/button";

const DashboardCertificate = () => {
	const router = useRouter();
	const { user, userLevel } = useUserStore();

	// Show certificate button if user is admin (role_id 1) or has points/level requirements
	const canViewCertificate = user?.role_id === 1 || user; // Admins can always view, others need to be logged in

	if (!canViewCertificate) {
		return null;
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					size="icon"
					variant="ghost"
					className={cn(
						"rounded-full inline-flex items-center justify-center",
						"transition-colors duration-200",
						"hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
					)}
					onClick={() => {
						router.push("/home/certificate-preview");
					}}
				>
					<CertificateIcon className="h-6 w-6 text-[#9747FF]" />
				</Button>
			</TooltipTrigger>
			<TooltipContent side="bottom" align="start">
				{user?.role_id === 1 ? "View certificates (Admin)" : "View your certificate"}
			</TooltipContent>
		</Tooltip>
	);
};



export default DashboardCertificate;
