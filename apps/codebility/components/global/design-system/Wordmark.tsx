import Image from "next/image";

import { cn } from "@codevs/ui";

export interface WordmarkProps {
  className?: string;
  width?: number;
  priority?: boolean;
  alt?: string;
}

function Wordmark({
  className,
  width = 150,
  priority = false,
  alt = "Codebility",
}: WordmarkProps) {
  return (
    <Image
      src="/assets/svgs/codebility-white.svg"
      alt={alt}
      width={1288}
      height={295}
      priority={priority}
      loading={priority ? "eager" : undefined}
      style={{ width }}
      className={cn("h-auto object-contain", className)}
    />
  );
}

export { Wordmark };
