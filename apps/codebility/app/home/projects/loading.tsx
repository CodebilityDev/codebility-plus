import Box from "@/Components/shared/dashboard/Box";
import { Skeleton } from "@/Components/ui/skeleton/skeleton";

const Loading = () => {
  return (
    <div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {Array(6)
          .fill(null)
          .map((value, index) => (
            <Box key={index} className="flex flex-col gap-2">
              <Skeleton className="mb-2 aspect-video w-full rounded-lg" />
              <Skeleton className="h-8 w-full rounded-lg" />
              <div className="flex gap-2">
                <Skeleton className="h-[20px] w-[20px] rounded-lg" />
                <Skeleton className="h-[20px] w-[20px] rounded-lg" />
              </div>
              <Skeleton className="h-5 w-full rounded-lg" />
              <div className="flex justify-end">
                <Skeleton className="h-10 w-24 rounded-lg" />
              </div>
            </Box>
          ))}
      </div>
    </div>
  );
};

export default Loading;
