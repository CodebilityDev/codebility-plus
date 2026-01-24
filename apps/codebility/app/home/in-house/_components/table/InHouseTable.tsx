// app/home/in-house/_components/table/InHouseTable.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import SwitchStatusButton from "@/components/ui/SwitchStatusButton";
import DefaultPagination from "@/components/ui/pagination";
import { pageSize } from "@/constants";
import { Codev, InternalStatus } from "@/types/home/codev";
import { createClientClientComponent } from "@/utils/supabase/client";
import { ArrowUpDown, Download, Link2, Mail } from "lucide-react";
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
  sortConfig?: {
    key: "date_joined" | "display_position" | null;
    direction: "asc" | "desc";
  };
  onSort?: (key: "date_joined" | "display_position") => void;
}

const defaultImage = "/assets/svgs/icon-codebility-black.svg";

const getNdaStatusColor = (status: boolean | null | undefined) => {
  if (status === true) return "text-green-600 dark:text-green-400";
  return "text-red-600 dark:text-red-400";
};

const capitalize = (str: string) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "-";

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
      className="ml-1 text-xs text-customBlue-500 hover:text-customBlue-600 dark:text-customBlue-200 dark:hover:text-customBlue-300"
      onClick={handleSendEmail}
      disabled={isSending}
    >
      <Mail className="mr-1 h-3 w-3" />
      {isSending ? "Sending..." : "Send NDA"}
    </Button>
  );
};

/**
 * ENHANCED InHouseTable - Team Lead Feedback Applied
 * 
 * CHANGES:
 * 1. First 3 columns spacing: px-2 → px-6 (+300%)
 * 2. Email column spacing: px-2 → px-5 (+150%)
 * 3. Other columns spacing: px-2 → px-4 (+100%)
 * 4. Button text: "Sig" → "Signature" (full word)
 * 5. Horizontal scroll enabled: overflow-x-auto
 * 6. Headers: font-semibold → font-bold
 */
export function InHouseTable({
  data,
  onDataChange,
  pagination,
  onDelete,
  sortConfig,
  onSort,
}: InHouseTableProps) {
  const [supabase, setSupabase] = useState<any>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);

  const totalPages = useMemo(
    () => Math.ceil(data.length / pageSize.applicants),
    [data.length],
  );

  useEffect(() => {
    const supabaseClient = createClientClientComponent();
    setSupabase(supabaseClient);
  }, []);

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

  const handleDelete = (deletedId: string) => {
    onDelete(deletedId);
  };

  const handleSendNdaEmail = async (
    codevId: string,
    email: string,
    subject: string,
    message: string,
  ) => {
    try {
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const { error: dbError } = await supabase.from("nda_requests").insert({
        codev_id: codevId,
        token: token,
        expires_at: expiresAt.toISOString(),
        status: "pending",
      });

      if (dbError) throw dbError;

      const signingLink = `${window.location.origin}/nda-signing/${token}`;
      const codevData = data.find((item) => item.id === codevId);

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

  const handleDownloadNda = async (codevId: string) => {
    try {
      const { data, error } = await supabase
        .from("codev")
        .select("nda_document, nda_signature, first_name, last_name")
        .eq("id", codevId)
        .single();

      if (error || !data) {
        throw new Error("Failed to fetch member data");
      }

      if (!data.nda_document) {
        throw new Error("No signed NDA document found for this member");
      }

      const response = await fetch(data.nda_document);
      if (!response.ok) {
        throw new Error("Failed to download NDA document");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `NDA_${data.first_name}_${data.last_name}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("NDA document downloaded successfully");
    } catch (error) {
      console.error("Error downloading NDA:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to download NDA document",
      );
    }
  };

  const handleDownloadSignature = async (codevId: string) => {
    try {
      const { data, error } = await supabase
        .from("codev")
        .select("nda_signature, first_name, last_name")
        .eq("id", codevId)
        .single();

      if (error || !data || !data.nda_signature) {
        throw new Error("No signature found for this member");
      }

      const response = await fetch(data.nda_signature);
      if (!response.ok) {
        throw new Error("Failed to download signature");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Signature_${data.first_name}_${data.last_name}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Signature downloaded successfully");
    } catch (error) {
      console.error("Error downloading signature:", error);
      toast.error("Failed to download signature");
    }
  };

  const handleNextPage = useCallback(() => {
    if (pagination.currentPage < pagination.totalPages) {
      pagination.onNextPage();
    }
  }, [pagination]);

  const handlePreviousPage = useCallback(
    () => pagination.onPreviousPage(),
    [pagination],
  );

  const SortIndicator = ({
    columnKey,
  }: {
    columnKey: "date_joined" | "display_position";
  }) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ArrowUpDown className="ml-1 inline h-3 w-3 opacity-30" />;
    }
    return (
      <span className="ml-1 inline">
        {sortConfig.direction === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  const setCurrentPage = useCallback(
    (pageOrFunction: number | ((page: number) => number)) => {
      const page =
        typeof pageOrFunction === "function"
          ? pageOrFunction(pagination.currentPage)
          : pageOrFunction;

      const targetPage = Math.max(1, Math.min(page, pagination.totalPages));
      const currentPage = pagination.currentPage;

      if (targetPage > currentPage) {
        for (let i = currentPage; i < targetPage; i++) {
          pagination.onNextPage();
        }
      } else if (targetPage < currentPage) {
        for (let i = currentPage; i > targetPage; i--) {
          pagination.onPreviousPage();
        }
      }
    },
    [pagination],
  );

  return (
    <div className="mb-4 space-y-4">
      <InHouseMobileTable
        data={data}
        onDataChange={onDataChange}
        onDelete={handleDelete}
        onEdit={setEditingId}
        roles={roles}
        handleSendNdaEmail={handleSendNdaEmail}
        handleDownloadNda={handleDownloadNda}
        sortConfig={sortConfig}
        onSort={onSort}
      />

      {/* ENHANCED: Added overflow-x-auto for horizontal scroll */}
      <div className="border-light-700 dark:border-dark-200 bg-light-300 dark:bg-dark-100 hidden overflow-x-auto rounded-lg border xl:block">
        <Table>
          <TableHeader>
            <TableRow className="border-light-700 dark:border-dark-200 bg-light-200 dark:bg-dark-300 border-b">
              {columns.map((column) =>
                column.key === "image_url" ||
                column.key === "first_name" ||
                column.key === "last_name" ? (
                  /* ENHANCED: First 3 columns px-2 → px-6, font-semibold → font-bold */
                  <TableHead
                    key={column.key}
                    className="dark:text-light-900 px-6 py-3 text-sm font-bold text-black"
                  >
                    {column.label}
                  </TableHead>
                ) : column.key === "email_address" ? (
                  /* ENHANCED: Email column px-2 → px-5 */
                  <TableHead
                    key={column.key}
                    className="dark:text-light-900 px-5 py-3 text-sm font-bold text-black"
                  >
                    {column.label}
                  </TableHead>
                ) : column.key === "display_position" ||
                  column.key === "date_joined" ? (
                  /* ENHANCED: Sortable columns px-2 → px-4 */
                  <TableHead
                    key={column.key}
                    className="dark:text-light-900 hidden cursor-pointer px-4 py-3 text-sm font-bold text-black hover:bg-light-700 dark:hover:bg-dark-400 2xl:table-cell"
                    onClick={() =>
                      onSort?.(column.key as "date_joined" | "display_position")
                    }
                  >
                    {column.label}
                    <SortIndicator
                      columnKey={column.key as "date_joined" | "display_position"}
                    />
                  </TableHead>
                ) : (
                  /* ENHANCED: Other columns px-2 → px-4 */
                  <TableHead
                    key={column.key}
                    className="dark:text-light-900 hidden px-4 py-3 text-sm font-bold text-black 2xl:table-cell"
                  >
                    {column.label}
                  </TableHead>
                ),
              )}

              <TableHead className="dark:text-light-900 px-4 py-3 text-sm font-bold text-black 2xl:hidden">
                Info
              </TableHead>
              <TableHead className="dark:text-light-900 px-4 py-3 text-sm font-bold text-black">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((item) =>
              editingId === item.id ? (
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
                <TableRow
                  key={item.id}
                  className="border-light-700 dark:border-dark-200 hover:bg-light-800 dark:hover:bg-dark-300 odd:dark:bg-dark-200 odd:bg-grey-100/10 border-b"
                >
                  {/* ENHANCED: Avatar px-2 → px-6 */}
                  <TableCell className="dark:text-light-900 px-6 py-3 text-base text-black">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <Image
                        src={item.image_url || defaultImage}
                        alt={`${item.first_name} avatar`}
                        width={40}
                        height={40}
                        unoptimized={true}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TableCell>

                  {/* ENHANCED: First Name px-2 → px-6 */}
                  <TableCell className="dark:text-light-900 px-6 py-3 text-base text-black">
                    {capitalize(item.first_name)}
                  </TableCell>

                  {/* ENHANCED: Last Name px-2 → px-6 */}
                  <TableCell className="dark:text-light-900 px-6 py-3 text-base text-black">
                    {capitalize(item.last_name)}
                  </TableCell>

                  {/* ENHANCED: Email px-2 → px-5 */}
                  <TableCell className="dark:text-light-900 px-5 py-3 text-base text-black">
                    {item.email_address}
                  </TableCell>

                  {/* Mobile Info Dropdown - ENHANCED: px-2 → px-4 */}
                  <TableCell className="dark:text-light-900 flex items-start justify-start px-4 py-3 text-base text-black 2xl:hidden">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <span className="cursor-pointer hover:text-gray-600">
                          ⋯
                        </span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Users Info</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            Role
                            <DropdownMenuShortcut>
                              {item.role_id
                                ? roles.find((role) => role.id === item.role_id)
                                    ?.name || "-"
                                : "-"}
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Position
                            <DropdownMenuShortcut>
                              {typeof item.display_position === "string"
                                ? capitalize(item.display_position)
                                : "-"}
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
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
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              NDA Status
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem className="flex items-center gap-2">
                                  <span
                                    className={`${getNdaStatusColor(item.nda_status)}`}
                                  >
                                    {item.nda_status ? "Yes" : "No"}
                                  </span>

                                  {item.nda_status ? (
                                    <div className="flex gap-1">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-green-500 hover:text-green-600 dark:text-green-200 dark:hover:text-green-300"
                                        onClick={() => handleDownloadNda(item.id)}
                                      >
                                        <Download className="mr-1 h-3 w-3" />
                                        PDF
                                      </Button>
                                      {/* CHANGED: "Sig" → "Signature" */}
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-blue-500 hover:text-blue-600 dark:text-blue-200 dark:hover:text-blue-300"
                                        onClick={() =>
                                          handleDownloadSignature(item.id)
                                        }
                                      >
                                        <Download className="mr-1 h-3 w-3" />
                                        Signature
                                      </Button>
                                    </div>
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
                                      className="inline-flex items-center text-blue-500 hover:text-blue-600 dark:text-blue-200 dark:hover:text-blue-300"
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

                  {/* ENHANCED: All desktop columns px-2 → px-4 */}
                  <TableCell className="hidden px-4 py-3 2xl:table-cell">
                    <StatusBadge
                      status={item.internal_status as InternalStatus}
                    />
                  </TableCell>

                  <TableCell className="dark:text-light-900 hidden px-4 py-3 text-base text-black 2xl:table-cell">
                    {item.role_id
                      ? roles.find((role) => role.id === item.role_id)?.name ||
                        "-"
                      : "-"}
                  </TableCell>

                  <TableCell className="dark:text-light-900 hidden px-4 py-3 text-base text-black 2xl:table-cell">
                    {typeof item.display_position === "string"
                      ? capitalize(item.display_position)
                      : "-"}
                  </TableCell>

                  <TableCell className="dark:text-light-900 hidden px-4 py-3 text-base text-black 2xl:table-cell">
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

                  {/* ENHANCED: NDA Status column with "Signature" full word */}
                  <TableCell className="dark:text-light-900 hidden px-4 py-3 text-base text-black 2xl:table-cell">
                    <div className="flex items-center gap-2">
                      <span className={`${getNdaStatusColor(item.nda_status)}`}>
                        {item.nda_status ? "Yes" : "No"}
                      </span>

                      {item.nda_status ? (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs text-green-500 hover:text-green-600 dark:text-green-200 dark:hover:text-green-300"
                            onClick={() => handleDownloadNda(item.id)}
                          >
                            <Download className="mr-1 h-3 w-3" />
                            PDF
                          </Button>
                          {/* CHANGED: "Sig" → "Signature" */}
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-200 dark:hover:text-blue-300"
                            onClick={() => handleDownloadSignature(item.id)}
                          >
                            <Download className="mr-1 h-3 w-3" />
                            Signature
                          </Button>
                        </div>
                      ) : item.nda_request_sent ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-2 text-xs text-yellow-500 dark:text-yellow-200"
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

                  <TableCell className="dark:text-light-900 hidden px-4 py-3 text-base text-black 2xl:table-cell">
                    {item.portfolio_website ? (
                      <a
                        href={item.portfolio_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-500 hover:text-blue-600 dark:text-blue-200 dark:hover:text-blue-300"
                      >
                        <Link2 className="mr-1 h-4 w-4" />
                        Portfolio
                      </a>
                    ) : (
                      "-"
                    )}
                  </TableCell>

                  <TableCell className="dark:text-light-900 hidden px-4 py-3 text-base text-black 2xl:table-cell">
                    {item.date_joined
                      ? new Date(item.date_joined).toLocaleDateString()
                      : "-"}
                  </TableCell>

                  <TableCell className="dark:text-light-900 hidden px-4 py-3 text-base text-black 2xl:table-cell">
                    <SwitchStatusButton
                      disabled={false}
                      handleSwitch={() => {}}
                      isActive={item.availability_status ?? false}
                    />
                  </TableCell>

                  <TableCell className="px-4 py-3">
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

      {pagination && data.length > 0 && (
        <div className="relative w-full">
          {data.length > pageSize.applicants && (
            <DefaultPagination
              currentPage={pagination.currentPage}
              handleNextPage={handleNextPage}
              handlePreviousPage={handlePreviousPage}
              setCurrentPage={setCurrentPage}
              totalPages={pagination.totalPages}
            />
          )}
        </div>
      )}
    </div>
  );
}