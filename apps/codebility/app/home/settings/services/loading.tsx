import Box from "@/Components/shared/dashboard/Box";
import { Skeleton } from "@/Components/ui/skeleton/skeleton";

const Loading = () => {
  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-4">
      <Skeleton className="h-5 w-40 rounded-lg" />
      <Skeleton className="h-8 w-40 rounded-lg" />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:hidden">
        {Array(10)
          .fill(null)
          .map((_, index) => (
            <Box
              key={index}
              className="flex gap-2 lg:h-72 lg:flex-col lg:gap-3"
            >
              <div className="flex w-full flex-col gap-5">
                <Skeleton className="h-8 w-full rounded-lg" />
                <Skeleton className="h-8 w-full rounded-lg" />
                <Skeleton className="h-8 w-full rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </Box>
          ))}
      </div>
      <Box className="hidden flex-col gap-2 lg:flex">
        <Skeleton className="h-8 w-full rounded-lg" />
        <div className="mt-4 flex flex-col gap-5">
          {Array(10)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="mx-5">
                <Skeleton className="h-8 w-full rounded-lg" />
              </div>
            ))}
        </div>
      </Box>
    </div>
  );
};

export default Loading;
