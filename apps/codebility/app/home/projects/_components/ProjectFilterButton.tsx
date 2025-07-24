"use client";

import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { Filter } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";

export default function ProjectFilterButton() {
  const router = useRouter();

  const statuses = [
    { label: "All", value: "All" },
    { label: "In Progress", value: "InProgress" },
    { label: "Pending", value: "Pending" },
    { label: "Completed", value: "Completed" },
  ];

  const handleFilterChange = (filter: string) => {
    router.push(`/home/projects?filter=${filter.toLowerCase()}`);
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="text-black-500 dark:border-dark-300 dark:bg-dark-200 dark:text-light-800 flex items-center gap-1 border-gray-300 bg-white"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {statuses.map(({ label, value }) => (
            <DropdownMenuItem
              key={value}
              onClick={() => handleFilterChange(value)}
            >
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
