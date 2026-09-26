import { Card, CardContent } from "@codevs/ui/card";

export const LoadingContent = () => (
  <div className="grid gap-6 lg:grid-cols-2 max-w-none">
    <Card className="background-box text-dark100_light900 self-start">
      <CardContent className="space-y-4 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-px w-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="space-y-2">
            <div className="h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-10 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div className="h-px w-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="space-y-2">
            <div className="h-5 w-1/3 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-10 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-10 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div className="h-px w-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-3 w-56 rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="h-9 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="background-box text-dark100_light900 border border-red-600 self-start">
      <CardContent className="space-y-4 p-6">
        <div className="animate-pulse space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-6 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-9 w-32 rounded bg-red-200 dark:bg-red-800"></div>
        </div>
      </CardContent>
    </Card>
  </div>
);
