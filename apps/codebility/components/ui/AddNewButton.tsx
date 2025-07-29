"use client";

import { Plus } from "lucide-react";
import { Button } from "@codevs/ui/button";

interface AddNewButtonProps {
  onClick: () => void;
  label: string;
  showIcon?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function AddNewButton({ 
  onClick, 
  label, 
  showIcon = true,
  disabled = false,
  className = ""
}: AddNewButtonProps) {
  return (
    <Button
      variant="default"
      onClick={onClick}
      disabled={disabled}
      className={`bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 ${className}`}
    >
      {showIcon && <Plus className="h-4 w-4" />}
      {label}
    </Button>
  );
}