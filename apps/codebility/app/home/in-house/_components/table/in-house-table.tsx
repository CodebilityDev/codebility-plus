"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Codev, InternalStatus } from "@/types/home/codev";
import { Link2 } from "lucide-react";

import { useSupabase } from "@codevs/supabase/hooks/use-supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@codevs/ui/table";

import { StatusBadge } from "../shared/status-badge";
import { columns } from "./columns";
import { EditableRow, Role } from "./editable-row";
import { TableActions } from "./table-actions";

// Removed TableFilters import because filters are removed

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

export function InHouseTable({
  data,
  onDataChange,
  pagination,
}: InHouseTableProps) {
  const supabase = useSupabase();

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

  // Local pagination state:
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // When data changes, you may optionally reset the page.
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  // Compute total pages from the full data.
  const totalPages = Math.ceil(data.length / pageSize);

  // Slice the full data for the current page.
  const paginatedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // Deleting logic (for local UI state)
  const handleDelete = (deletedId: string) => {
    onDataChange(data.filter((item) => item.id !== deletedId));
  };

  // Helper to capitalize names
  const capitalize = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "-";

  return (
    <div className="mb-4 space-y-4">
      {/* Table */}
      <div className="border-light-700 dark:border-dark-200 bg-light-300 dark:bg-dark-100 rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="border-light-700 dark:border-dark-200 hover:bg-light-800 dark:hover:bg-dark-200">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className="dark:text-light-900 text-base font-semibold text-black"
                >
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="dark:text-light-900 text-base font-semibold text-black">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.map((item) =>
              editingId === item.id ? (
                <EditableRow
                  key={item.id}
                  data={item}
                  onSave={(updated) => {
                    onDataChange(
                      data.map((d) => (d.id === updated.id ? updated : d)),
                    );
                    setEditingId(null);
                  }}
                  onCancel={() => setEditingId(null)}
                  roles={roles}
                />
              ) : (
                <TableRow
                  key={item.id}
                  className="border-light-700 dark:border-dark-200 hover:bg-light-800 dark:hover:bg-dark-200"
                >
                  <TableCell className="dark:text-light-900 text-base text-black">
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

                  <TableCell className="dark:text-light-900 text-base text-black">
                    {capitalize(item.first_name)}
                  </TableCell>

                  <TableCell className="dark:text-light-900 text-base text-black">
                    {capitalize(item.last_name)}
                  </TableCell>

                  <TableCell className="dark:text-light-900 text-base text-black">
                    {item.email_address}
                  </TableCell>

                  <TableCell>
                    <StatusBadge
                      status={item.internal_status as InternalStatus}
                    />
                  </TableCell>

                  {/* Display the role name – update if you have role data */}
                  <TableCell className="dark:text-light-900 text-base text-black">
                    {item.role_id
                      ? roles.find((role) => role.id === item.role_id)?.name ||
                        "-"
                      : "-"}
                  </TableCell>

                  <TableCell className="dark:text-light-900 text-base text-black">
                    {typeof item.display_position === "string"
                      ? capitalize(item.display_position)
                      : "-"}
                  </TableCell>

                  <TableCell className="dark:text-light-900 text-base text-black">
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

                  <TableCell className="dark:text-light-900 text-base text-black">
                    {item.nda_status ? "Yes" : "No"}
                  </TableCell>

                  <TableCell className="dark:text-light-900 text-base text-black">
                    {item.portfolio_website ? (
                      <a
                        href={item.portfolio_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-100 hover:text-blue-200"
                      >
                        <Link2 className="mr-1 h-4 w-4" />
                        Portfolio
                      </a>
                    ) : (
                      "-"
                    )}
                  </TableCell>

                  <TableCell>
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
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            onClick={pagination.onPreviousPage}
            disabled={pagination.currentPage === 1}
            className="text-light-900 hover:bg-dark-200 rounded px-4 py-2 text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-light-900 text-sm">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={pagination.onNextPage}
            disabled={pagination.currentPage === pagination.totalPages}
            className="text-light-900 hover:bg-dark-200 rounded px-4 py-2 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
