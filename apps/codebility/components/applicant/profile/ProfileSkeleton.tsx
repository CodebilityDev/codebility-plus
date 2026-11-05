import { Skeleton } from "@/components/global/ui/skeleton";

export default function ProfileSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-8 md:flex-row">
      <div className="flex w-full basis-[70%] flex-col gap-8 2xl:basis-[60%]">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
      <div className="flex w-full basis-[30%] flex-col gap-8 2xl:basis-[40%]">
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}
