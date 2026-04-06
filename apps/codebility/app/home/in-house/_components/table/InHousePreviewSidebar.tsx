"use client";

import { useTransition } from "react";
import Image from "next/image";
import { X, Mail, Briefcase, Folder, Link2, Calendar, Download, AlertCircle } from "lucide-react";

import { Codev, InternalStatus } from "@/types/home/codev";
import { Button } from "@codevs/ui/button";
import { Badge } from "@codevs/ui/badge";
import { StatusBadge } from "../shared/StatusBadge";
import SwitchStatusButton from "@/components/ui/SwitchStatusButton";

interface Role {
  id: string | number;
  name: string;
}

interface InHousePreviewSidebarProps {
  member: Codev;
  roles: Role[];
  onClose: () => void;
  onUpdated: (updatedItem: Codev) => void;
  onSendNdaEmail: (id: string, email: string, subject: string, message: string) => Promise<void>;
  onDownloadNda: (id: string) => Promise<void>;
  onDownloadSignature: (id: string) => Promise<void>;
}

const defaultImage = "/assets/svgs/icon-codebility-black.svg";

const capitalize = (str: string) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "-";

export default function InHousePreviewSidebar({
  member,
  roles,
  onClose,
  onUpdated,
  onSendNdaEmail,
  onDownloadNda,
  onDownloadSignature,
}: InHousePreviewSidebarProps) {
  const [isPending, startTransition] = useTransition();

  const handleNdaSend = async () => {
    startTransition(async () => {
      const subject = "NDA Signing Request - Codebility Plus";
      const message = `Dear ${member.first_name},\n\nPlease sign the Non-Disclosure Agreement by clicking on the link below:\n\n[NDA_LINK]\n\nThank you,\nCodebility Plus Team`;
      await onSendNdaEmail(member.id, member.email_address, subject, message);
    });
  };

  const memberRole = roles.find((r) => String(r.id) === String(member.role_id))?.name || "-";
  const dateJoined = member.date_joined
    ? new Date(member.date_joined).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Unknown";

  return (
    <div
      className="fixed bottom-0 right-0 top-0 z-[19] w-full max-w-[420px] transform overflow-y-auto border-l border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:border-zinc-800 dark:bg-zinc-950/95 flex flex-col pt-[64px]"
      style={{
        animation: "slide-in-right 0.25s ease-out forwards",
      }}
    >
      {/* Header */}
      <div className="z-[19] flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 dark:bg-blue-500/20">
            <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Member Details</h2>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white"
          title="Close Preview"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-5 space-y-6 flex-1">
        {/* Profile Card */}
        <div className="flex items-start gap-4 pb-4 border-b border-gray-100 dark:border-zinc-800">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-100 dark:border-zinc-700 dark:bg-zinc-800">
            <Image
              src={member.image_url || defaultImage}
              alt={`${member.first_name} avatar`}
              width={64}
              height={64}
              unoptimized={true}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <h3 className="text-xl font-bold text-gray-900 leading-tight dark:text-white truncate">
              {capitalize(member.first_name)} {capitalize(member.last_name)}
            </h3>
            <p className="text-sm text-gray-500 truncate flex items-center gap-1.5 mt-1">
              <Mail className="h-3.5 w-3.5" />
              {member.email_address}
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <StatusBadge status={member.internal_status as InternalStatus} />
              {member.availability_status ? (
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Available
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-gray-500/10 px-2 py-0.5 text-[10px] font-semibold text-gray-600 dark:text-gray-400">
                  Unavailable
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Roles & Positions */}
        <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Role & Position
          </h4>
          <div className="space-y-3">
            <InfoRow icon={<Briefcase className="h-4 w-4" />} label="Role" value={memberRole} />
            <InfoRow icon={<Briefcase className="h-4 w-4" />} label="Display Position" value={capitalize(member.display_position || "-")} />
            <InfoRow icon={<Calendar className="h-4 w-4" />} label="Date Joined" value={dateJoined} />
          </div>
        </div>

        {/* Work Details */}
        <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Work Details
          </h4>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <Folder className="h-3.5 w-3.5" />
                <span>Assigned Projects</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pl-5">
                {member.projects && member.projects.length > 0 ? (
                  member.projects.map((project) => (
                    <Badge key={project.id} variant="secondary" className="font-normal border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
                      {project.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-gray-400 dark:text-gray-500 italic">No active projects</span>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200/60 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <Link2 className="h-3.5 w-3.5" />
                <span>Portfolio Website</span>
              </div>
              <div className="pl-5">
                {member.portfolio_website ? (
                  <a href={member.portfolio_website} target="_blank" rel="noreferrer" className="text-sm text-blue-500 hover:text-blue-600 hover:underline dark:text-blue-400 truncate block">
                    {member.portfolio_website}
                  </a>
                ) : (
                  <span className="text-sm text-gray-400 dark:text-gray-500 italic">Not provided</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* NDA Status */}
        <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Legal & Compliance
          </h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">NDA Status</span>
            </div>
            
            <div className="flex items-center gap-2">
              {member.nda_status ? (
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Signed
                </span>
              ) : member.nda_request_sent ? (
                <span className="inline-flex items-center rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs font-semibold text-yellow-600 dark:text-yellow-400">
                  Pending
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-semibold text-red-600 dark:text-red-400">
                  Unsigned
                </span>
              )}
            </div>
          </div>

          <div className="mt-3 pl-6">
            {member.nda_status ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs bg-white dark:bg-zinc-800 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400 border-gray-200 dark:border-zinc-700"
                  onClick={() => onDownloadNda(member.id)}
                >
                  <Download className="h-3.5 w-3.5" />
                  NDA Document
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs bg-white dark:bg-zinc-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 border-gray-200 dark:border-zinc-700"
                  onClick={() => onDownloadSignature(member.id)}
                >
                  <Download className="h-3.5 w-3.5" />
                  Signature
                </Button>
              </div>
            ) : !member.nda_request_sent ? (
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 border-gray-200 dark:border-zinc-700"
                onClick={handleNdaSend}
                disabled={isPending}
              >
                <Mail className="h-3.5 w-3.5" />
                {isPending ? "Sending Request..." : "Send Signing Request"}
              </Button>
            ) : null}
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}} />
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-gray-400">{icon}</span>
      <div className="flex items-center gap-1.5 text-sm min-w-0">
        <span className="text-gray-500 dark:text-gray-400 shrink-0">{label}:</span>
        <span className="text-gray-900 dark:text-gray-200 truncate font-medium">{value}</span>
      </div>
    </div>
  );
}
