import { Box, H1 } from "@/Components/shared/dashboard";
import { Skeleton } from "@/Components/ui/skeleton/skeleton";

export default function ApplicantsLoading() {
  return (
    <div className="mx-auto flex max-w-screen-2xl flex-col gap-4">
      <H1>Applicants List</H1>
      <Box className="mt-6">
        <div className="hidden lg:grid">
          <div className="grid grid-cols-6 gap-5">
            {Array(6)
              .fill(null)
              .map((_, index) => (
                <div key={index}>
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
          </div>
        </div>
        {Array(15)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="mx-auto my-4 flex flex-col items-center gap-10"
            >
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
      </Box>
    </div>
  );
}
