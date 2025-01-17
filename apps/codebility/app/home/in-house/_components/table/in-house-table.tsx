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
  });

  // Filter data
  const filteredData = data.filter((item) => {
    if (filters.status && item.internal_status !== filters.status) return false;
    if (filters.type && item.type !== filters.type) return false;
    if (filters.position && item.main_position !== filters.position)
      return false;
    return true;
  });
  console.log("filteredData:", filteredData);

  // Status color mapping
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      AVAILABLE: "text-codeGreen",
      DEPLOYED: "text-codeViolet",
      TRAINING: "text-codeYellow",
      VACATION: "text-codeBlue",
      BUSY: "text-codeRed",
      CLIENT_READY: "text-codePurple",
    };
    return colors[status] || "text-light-900";
  };

  const capitalize = (str: string) => {
    return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
  };

  return (
    <div className="space-y-4">
      {/* Items count */}
      <div className="flex items-center justify-between">
        <p className="text-light-900 text-sm">
          {filteredData.length} {filteredData.length === 1 ? "item" : "items"}
        </p>
      </div>

      {/* Filters */}
      <TableFilters
        filters={filters}
        onFilterChange={(key, value) =>
          setFilters((prev) => ({ ...prev, [key]: value }))
        }
      />

      {/* Table */}
      <div className="border-dark-200 bg-dark-100 rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="border-dark-200 hover:bg-dark-200">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className="text-light-900 text-base font-semibold"
                >
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="text-light-900 text-base font-semibold">
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
                  className="border-dark-200 hover:bg-dark-200"
                >
                  <TableCell className="text-light-900 text-base">
                    <Image
                      src={
                        item.image_url ||
                        "/assets/svgs/icon-codebility-black.svg"
                      }
                      alt={`${item.first_name} avatar`}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </TableCell>
                  <TableCell className="text-light-900 text-base">
                    {capitalize(item.first_name)}
                  </TableCell>
                  <TableCell className="text-light-900 text-base">
                    {capitalize(item.last_name)}
                  </TableCell>
                  <TableCell className="text-light-900 text-base">
                    {item.email}
                  </TableCell>
                  <TableCell
                    className={`text-base ${getStatusColor(item.internal_status)}`}
                  >
                    {capitalize(item.internal_status)}
                  </TableCell>
                  <TableCell className="text-light-900 text-base">
                    {capitalize(item.type)}
                  </TableCell>
                  <TableCell className="text-light-900 text-base">
                    {capitalize(item.main_position)}
                  </TableCell>
                  <TableCell className="text-light-900 text-base">
                    <ul className="list-disc pl-4">
                      {item.projects?.map((project) => (
                        <li key={project.id}>{capitalize(project.name)}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell className="text-light-900 text-base">
                    {capitalize(item.nda_status || "Not Set")}
                  </TableCell>
                  <TableCell className="text-light-900 text-base">
                    {item.portfolio_url ? (
                      <a
                        href={item.portfolio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-100 hover:text-blue-200"
                      >
                        <Link2 className="mr-1 h-4 w-4" />
                        Portfolio
                      </a>
                    ) : (
                      "Not Available"
                    )}
                  </TableCell>
                  <TableCell>
                    <TableActions
                      item={item}
                      onEdit={() => setEditingId(item.id)}
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
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={pagination.onPreviousPage}
            disabled={pagination.currentPage === 1}
            className="text-light-900 hover:bg-dark-200 rounded px-3 py-1 text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-light-900 text-sm">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={pagination.onNextPage}
            disabled={pagination.currentPage === pagination.totalPages}
            className="text-light-900 hover:bg-dark-200 rounded px-3 py-1 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
