"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

type SortField = "title" | "date" | "upvotes";
type SortOrder = "asc" | "desc";

interface SortMenuProps {
  sortField: SortField;
  sortOrder: SortOrder;
  onChangeSortField: (field: SortField) => void;
  onChangeSortOrder: (order: SortOrder) => void;
}

export default function SortMenu({
  sortField,
  sortOrder,
  onChangeSortField,
  onChangeSortOrder,
}: SortMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-11 items-center gap-2 rounded-md border border-gray-300 bg-gray-50 px-3 text-sm text-gray-700 shadow-sm hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
      >
        Sort:{" "}
        <span className="capitalize">
          {sortField} ({sortOrder})
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800 dark:shadow-black/20">
          {["date", "title", "upvotes", "comments"].map((field) => (
            <button
              key={field}
              onClick={() => {
                onChangeSortField(field as SortField);
                setOpen(false);
              }}
              className={`block w-full px-4 py-2 text-left text-sm text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 ${
                sortField === field ? "text-gray-900 dark:text-white" : ""
              }`}
            >
              Sort by {field}
            </button>
          ))}

          <div className="border-t border-gray-200 px-3 py-2 text-sm text-gray-500 dark:border-gray-600 dark:text-gray-400">
            <div className="flex items-center justify-between">
              <span>Order:</span>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onChangeSortOrder("asc");
                    setOpen(false);
                  }}
                  className={`rounded px-2 py-1 ${
                    sortOrder === "asc"
                      ? "bg-gray-200 text-gray-900 dark:bg-gray-600 dark:text-white"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  Asc
                </button>

                <button
                  onClick={() => {
                    onChangeSortOrder("desc");
                    setOpen(false);
                  }}
                  className={`rounded px-2 py-1 ${
                    sortOrder === "desc"
                      ? "bg-gray-200 text-gray-900 dark:bg-gray-600 dark:text-white"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  Desc
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
