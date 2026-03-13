import { Suspense } from "react";
import { Ticket } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton/skeleton";
import H1 from "@/components/shared/dashboard/H1";
import PageContainer from "../../_components/PageContainer";
import { getTickets, getCodevList } from "./actions";
import TicketManagementView from "./_components/TicketManagementView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function TicketManagementLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

async function TicketManagementContent() {
  const [tickets, codevList] = await Promise.all([
    getTickets(),
    getCodevList(),
  ]);

  return <TicketManagementView initialTickets={tickets} codevList={codevList} />;
}

export default async function TicketManagementPage() {
  return (
    <PageContainer maxWidth="full" noPadding>
      <div className="flex flex-col gap-6 px-2 pt-6 md:pt-8">
        <div className="flex items-center gap-4">
          <div className="flex shrink-0 h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500">
            <Ticket className="h-6 w-6 text-white" />
          </div>
          <div>
            <H1 className="!mb-0 text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent pb-1">
              Ticket Management
            </H1>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mt-1">
               View and manage submitted support tickets
            </p>
          </div>
        </div>

        <Suspense fallback={<TicketManagementLoading />}>
          <TicketManagementContent />
        </Suspense>
      </div>
    </PageContainer>
  );
}
