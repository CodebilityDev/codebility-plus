import { useState } from "react";
import { Codev } from "@/types/home/codev";

import { TableFilters } from "../table/table-filters";
import { CodevCard } from "./codev-card";
import { EditableCard } from "./editable-card";

interface InHouseCardsProps {
  data: Codev[];
  onDataChange: (data: Codev[]) => void;
  pagination: {
    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPreviousPage: () => void;
  };
}

export function InHouseCards({
  data,
  onDataChange,
  pagination,
}: InHouseCardsProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: "",
    position: "",
    project: "",
    internal_status: "",
    nda_status: "",
    display_position: "",
  });

  const handleDelete = (deletedId: string) => {
    onDataChange(data.filter((item) => item.id !== deletedId));
  };

  // Filter data
  const filteredData = data.filter((item) => {
    // Status filter
    if (filters.status && item.internal_status !== filters.status) return false;

    // Position filter
    if (filters.position && item.display_position !== filters.position)
      return false;

    // Project filter
    if (
      filters.project &&
      !item.projects?.some((project) => project.id === filters.project)
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-4 ">
      {/* Count and Filters */}
      <div className="flex items-center justify-between  ">
        <p className="text-light-900 text-sm">
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

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredData.map((item) =>
          editingId === item.id ? (
            <EditableCard
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
            <CodevCard
              key={item.id}
              data={item}
              onEdit={() => setEditingId(item.id)}
              onDelete={() => handleDelete(item.id)}
            />
          ),
        )}
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
