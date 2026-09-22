"use client";

import { useRouter } from "next/navigation";

import { cn } from "@codevs/ui";
import { Button } from "@codevs/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@codevs/ui/tooltip";

import { CertificateIcon } from "./DashboardCertificateIcons";

const DashboardCertificate = ({ roleId }: { roleId: number | null }) => {
  const router = useRouter();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "inline-flex items-center justify-center rounded-full",
              "transition-colors duration-200",
              "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800",
            )}
            onClick={() => {
              router.push("/home/certificate-preview");
            }}
          >
            <CertificateIcon className="h-6 w-6 text-[#9747FF]" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="start">
          {roleId === 1 ? "View certificates (Admin)" : "View your certificate"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DashboardCertificate;
