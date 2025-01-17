import { Codev } from "@/types/home/codev";
import { Edit2, Eye, MoreHorizontal } from "lucide-react";

import { Button } from "@codevs/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";

interface TableActionsProps {
  item: Codev;
  onEdit: () => void;
}

export function TableActions({ item, onEdit }: TableActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-light-900 hover:bg-dark-200 hover:text-light-900"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-dark-100 border-dark-200">
        <DropdownMenuItem
          onClick={onEdit}
          className="text-light-900 focus:bg-dark-200 focus:text-light-900"
        >
          <Edit2 className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem className="text-light-900 focus:bg-dark-200 focus:text-light-900">
          <Eye className="mr-2 h-4 w-4" />
          View Profile
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
