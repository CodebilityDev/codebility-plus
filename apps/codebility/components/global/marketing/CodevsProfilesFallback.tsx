import { CodevsProfilesFilter } from "@/components/global/marketing/CodevsProfilesFilter";
import { CodevsProfilesSkeleton } from "@/components/global/marketing/CodevsProfilesSkeleton";
import { PAGE_SIZE } from "@/constants/global/marketing";
import type { CodevsProfilesFallbackProps } from "@/types/global/marketing";

export function CodevsProfilesFallback({ positions }: CodevsProfilesFallbackProps) {
  return (
    <div className="m-auto h-full w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <CodevsProfilesFilter positions={positions} selectedPosition="" />
      <CodevsProfilesSkeleton count={PAGE_SIZE} />
    </div>
  );
}
