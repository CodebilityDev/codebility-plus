"use client";
import { ArrowDownAZ, ArrowUpAZ, Calendar, MessageSquare, ThumbsUp, WholeWord } from "lucide-react";
type SortField = "title" | "date" | "upvotes" | "comments";
type SortOrder = "asc" | "desc";
interface SortMenuProps {
  sortField: SortField;
  sortOrder: SortOrder;
  onChangeSortField: (field: SortField) => void;
  onChangeSortOrder: (order: SortOrder) => void;
}
const FIELDS: { value: SortField; label: string; icon: React.ReactNode }[] = [
  { value: "date",     label: "Date",     icon: <Calendar className="h-3.5 w-3.5" /> },
  { value: "title",    label: "Title",    icon: <WholeWord className="h-3.5 w-3.5" /> },
  { value: "upvotes",  label: "Upvotes",  icon: <ThumbsUp className="h-3.5 w-3.5" /> },
  { value: "comments", label: "Comments", icon: <MessageSquare className="h-3.5 w-3.5" /> },
];
export default function SortMenu({
  sortField,
  sortOrder,
  onChangeSortField,
  onChangeSortOrder,
}: SortMenuProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* Sort field — segmented control */}
      <div className="grid w-full grid-cols-2 gap-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-700/60">
        {FIELDS.map(({ value, label, icon }) => {
          const active = sortField === value;
          return (
            <button
              key={value}
              onClick={() => onChangeSortField(value)}
              title={label}
              className={`flex min-w-0 flex-1 items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-medium transition-all duration-150
                ${
                  active
                    ? "bg-white text-cyan-600 shadow-sm dark:bg-gray-800 dark:text-cyan-400"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
            >
              {icon}
              {label}
            </button>
          );
        })}
      </div>
      {/* Sort order — segmented control */}
      <div className="flex rounded-xl bg-gray-100 p-1 dark:bg-gray-700/60">
        {([
          { value: "asc",  label: "Asc",  icon: <ArrowUpAZ className="h-3.5 w-3.5" /> },
          { value: "desc", label: "Desc", icon: <ArrowDownAZ className="h-3.5 w-3.5" /> },
        ] as { value: SortOrder; label: string; icon: React.ReactNode }[]).map(({ value, label, icon }) => {
          const active = sortOrder === value;
          return (
            <button
              key={value}
              onClick={() => onChangeSortOrder(value)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150
                ${
                  active
                    ? "bg-white text-cyan-600 shadow-sm dark:bg-gray-800 dark:text-cyan-400"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
            >
              {icon}
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}