"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import SwitchStatusButton from "@/components/ui/SwitchStatusButton";
import DefaultPagination from "@/components/ui/pagination";
import { pageSize } from "@/constants";
import { Codev, InternalStatus } from "@/types/home/codev";
import { createClientClientComponent } from "@/utils/supabase/client";
import { Download, Link2, Mail } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@codevs/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@codevs/ui/table";

import { StatusBadge } from "../shared/StatusBadge";
import { columns } from "./columns";
import { EditableRow, Role } from "./EditableRow";
import { TableActions } from "./TableActions";
import { InHouseMobileTable } from "./InHouseMobileTable";

interface NdaEmailDialogProps {
  codev: Codev;
  onSendNdaEmail: (
    codevId: string,
    email: string,
    subject: string,
    message: string,
  ) => Promise<void>;
}

interface InHouseTableProps {
  data: Codev[];
  onDataChange: (updatedItem: Codev) => void;
  onDelete: (deletedId: string) => void;
  pagination: {
    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPreviousPage: () => void;
  };
}

// Default fallback image for team members without avatars
const defaultImage = "/assets/svgs/icon-codebility-black.svg";

/**
 * Returns appropriate color classes for NDA status display
 * @param status - Boolean indicating if NDA is signed
 * @returns CSS color classes for text styling
 */
const getNdaStatusColor = (status: boolean | null | undefined) => {
  if (status === true) return "text-green-600 dark:text-green-400";
  return "text-red-600 dark:text-red-400";
};

/**
 * Capitalizes first letter of each word in a string
 * @param str - Input string to capitalize
 * @returns Capitalized string or dash for empty values
 */
const capitalize = (str: string) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "-";

/**
 * Converts display position to uppercase format
 * Input → Output Examples:
 * "frontend developer" → "FRONTEND DEVELOPER"
 * "ui/ux designer" → "UI/UX DESIGNER"
 * @param position - Display position string
 * @returns Uppercase position or dash for empty values
 */
const formatDisplayPosition = (position: string | null | undefined): string => {
  if (!position || typeof position !== "string") return "-";
  return position.toUpperCase();
};

/**
 * NDA Email Button Component
 * Handles sending NDA signing requests to team members
 */
const SendNdaButton = ({ codev, onSendNdaEmail }: NdaEmailDialogProps) => {
  const [isSending, setIsSending] = useState(false);

  const handleSendEmail = async () => {
    try {
      setIsSending(true);
      const subject = "NDA Signing Request - Codebility Plus";
      const message = `Dear ${codev.first_name},\n\nPlease sign the Non-Disclosure Agreement by clicking on the link below:\n\n[NDA_LINK]\n\nThank you,\nCodebility Plus Team`;

      await onSendNdaEmail(codev.id, codev.email_address, subject, message);

      toast.success(`NDA signing request sent to ${codev.email_address}`);
    } catch (error) {
      console.error("Error sending NDA email:", error);
      toast.error("Failed to send NDA email. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="ml-2 text-customBlue-500 hover:text-customBlue-600 dark:text-customBlue-200 dark:hover:text-customBlue-300"
      onClick={handleSendEmail}
      disabled={isSending}
    >
      <Mail className="mr-1 h-4 w-4" />
      {isSending ? "Sending..." : "Send NDA"}
    </Button>
  );
};

/**
 * Main InHouseTable Component
 * Displays team member data with responsive design and inline editing
 */
export function InHouseTable({
  data,
  onDataChange,
  pagination,
  onDelete,
}: InHouseTableProps) {
  // Supabase client instance for database operations
  const [supabase, setSupabase] = useState<any>(null);
  
  // Inline editing state management
  const [editingId, setEditingId] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);

  // Calculate total pages for pagination component
  const totalPages = useMemo(() => Math.ceil(data.length / pageSize.applicants), [data.length]);

  // Initialize Supabase client on component mount
  useEffect(() => {
    const supabaseClient = createClientClientComponent();
    setSupabase(supabaseClient);
  }, []);

  // Fetch available roles for dropdown selection
  useEffect(() => {
    if (!supabase) return;

    async function fetchRoles() {
      const { data: rolesData, error } = await supabase
        .from("roles")
        .select("id, name");

      if (error) {
        console.error("Failed to fetch roles:", error);
      } else if (rolesData) {
        setRoles(rolesData);
      }
    }

    fetchRoles();
  }, [supabase]);

  /**
   * Handles member deletion from the table
   * @param deletedId - ID of the member to delete
   */
  const handleDelete = (deletedId: string) => {
    onDelete(deletedId);
  };

  /**
   * Sends NDA signing request email to team member
   * Creates unique token and database record for tracking
   */
  const handleSendNdaEmail = async (
    codevId: string,
    email: string,
    subject: string,
    message: string,
  ) => {
    try {
      // Generate unique token with 7-day expiration
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      // Store NDA request in database
      const { error: dbError } = await supabase.from("nda_requests").insert({
        codev_id: codevId,
        token: token,
        expires_at: expiresAt.toISOString(),
        status: "pending",
      });

      if (dbError) throw dbError;

      // Generate signing link for the email
      const signingLink = `${window.location.origin}/nda-signing/${token}`;
      const codevData = data.find((item) => item.id === codevId);

      // Send email via API endpoint
      const emailResponse = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipient: email,
          subject: subject,
          content: message,
          firstName: codevData?.first_name || "",
          ndaLink: signingLink,
          isNdaEmail: true,
        }),
      });

      if (!emailResponse.ok) {
        throw new Error(await emailResponse.text());
      }

      // Update local state to reflect sent status
      const updatedRow = {
        ...codevData!,
        nda_request_sent: true,
      };
      onDataChange(updatedRow);
    } catch (error) {
      console.error("Error sending NDA email:", error);
      throw error;
    }
  };

  /**
   * Downloads NDA document for signed members
   * @param codevId - ID of the member whose NDA to download
   */
  const handleDownloadNda = async (codevId: string) => {
    try {
      const { data, error } = await supabase
        .from("codev")
        .select("nda_document, first_name, last_name")
        .eq("id", codevId)
        .single();

      if (error || !data || !data.nda_document) {
        throw new Error("Failed to fetch NDA document");
      }

      // Create download link and trigger download
      const link = document.createElement("a");
      link.href = data.nda_document;
      link.download = `NDA_${data.first_name}_${data.last_name}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("NDA document downloaded successfully");
    } catch (error) {
      console.error("Error downloading NDA:", error);
      toast.error("Failed to download NDA document");
    }
  };

  // Pagination callback handlers
  const handleNextPage = useCallback(() => {
    if (pagination.currentPage < pagination.totalPages) {
      pagination.onNextPage();
    }
  }, [pagination]);

  const handlePreviousPage = useCallback(() => pagination.onPreviousPage(), [pagination]);

  /**
   * Advanced pagination handler for direct page navigation
   * Implements step-by-step navigation since direct page setting isn't available
   */
  const setCurrentPage = useCallback((pageOrFunction: number | ((page: number) => number)) => {
    const page =
      typeof pageOrFunction === "function"
        ? pageOrFunction(pagination.currentPage)
        : pageOrFunction;
    
    const targetPage = Math.max(1, Math.min(page, pagination.totalPages));
    const currentPage = pagination.currentPage;
    
    // Navigate step by step to target page
    if (targetPage > currentPage) {
      for (let i = currentPage; i < targetPage; i++) {
        pagination.onNextPage();
      }
    } else if (targetPage < currentPage) {
      for (let i = currentPage; i > targetPage; i--) {
        pagination.onPreviousPage();
      }
    }
  }, [pagination]);

  return (
    <div className="mb-4 space-y-4">
      {/* Mobile-optimized table for smaller screens */}
      <InHouseMobileTable
        data={data}
        onDataChange={onDataChange}
        onDelete={handleDelete}
        onEdit={setEditingId}
        roles={roles}
        handleSendNdaEmail={handleSendNdaEmail}
        handleDownloadNda={handleDownloadNda}
      />

      {/* Desktop Table Container - Hidden on mobile, visible on XL+ screens */}
      <div className="border-light-700 dark:border-dark-200 bg-light-300 dark:bg-dark-100 hidden rounded-lg border xl:block">
        <Table>
          {/* Table Header with responsive column visibility */}
          <TableHeader>
            <TableRow className="border-light-700 dark:border-dark-200 bg-light-200 dark:bg-dark-300 border-b">
              {columns.map((column) =>
                // Always visible columns for mobile compatibility
                column.key === "image_url" ||
                column.key === "first_name" ||
                column.key === "last_name" ||
                column.key === "email_address" ? (
                  <TableHead
                    key={column.key}
                    className="dark:text-light-900 px-2 py-3 text-sm font-semibold text-black"
                  >
                    {column.label}
                  </TableHead>
                ) : (
                  // Hidden on smaller screens, visible on 2XL+
                  <TableHead
                    key={column.key}
                    className="dark:text-light-900 hidden px-2 py-3 text-sm font-semibold text-black 2xl:table-cell"
                  >
                    {column.label}
                  </TableHead>
                ),
              )}

              {/* Responsive info column for mobile */}
              <TableHead className="dark:text-light-900 px-2 py-3 text-sm font-semibold text-black 2xl:hidden">
                Info
              </TableHead>
              <TableHead className="dark:text-light-900 px-2 py-3 text-sm font-semibold text-black">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* Table Body with conditional rendering for edit mode */}
          <TableBody>
            {data.map((item) =>
              editingId === item.id ? (
                // Edit mode: Show editable form row
                <EditableRow
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
                // Display mode: Show data with responsive layout
                <TableRow
                  key={item.id}
                  className="border-light-700 dark:border-dark-200 hover:bg-light-800 dark:hover:bg-dark-300 odd:dark:bg-dark-200 odd:bg-grey-100/10 border-b"
                >
                  {/* Avatar column - Always visible */}
                  <TableCell className="dark:text-light-900 px-2 py-2 text-base text-black">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <Image
                        src={item.image_url || defaultImage}
                        alt={`${item.first_name} avatar`}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TableCell>

                  {/* First Name column - Always visible */}
                  <TableCell className="dark:text-light-900 px-2 py-2 text-base text-black">
                    {capitalize(item.first_name)}
                  </TableCell>

                  {/* Last Name column - Always visible */}
                  <TableCell className="dark:text-light-900 px-2 py-2 text-base text-black">
                    {capitalize(item.last_name)}
                  </TableCell>

                  {/* Email column - Always visible */}
                  <TableCell className="dark:text-light-900 px-2 py-2 text-base text-black">
                    {item.email_address}
                  </TableCell>

                  {/* Mobile Info Dropdown - Hidden on 2XL+ screens */}
                  <TableCell className="dark:text-light-900 flex items-start justify-start px-2 py-2 text-base text-black 2xl:hidden">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <span className="cursor-pointer hover:text-gray-600">...</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>User Info</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          {/* Role information in dropdown */}
                          <DropdownMenuItem>
                            Role
                            <DropdownMenuShortcut>
                              {item.role_id
                                ? roles.find((role) => role.id === item.role_id)
                                    ?.name || "-"
                                : "-"}
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                          
                          {/* Display Position - Now with UPPERCASE formatting */}
                          <DropdownMenuItem>
                            Position
                            <DropdownMenuShortcut>
                              {formatDisplayPosition(item.display_position)}
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                          
                          {/* Projects submenu */}
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              Projects
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                {item.projects?.length ? (
                                  <DropdownMenuItem className="space-y-1">
                                    {item.projects.map((project) => (
                                      <div key={project.id}>{project.name}</div>
                                    ))}
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem>-</DropdownMenuItem>
                                )}
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          
                          {/* NDA Status submenu with action buttons */}
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              NDA Status
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem className="flex items-center gap-2">
                                  <span className={`${getNdaStatusColor(item.nda_status)}`}>
                                    {item.nda_status ? "Yes" : "No"}
                                  </span>

                                  {/* Conditional NDA action buttons */}
                                  {item.nda_status ? (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="ml-2 text-green-500 hover:text-green-600 dark:text-green-200 dark:hover:text-green-300"
                                      onClick={() => handleDownloadNda(item.id)}
                                    >
                                      <Download className="mr-1 h-4 w-4" />
                                      Download
                                    </Button>
                                  ) : item.nda_request_sent ? (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="ml-2 text-yellow-500 dark:text-yellow-200"
                                      disabled
                                    >
                                      <span className="mr-1">⏳</span>
                                      Pending
                                    </Button>
                                  ) : (
                                    <SendNdaButton
                                      codev={item}
                                      onSendNdaEmail={handleSendNdaEmail}
                                    />
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          
                          {/* Portfolio submenu */}
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              Portfolio
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem>
                                  {item.portfolio_website ? (
                                    <a
                                      href={item.portfolio_website}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center text-customBlue-500 hover:text-customBlue-600 dark:text-customBlue-200 dark:hover:text-customBlue-300"
                                    >
                                      <Link2 className="mr-1 h-4 w-4" />
                                      Portfolio
                                    </a>
                                  ) : (
                                    "-"
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        </DropdownMenuGroup>
                        
                        <DropdownMenuSeparator />
                        
                        {/* Additional status information */}
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            Status
                            <DropdownMenuShortcut>
                              <StatusBadge
                                status={item.internal_status as InternalStatus}
                              />
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem>
                            Date Joined
                            <DropdownMenuShortcut>
                              {item.date_joined 
                                ? new Date(item.date_joined).toLocaleDateString()
                                : "-"}
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem>
                            Availability Status
                            <DropdownMenuShortcut>
                              <SwitchStatusButton
                                disabled={false}
                                handleSwitch={() => {}}
                                isActive={item.availability_status ?? false}
                              />
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>

                  {/* Desktop-only columns - Hidden on smaller screens */}
                  
                  {/* Status Badge column */}
                  <TableCell className="hidden px-2 py-2 2xl:table-cell">
                    <StatusBadge
                      status={item.internal_status as InternalStatus}
                    />
                  </TableCell>

                  {/* Role column */}
                  <TableCell className="dark:text-light-900 hidden px-2 py-2 text-base text-black 2xl:table-cell">
                    {item.role_id
                      ? roles.find((role) => role.id === item.role_id)?.name || "-"
                      : "-"}
                  </TableCell>

                  {/* Display Position column - Now with UPPERCASE formatting */}
                  <TableCell className="dark:text-light-900 hidden px-2 py-2 text-base text-black 2xl:table-cell">
                    {formatDisplayPosition(item.display_position)}
                  </TableCell>

                  {/* Projects column */}
                  <TableCell className="dark:text-light-900 hidden px-2 py-2 text-base text-black 2xl:table-cell">
                    {item.projects?.length ? (
                      <div className="space-y-1">
                        {item.projects.map((project) => (
                          <div key={project.id}>{project.name}</div>
                        ))}
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>

                  {/* NDA Status column with action buttons */}
                  <TableCell className="dark:text-light-900 hidden px-2 py-2 text-base text-black 2xl:table-cell">
                    <div className="flex items-center gap-2">
                      <span className={`${getNdaStatusColor(item.nda_status)}`}>
                        {item.nda_status ? "Yes" : "No"}
                      </span>

                      {/* Conditional NDA action buttons */}
                      {item.nda_status ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-2 text-green-500 hover:text-green-600 dark:text-green-200 dark:hover:text-green-300"
                          onClick={() => handleDownloadNda(item.id)}
                        >
                          <Download className="mr-1 h-4 w-4" />
                          Download
                        </Button>
                      ) : item.nda_request_sent ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-2 text-yellow-500 dark:text-yellow-200"
                          disabled
                        >
                          <span className="mr-1">⏳</span>
                          Pending
                        </Button>
                      ) : (
                        <SendNdaButton
                          codev={item}
                          onSendNdaEmail={handleSendNdaEmail}
                        />
                      )}
                    </div>
                  </TableCell>

                  {/* Portfolio column */}
                  <TableCell className="dark:text-light-900 hidden px-2 py-2 text-base text-black 2xl:table-cell">
                    {item.portfolio_website ? (
                      <a
                        href={item.portfolio_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-customBlue-500 hover:text-customBlue-600 dark:text-customBlue-200 dark:hover:text-customBlue-300"
                      >
                        <Link2 className="mr-1 h-4 w-4" />
                        Portfolio
                      </a>
                    ) : (
                      "-"
                    )}
                  </TableCell>

                  {/* Date Joined column */}
                  <TableCell className="dark:text-light-900 hidden px-2 py-2 text-base text-black 2xl:table-cell">
                    {item.date_joined 
                      ? new Date(item.date_joined).toLocaleDateString()
                      : "-"}
                  </TableCell>

                  {/* Availability Status column */}
                  <TableCell className="dark:text-light-900 hidden px-2 py-2 text-base text-black 2xl:table-cell">
                    <SwitchStatusButton
                      disabled={false}
                      handleSwitch={() => {}}
                      isActive={item.availability_status ?? false}
                    />
                  </TableCell>

                  {/* Actions column - Always visible */}
                  <TableCell className="px-2 py-2">
                    <TableActions
                      item={item}
                      onEdit={() => setEditingId(item.id)}
                      onDelete={() => handleDelete(item.id)}
                    />
                  </TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls - Show when there are multiple pages */}
      <div className="relative w-full">
        {pagination.totalPages > 1 && (
          <DefaultPagination
            currentPage={pagination.currentPage}
            handleNextPage={handleNextPage}
            handlePreviousPage={handlePreviousPage}
            setCurrentPage={setCurrentPage}
            totalPages={pagination.totalPages}
          />
        )}
      </div>
    </div>
  );
}