"use client";

import { useEffect, useState } from "react";
import { Codev } from "@/types/home/codev";
import { createClientClientComponent } from "@/utils/supabase/client";

import { CodevCard, Role } from "./CodevCard";
import { EditableCard } from "./EditableCard";

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
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    const supabaseClient = createClientClientComponent();
    setSupabase(supabaseClient);
  }, []);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);

  // Fetch roles when component mounts
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
    onDataChange(data.filter((item) => item.id !== deletedId));
  };

  return (
    <div className="mb-4 space-y-4">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((item) =>
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
              roles={roles}
            />
          ) : (
            <CodevCard
              key={item.id}
              data={item}
              onEdit={() => setEditingId(item.id)}
              onDelete={() => handleDelete(item.id)}
              roles={roles}
            />
          ),
        )}
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
