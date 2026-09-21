import H1 from "@/components/shared/dashboard/H1";
import AsyncErrorBoundary from "@/components/AsyncErrorBoundary";
import { pageSize } from "@/constants";
import { getClientsPage } from "@/lib/server/codev.service";
import PageContainer from "../_components/PageContainer";

import ClientButtons from "./_components/ClientsButton";
import ClientCards from "./_components/ClientsCard";


export default async function Clients() {
  const initialData = await getClientsPage({ page: 1, pageSize: pageSize.clients });

  return (
    <PageContainer maxWidth="xl">
      <AsyncErrorBoundary
        fallback={
          <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 text-4xl">👥</div>
            <h2 className="mb-2 text-xl font-semibold">Unable to load clients</h2>
            <p className="text-gray-600 dark:text-gray-400">
              We couldn't retrieve your client list. Please check your connection and try again.
            </p>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between gap-4">
            <H1>Clients</H1>
            <div className="flex items-center gap-4">
              <ClientButtons />
            </div>
          </div>

          <ClientCards initialData={initialData} />
        </div>
      </AsyncErrorBoundary>
    </PageContainer>
  );
}
