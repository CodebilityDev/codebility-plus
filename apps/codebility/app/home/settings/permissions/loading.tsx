import Box from "@/Components/shared/dashboard/Box";
import { Skeleton } from "@/Components/ui/skeleton/skeleton";

const Loading = () => {
  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-4">
      <Skeleton className="h-5 w-40 rounded-lg" />
      <Skeleton className="h-8 w-40 rounded-lg" />
      <Box className="flex flex-col gap-5 xl:hidden">
        {Array(4)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="flex items-center gap-4">
              <Skeleton className="h-8 w-full rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          ))}
      </Box>
      <Box className="hidden flex-col gap-2 xl:flex">
        <Skeleton className="h-8 w-full rounded-lg" />
        <div className="mt-4 flex flex-col gap-5">
          {Array(4)
            .fill(null)
            .map((_, index) => (
              <div key={index}>
                <Skeleton className="h-8 w-full rounded-lg" />
              </div>
            ))}
        </div>
      </Box>
    </div>
  );
};

export default Loading;
