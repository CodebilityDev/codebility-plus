"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import SwitchStatusButton from "@/Components/ui/SwitchStatusButton";
import { Codev, InternalStatus } from "@/types/home/codev";
import { Download, Link2, Mail } from "lucide-react";
import { toast } from "react-hot-toast";

import { useSupabase } from "@codevs/supabase/hooks/use-supabase";
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
  onDataChange: (data: Codev[]) => void;
  pagination: {
    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPreviousPage: () => void;
  };
}

const defaultImage = "/assets/svgs/icon-codebility-black.svg";

// Add this function before the InHouseTable component
const getNdaStatusColor = (status: boolean | null | undefined) => {
  if (status === true) return "text-green-600 dark:text-green-400";
  return "text-red-600 dark:text-red-400";
};

// NDA Email Dialog Component
// Replace the NdaEmailDialog component with this SendNdaButton component
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
      className="ml-2 text-blue-500 hover:text-blue-600 dark:text-blue-200 dark:hover:text-blue-300"
      onClick={handleSendEmail}
      disabled={isSending}
    >
      <Mail className="mr-1 h-4 w-4" />
      {isSending ? "Sending..." : "Send NDA"}
    </Button>
  );
};

// Add this right after the component declaration
export function InHouseTable({
  data,
  onDataChange,
  pagination,
}: InHouseTableProps) {
  const supabase = useSupabase();
  
  // Debug log to check nda_request_sent values
  useEffect(() => {
    console.log("Data received in InHouseTable:", data.map(item => ({
      id: item.id,
      name: `${item.first_name} ${item.last_name}`,
      nda_request_sent: item.nda_request_sent
    })));
  }, [data]);

  // For inline editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);

  // Fetch roles when component mounts
  useEffect(() => {
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

  // Helper to handle item deletion in local state
  const handleDelete = (deletedId: string) => {
    onDataChange(data.filter((item) => item.id !== deletedId));
  };

  // Helper to capitalize names
  const capitalize = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "-";

  // Add this function to handle sending NDA email
  const handleSendNdaEmail = async (
    codevId: string,
    email: string,
    subject: string,
    message: string,
  ) => {
    try {
      // Generate a unique token for this NDA request
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Token expires in 7 days

      
      console.log("Sending NDA email to:", email, "for codev ID:", codevId);
      
      // Save the NDA request to the database
      const { error: dbError } = await supabase
        .from("nda_requests")
        .insert({
          codev_id: codevId,
          token: token,
          expires_at: expiresAt.toISOString(),
          status: "pending"
        });
        
      if (dbError) {
        console.error("Error inserting NDA request:", dbError);
        throw dbError;
      }
      
    
      // Save the NDA request to the database
      // const { error: dbError } = await supabase.from("nda_requests").insert({
      //   codev_id: codevId,
      //   token: token,
      //   expires_at: expiresAt.toISOString(),
      //   status: "pending",
      // });

      if (dbError) throw dbError;

      // Generate the NDA signing link
      const signingLink = `${window.location.origin}/nda-signing/${token}`;


      // Find the codev from the data array using codevId
      const codevData = data.find((item) => item.id === codevId);

      // Use the local API route instead of Supabase Edge Function
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
        const errorText = await emailResponse.text();
        console.error("Email API error:", errorText);
        throw new Error(errorText);
      }
      
      console.log("Email sent successfully, updating codev record");
      
      // Update the codev record in the database to mark NDA request as sent
      const { data: updateData, error: updateError } = await supabase
        .from("codev")
        .update({ nda_request_sent: true })
        .eq("id", codevId)
        .select();
        
      if (updateError) {
        console.error("Error updating codev record:", updateError);
        throw updateError;
      }

      
      console.log("Codev record updated:", updateData);
      
      // Create a new array with the updated item
      const updatedData = data.map(item => {
        if (item.id === codevId) {
          // Create a new object with all existing properties plus the updated one
          return {
            ...item,
            nda_request_sent: true
          };
        }
        return item;
      });
      
      // Update the state with the new array
      onDataChange(updatedData);
      
      // Force a re-render by logging the updated data
      console.log("Updated local state:", updatedData.find(item => item.id === codevId));


      // Update the codev's status in the local state
      onDataChange(
        data.map((item) =>
          item.id === codevId
            ? ({ ...item, nda_request_sent: true } as Codev)
            : item,
        ),
      );

    } catch (error) {
      console.error("Error sending NDA email:", error);
      throw error;
    }
  };

  // Add this function to handle downloading NDA document
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

      // Create a link element to download the PDF
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

  return (
    <div className="mb-4 space-y-4">
      {/* Table Container */}
      <div className="border-light-700 dark:border-dark-200 bg-light-300 dark:bg-dark-100 rounded-lg border">
        <Table>
          {/* Table Header */}
          <TableHeader>
            <TableRow className="border-light-700 dark:border-dark-200 bg-light-200 dark:bg-dark-300 border-b">
              {columns.map((column) =>
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
                  <TableHead
                    key={column.key}
                    className="dark:text-light-900 hidden px-2 py-3 text-sm font-semibold text-black 2xl:table-cell"
                  >
                    {column.label}
                  </TableHead>
                ),
              )}

              <TableHead className="dark:text-light-900 px-2 py-3 text-sm font-semibold text-black 2xl:hidden">
                Info
              </TableHead>
              <TableHead className="dark:text-light-900 px-2 py-3 text-sm font-semibold text-black">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody>
            {data.map((item) =>
              editingId === item.id ? (
                <EditableRow
                  key={item.id}
                  data={item}
                  onSave={(updatedItem) => {
                    // Update local data
                    onDataChange(
                      data.map((d) =>
                        d.id === updatedItem.id ? updatedItem : d,
                      ),
                    );
                    setEditingId(null);
                  }}
                  onCancel={() => setEditingId(null)}
                  roles={roles}
                />
              ) : (
                <TableRow
                  key={item.id}
                  className="border-light-700 dark:border-dark-200 hover:bg-light-800 dark:hover:bg-dark-300 border-b"
                >
                  <TableCell className="dark:text-light-900 px-2 py-2 text-base text-black">
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

                  <TableCell className="dark:text-light-900 px-2 py-2 text-base text-black">
                    {capitalize(item.first_name)}
                  </TableCell>

                  <TableCell className="dark:text-light-900 px-2 py-2 text-base text-black">
                    {capitalize(item.last_name)}
                  </TableCell>

                  <TableCell className="dark:text-light-900 px-2 py-2 text-base text-black">
                    {item.email_address}
                  </TableCell>

                  {/* Available only on xs, sm, md screens  */}
                  <TableCell className="dark:text-light-900 flex items-start justify-start px-2 py-2 text-base text-black 2xl:hidden">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <span>...</span>
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
                                  {/* NDA status display */}
                                  <span
                                    className={`${getNdaStatusColor(item.nda_status)}`}
                                  >
                                    {item.nda_status ? "Yes" : "No"}
                                  </span>

                                  {/* Conditional buttons based on NDA status */}
                                  {item.nda_status ? (
                                    // If NDA is signed, show download button
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
                                    // If NDA request is sent but not signed yet, show pending button
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
                                    // If no NDA request sent, show send button
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

                  <TableCell className="hidden px-2 py-2 2xl:table-cell">
                    <StatusBadge
                      status={item.internal_status as InternalStatus}
                    />
                  </TableCell>

                  <TableCell className="dark:text-light-900 hidden px-2 py-2 text-base text-black 2xl:table-cell">
                    {item.role_id
                      ? roles.find((role) => role.id === item.role_id)?.name ||
                        "-"
                      : "-"}
                  </TableCell>

                  <TableCell className="dark:text-light-900 hidden px-2 py-2 text-base text-black 2xl:table-cell">
                    {typeof item.display_position === "string"
                      ? capitalize(item.display_position)
                      : "-"}
                  </TableCell>

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

                  <TableCell className="dark:text-light-900 hidden px-2 py-2 text-base text-black 2xl:table-cell">
                    <div className="flex items-center gap-2">
                      {/* NDA status display */}
                      <span className={`${getNdaStatusColor(item.nda_status)}`}>
                        {item.nda_status ? "Yes" : "No"}
                      </span>

                      {/* Conditional buttons based on NDA status */}
                      {item.nda_status ? (
                        // If NDA is signed, show download button
                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-2 text-green-500 hover:text-green-600 dark:text-green-200 dark:hover:text-green-300"
                          onClick={() => handleDownloadNda(item.id)}
                        >
                          <Download className="mr-1 h-4 w-4" />
                          Download
                        </Button>

                      ) : (
                        // Check if nda_request_sent is true, otherwise show send button
                        // Add a check for undefined and default to false
                        (item.nda_request_sent === true) ? (
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
                        )

                      ) : item.nda_request_sent ? (
                        // If NDA request is sent but not signed yet, show pending button
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
                        // If no NDA request sent, show send button
                        <SendNdaButton
                          codev={item}
                          onSendNdaEmail={handleSendNdaEmail}
                        />

                      )}
                    </div>
                  </TableCell>

                  <TableCell className="dark:text-light-900 hidden px-2 py-2 text-base text-black 2xl:table-cell">
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

                  <TableCell className="dark:text-light-900 hidden px-2 py-2 text-base text-black 2xl:table-cell">
                    <SwitchStatusButton
                      disabled={false}
                      handleSwitch={() => {}}
                      isActive={item.availability_status ?? false}
                    />
                  </TableCell>

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

      {/* Pagination Controls */}
      {pagination && data.length > 0 && (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={pagination.onPreviousPage}
            disabled={pagination.currentPage === 1}
            className="hover:bg-light-200 dark:text-light-900 dark:hover:bg-dark-300 rounded px-4 py-2 text-sm text-black disabled:opacity-50"
          >
            Previous
          </button>
          <span className="dark:text-light-900 text-sm text-black">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={pagination.onNextPage}
            disabled={pagination.currentPage === pagination.totalPages}
            className="hover:bg-light-200 dark:text-light-900 dark:hover:bg-dark-300 rounded px-4 py-2 text-sm text-black disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
