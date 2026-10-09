"use client";

import { Button } from "@codevs/ui/button";

export function CodevHireCodevButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      tabIndex={-1}
      className="relative z-10 h-[1.75rem] rounded-full border !border-purple-500 !bg-transparent px-4 py-0.5 text-xs font-medium !text-purple-400 transition-all duration-300 hover:!bg-purple-500/10 hover:!text-purple-300"
      asChild
    >
      <span>Learn More</span>
    </Button>
  );
}
