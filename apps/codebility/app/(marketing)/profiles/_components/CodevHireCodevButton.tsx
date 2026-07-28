"use client";

import { useModal } from "@/hooks/use-modal";

import { Button } from "@codevs/ui/button";

interface CodevHireCodevButtonProps {
  codevId: string;
}

export function CodevHireCodevButton({ codevId }: CodevHireCodevButtonProps) {
  const { onOpen } = useModal();

  return (
    <Button
      variant="outline"
      size="sm"
      className="relative z-10h-[1.75rem] rounded-full border !border-purple-500 !bg-transparent px-4 py-0.5 text-xs font-medium !text-purple-400 transition-all duration-300 hover:!bg-purple-500/10 hover:!text-purple-300"
      onClick={(e) => {
        e.stopPropagation();
        // onOpen("marketingCodevHireCodevModal", codevId);
        window.location.href = `https://www.codebility.tech/profiles/${codevId}`
      }}
      onMouseEnter={(e) => e.stopPropagation()}
      onMouseLeave={(e) => e.stopPropagation()}
    >
      Learn More
    </Button>
  );
}