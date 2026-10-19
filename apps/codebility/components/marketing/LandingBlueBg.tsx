

import { cn } from "@codevs/ui";
import type { BlueBgProps } from "@/types/marketing/marketing";

const BlueBg = ({ className }: BlueBgProps) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute z-0 hidden rounded-full bg-[#2e23a8c3] blur-[400px] md:block",
        className,
      )}
    ></div>
  );
};

export default BlueBg;
