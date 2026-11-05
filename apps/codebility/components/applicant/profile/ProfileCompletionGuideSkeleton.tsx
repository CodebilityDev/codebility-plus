import Box from "@/components/global/layout/Box";

export function ProfileCompletionGuideSkeleton() {
  return (
    <Box className="flex w-full flex-1 flex-col relative overflow-hidden">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-7 w-56 bg-gray-700/50 rounded animate-pulse"></div>
          <div className="w-5 h-5 bg-gray-700/50 rounded animate-pulse"></div>
        </div>
        <div className="h-4 bg-gray-700/50 rounded animate-pulse"></div>
        <div className="h-20 bg-gray-700/50 rounded animate-pulse"></div>
      </div>
    </Box>
  );
}
