import { useState } from "react";
import Image from "next/image";
import { Codev } from "@/types/home/codev";
import { Link2 } from "lucide-react";

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
import { EditableRow } from "./editable-row";
import { TableActions } from "./table-actions";
import { TableFilters } from "./table-filters";

interface InHouseTableProps {
  data: Codev[];
  onDataChange: (data: Codev[]) => void;
  pagination?: {
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: "",
    type: "",
    position: "",
    project: "",
  });

  // Filter data
  const filteredData = data.filter((item) => {
    if (filters.status && item.internal_status !== filters.status) return false;
    if (filters.type && item.type !== filters.type) return false;
    if (filters.position && item.main_position !== filters.position)
      return false;
    if (
      filters.project &&
      !item.projects?.some((project) => project.id === filters.project)
    ) {
      return false;
    }
    return true;
  });

  const handleDelete = (deletedId: string) => {
    onDataChange(data.filter((item) => item.id !== deletedId));
  };

  const capitalize = (str: string) => {
    return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
  };

  return (
    <div className="space-y-4">
      {/* Count and Filters */}
      <div className="flex items-center justify-between">
        <p className="dark:text-light-900 text-sm text-black">
          {filteredData.length}{" "}
          {filteredData.length === 1 ? "member" : "members"}
        </p>
      </div>

      <TableFilters
        filters={filters}
        onFilterChange={(key, value) =>
          setFilters((prev) => ({ ...prev, [key]: value }))
        }
      />

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
            {filteredData.map((item) =>
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
                />
              ) : (
                <TableRow
                  key={item.id}
                  className="border-light-700 dark:border-dark-200 hover:bg-light-800 dark:hover:bg-dark-200"
                >
                  <TableCell className="dark:text-light-900 text-base text-black">
                    <Image
                      src={item.image_url || defaultImage}
                      alt={`${item.first_name} avatar`}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </TableCell>
                  <TableCell className="dark:text-light-900 text-base text-black">
                    {capitalize(item.first_name)}
                  </TableCell>
                  <TableCell className="dark:text-light-900 text-base text-black">
                    {capitalize(item.last_name)}
                  </TableCell>
                  <TableCell className="dark:text-light-900 text-base text-black">
                    {item.email}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={item.internal_status} />
                  </TableCell>
                  <TableCell className="dark:text-light-900 text-base text-black">
                    {capitalize(item.type || "")}
                  </TableCell>
                  <TableCell className="dark:text-light-900 text-base text-black">
                    {item.main_position}
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
                    {item.nda_status ? capitalize(item.nda_status) : "-"}
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

      {/* Pagination */}
      {pagination && filteredData.length > 0 && (
        <div className="flex items-center justify-between">
          <button
            onClick={pagination.onPreviousPage}
            disabled={pagination.currentPage === 1}
            className="dark:text-light-900 dark:hover:text-light-900/80 hover:bg-light-800 dark:hover:bg-dark-200 rounded px-3 py-1 text-sm text-black hover:text-black/80 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="dark:text-light-900 text-sm text-black">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={pagination.onNextPage}
            disabled={pagination.currentPage === pagination.totalPages}
            className="dark:text-light-900 dark:hover:text-light-900/80 hover:bg-light-800 dark:hover:bg-dark-200 rounded px-3 py-1 text-sm text-black hover:text-black/80 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
