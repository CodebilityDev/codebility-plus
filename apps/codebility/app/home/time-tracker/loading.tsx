import { Box } from "@/components/shared/dashboard";
import { Skeleton } from "@/components/ui/skeleton/skeleton";

const Loading = () => {
  return (
    <div className="mx-auto flex w-full max-w-screen-xl flex-col justify-center gap-4">
      <Skeleton className="h-8 w-24" />
      <div className="flex flex-col gap-4 lg:flex-row">
        <Box className="flex w-full flex-col gap-4 md:flex-row">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </Box>
        <Box className="flex h-[200px] w-full flex-col items-center justify-center gap-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-10 w-full" />
        </Box>
      </div>
      <div className="w-full">
        <Box className="h-70">
          <div className="mx-auto flex flex-col items-center gap-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Box>
      </div>
    </div>
  );
};

export default Loading;
