"use client";

import { useModal } from "@/hooks/use-modal";

import { cn } from "@codevs/ui";
import { Button } from "@codevs/ui/button";

interface CodevHireCodevButtonProps {
  codevId: string;
}

export function CodevHireCodevButton({ codevId }: CodevHireCodevButtonProps) {
  const { onOpen } = useModal();

  return (
    <>
      <Button
        variant="purple"
        size="sm"
        className="h-[1.75rem] rounded-md bg-purple-600 px-3 py-0.5 text-xs opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          onOpen("marketingCodevHireCodevModal", codevId);
        }}
        onMouseEnter={(e) => e.stopPropagation()}
        onMouseLeave={(e) => e.stopPropagation()}
      >
        Hire Me
      </Button>
    </>
  );
}
