import { Box } from "@/components/shared/dashboard";
import { Skeleton } from "@/components/ui/skeleton/skeleton";

const Loading = () => {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-screen-xl flex-col gap-4">
      <Skeleton className="h-8 w-24" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array(6)
          .fill(null)
          .map((_, i) => (
            <Box key={i}>
              <div className="flex flex-col justify-between gap-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-8 w-10" />
                  <Skeleton className="h-8 w-10" />
                </div>
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </Box>
          ))}
      </div>
    </div>
  );
};

export default Loading;
