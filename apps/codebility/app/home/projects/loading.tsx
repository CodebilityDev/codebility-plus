import Box from "../components/shared/dashboard/Box";
import { Skeleton } from "../components/ui/skeleton/skeleton";

const Loading = () => {
  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-4">
      <Skeleton className="h-8 w-40 rounded-lg" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array(6)
          .fill(null)
          .map((_, index) => (
            <Box key={index} className="flex flex-col gap-2">
              <Skeleton className="mb-2 aspect-video w-full rounded-lg" />
              <Skeleton className="h-8 w-full rounded-lg" />
              <Skeleton className="h-8 w-full rounded-lg" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-10 rounded-lg" />
                <Skeleton className="h-8 w-10 rounded-lg" />
              </div>
              <div className="mt-5 flex flex-col items-center justify-end gap-5 md:flex-row">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </Box>
          ))}
      </div>
    </div>
  );
};

export default Loading;
