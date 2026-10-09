import { Skeleton } from "@/components/global/ui/skeleton";

export default function OnboardingSkeleton() {
  return (
    <div
      aria-busy="true"
      className="flex min-h-screen items-center justify-center px-4"
    >
      <div className="w-full max-w-xl rounded-xl border border-gray-800 bg-black-100 p-6 shadow-lg lg:p-8">
        <Skeleton className="mx-auto mb-4 h-8 w-2/3" />
        <Skeleton className="mx-auto mb-8 h-4 w-1/2" />
        <Skeleton className="mb-3 h-4 w-full" />
        <Skeleton className="mb-3 h-4 w-5/6" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}
