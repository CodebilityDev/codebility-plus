import { Suspense } from "react";
import { BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton/skeleton";
import H1 from "@/components/shared/dashboard/H1";
import PageContainer from "../../_components/PageContainer";
import ClientTrackerContent from "./_components/ClientTrackerContent";

function ClientTrackerLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export default async function ClientTrackerPage() {
  return (
    <PageContainer maxWidth="xl">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <H1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Client Tracker
            </H1>
            <p className="text-gray-600 dark:text-gray-400">
              Track weekly client outreach by admins
            </p>
          </div>
        </div>

        <Suspense fallback={<ClientTrackerLoading />}>
          <ClientTrackerContent />
        </Suspense>
      </div>
    </PageContainer>
  );
}
