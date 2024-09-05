import Box from "@/Components/shared/dashboard/Box";
import { Skeleton } from "@/Components/ui/skeleton/skeleton";

const Loading = () => {
  return (
    <div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {Array(4)
          .fill(null)
          .map((_, index) => (
            <Box key={index} className="flex flex-col p-0 xl:flex-row">
              <Skeleton className="aspect-video w-full rounded-lg xl:aspect-auto xl:w-[40%]" />
              <Box className="flex flex-col gap-3 xl:flex-1">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-8 w-1/2 rounded-lg" />
                {Array(3)
                  .fill(null)
                  .map((_, index) => (
                    <div key={index} className="flex gap-2">
                      <Skeleton className="h-8 w-[40px] rounded-lg" />
                      <Skeleton className="h-8 w-full rounded-lg" />
                    </div>
                  ))}
                <Skeleton className="h-10 w-full rounded-lg xl:w-32 xl:self-end" />
              </Box>
            </Box>
          ))}
      </div>
    </div>
  );
};

export default Loading;
