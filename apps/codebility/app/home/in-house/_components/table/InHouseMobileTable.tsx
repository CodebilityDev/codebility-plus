"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SwitchStatusButton from "@/components/ui/SwitchStatusButton";
import { Codev, InternalStatus } from "@/types/home/codev";
import { Download, Link2, Mail, MoreVertical } from "lucide-react";

import { Button } from "@codevs/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";

import { StatusBadge } from "../shared/StatusBadge";
import { MobileEditableForm } from "./MobileEditableForm";
import { TableActions } from "./TableActions";

interface InHouseMobileTableProps {
  data: Codev[];
  onDataChange: (updatedItem: Codev) => void;
  onDelete: (deletedId: string) => void;
  onEdit?: (id: string) => void;
  roles: { id: number; name: string }[];
  handleSendNdaEmail: (
    codevId: string,
    email: string,
    subject: string,
    message: string,
  ) => Promise<void>;
  handleDownloadNda: (codevId: string) => void;
}

const defaultImage = "/assets/svgs/icon-codebility-black.svg";

const getNdaStatusColor = (status: boolean | null | undefined) => {
  if (status === true) return "text-green-600 dark:text-green-400";
  return "text-red-600 dark:text-red-400";
};

const SendNdaButton = ({
  codev,
  onSendNdaEmail,
}: {
  codev: Codev;
  onSendNdaEmail: (
    codevId: string,
    email: string,
    subject: string,
    message: string,
  ) => Promise<void>;
}) => {
  const [isSending, setIsSending] = useState(false);

  const handleSendEmail = async () => {
    try {
      setIsSending(true);
      const subject = "NDA Signing Request - Codebility Plus";
      const message = `Dear ${codev.first_name},\n\nPlease sign the Non-Disclosure Agreement by clicking on the link below:\n\n[NDA_LINK]\n\nThank you,\nCodebility Plus Team`;

      await onSendNdaEmail(codev.id, codev.email_address, subject, message);
    } catch (error) {
      console.error("Error sending NDA email:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-6 px-2 text-xs text-blue-500 hover:text-blue-600 dark:text-blue-200 dark:hover:text-blue-300"
      onClick={handleSendEmail}
      disabled={isSending}
    >
      <Mail className="mr-1 h-3 w-3" />
      {isSending ? "..." : "Send"}
    </Button>
  );
};

// Helper to capitalize names
const capitalize = (str: string) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "-";

export function InHouseMobileTable({
  data,
  onDataChange,
  onDelete,
  onEdit,
  roles,
  handleSendNdaEmail,
  handleDownloadNda,
}: InHouseMobileTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="block space-y-2 xl:hidden">
      {data.map((item) =>
        editingId === item.id ? (
          <MobileEditableForm
            key={item.id}
            data={item}
            onSave={(updatedItem) => {
              onDataChange(updatedItem);
              setEditingId(null);
            }}
            onCancel={() => setEditingId(null)}
            roles={roles}
          />
        ) : (
          <div
            key={item.id}
            className="border-light-700 bg-light-300 dark:border-dark-200 dark:bg-dark-100 rounded-lg border p-3 shadow-sm"
          >
            {/* Compact header with photo, name, status, and actions */}
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <Image
                    src={item.image_url || defaultImage}
                    alt={`${item.first_name} avatar`}
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="dark:text-light-900 truncate text-sm font-semibold text-black">
                    {capitalize(item.first_name)} {capitalize(item.last_name)}
                  </h3>
                  <p className="dark:text-light-700 truncate text-xs text-gray-700">
                    {item.email_address}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status={item.internal_status as InternalStatus} />
                <TableActions
                  item={item}
                  onEdit={() => setEditingId(item.id)}
                  onDelete={() => onDelete(item.id)}
                />
              </div>
            </div>

            {/* Compact info grid */}
            <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
              {/* Position */}
              <div>
                <span className="dark:text-light-700 font-medium text-gray-700 ">
                  Position:
                </span>
                <p className="dark:text-light-900 mt-0.5 text-black">
                  {typeof item.display_position === "string"
                    ? capitalize(item.display_position)
                    : "-"}
                </p>
              </div>

              {/* Role */}
              <div>
                <span className="dark:text-light-700 font-medium text-gray-700 ">
                  Role:
                </span>
                <p className="dark:text-light-900 mt-0.5 text-black">
                  {item.role_id
                    ? roles.find((role) => role.id === item.role_id)?.name ||
                      "-"
                    : "-"}
                </p>
              </div>

              {/* Available */}
              <div>
                <span className="dark:text-light-700 font-medium text-gray-700 ">
                  Available:
                </span>
                <div className="mt-0.5">
                  <SwitchStatusButton
                    disabled={false}
                    handleSwitch={() => {}}
                    isActive={item.availability_status ?? false}
                  />
                </div>
              </div>

              {/* NDA Status */}
              <div>
                <span className="dark:text-light-700 font-medium text-gray-700 ">
                  NDA:
                </span>
                <p
                  className={`mt-0.5 font-medium ${getNdaStatusColor(item.nda_status)}`}
                >
                  {item.nda_status ? "✓" : "✗"}
                </p>
              </div>

              {/* Portfolio */}
              <div>
                <span className="dark:text-light-700 font-medium text-gray-700 ">
                  Portfolio:
                </span>
                <div className="mt-0.5">
                  {item.portfolio_website ? (
                    <a
                      href={item.portfolio_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600 dark:text-blue-200 dark:hover:text-blue-300"
                    >
                      <Link2 className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-gray-700 dark:text-gray-500">-</span>
                  )}
                </div>
              </div>

              {/* Date Joined */}
              <div>
                <span className="dark:text-light-700 font-medium text-gray-700 ">
                  Joined:
                </span>
                <p className="dark:text-light-900 mt-0.5 text-black">
                  {item.date_joined
                    ? new Date(item.date_joined).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "2-digit",
                      })
                    : "-"}
                </p>
              </div>
            </div>

            {/* Projects and NDA actions - only show if needed */}
            {((item.projects && item.projects.length > 0) ||
              !item.nda_status) && (
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 pt-2 dark:border-gray-700">
                {/* Projects */}
                {item.projects && item.projects.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.projects.slice(0, 2).map((project) => (
                      <span
                        key={project.id}
                        className="rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {project.name}
                      </span>
                    ))}
                    {item.projects.length > 2 && (
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                        +{item.projects.length - 2}
                      </span>
                    )}
                  </div>
                )}

                {/* NDA Actions */}
                {!item.nda_status && (
                  <div className="ml-auto">
                    {item.nda_request_sent ? (
                      <span className="text-xs text-yellow-500 dark:text-yellow-200">
                        ⏳ Pending
                      </span>
                    ) : (
                      <SendNdaButton
                        codev={item}
                        onSendNdaEmail={handleSendNdaEmail}
                      />
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ),
      )}
    </div>
  );
}
