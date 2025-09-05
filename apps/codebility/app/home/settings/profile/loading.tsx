import Box from "@/components/shared/dashboard/Box";
import { Skeleton } from "@/components/ui/skeleton/skeleton";

const Loading = () => {
  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-4">
      <Skeleton className="h-5 w-40 rounded-lg" />
      <Skeleton className="h-8 w-40 rounded-lg" />
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="flex w-full basis-[50%] flex-col gap-8">
          <Box className="flex flex-col gap-2">
            <Skeleton className="h-8 w-40 rounded-lg" />
            <div className="flex flex-col gap-6 px-2">
              <div className="mt-5 flex flex-col gap-2">
                <Skeleton className="h-5 w-40 rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-40 rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-40 rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-40 rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-40 rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>
          </Box>
          <Box className="flex flex-col gap-2">
            <Skeleton className="h-8 w-20 rounded-lg" />
            <div className="flex flex-col gap-6 px-2">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-40 rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
              </div>
            </div>
          </Box>
          <Box className="flex flex-col gap-2">
            <Skeleton className="h-8 w-40 rounded-lg" />
            <div className="flex flex-col gap-6 px-2">
              <div className="mt-2 flex flex-col gap-2">
                <Skeleton className="h-5 w-40 rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-40 rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-40 rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-40 rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-40 rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-40 rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-40 rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-40 rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>
          </Box>
          <Box className="flex flex-col gap-2">
            <Skeleton className="h-8 w-40 rounded-lg" />
            <Skeleton className="h-14 w-48 rounded-lg" />
            <div className="mt-4 flex flex-col gap-6 px-2">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-40 rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-40 rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-40 rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-40 rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>
          </Box>
          <Box className="flex flex-col gap-2">
            <Skeleton className="h-8 w-40 rounded-lg" />
            <div className="mt-4 flex h-full w-full flex-wrap items-center justify-start gap-2">
              {Array(18)
                .fill(null)
                .map((_, index) => (
                  <div key={index}>
                    <Skeleton className="h-10 w-10 rounded-lg" />
                  </div>
                ))}
            </div>
          </Box>
        </div>
        <div className="flex w-full basis-[50%] flex-col gap-8">
          <Box className="flex flex-col gap-2">
            <Skeleton className="h-8 w-40 rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <div className="mt-4 flex w-full items-center gap-2">
              <Skeleton className="h-20 w-20 rounded-lg" />
              <Skeleton className="h-8 w-40 rounded-lg" />
            </div>
          </Box>
          <Box className="flex flex-col gap-2">
            <Skeleton className="h-8 w-40 rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <div className="mt-4 flex w-full items-center justify-center gap-2">
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-40 w-full rounded-lg" />
            </div>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default Loading;
