import H1 from "@/components/shared/dashboard/H1";
import AsyncErrorBoundary from "@/components/AsyncErrorBoundary";
import { getClients } from "@/lib/server/codev.service";
import { Client } from "@/types/home/codev";

import ClientButtons from "./_components/ClientsButton";
import ClientCards from "./_components/ClientsCard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Clients() {
  const { data, error } = await getClients();

  let clients: Client[] = data ?? [];

  clients.sort((a, b) => {
    if (a.status === b.status) return 0;
    if (a.status === "active") return -1;
    return 1;
  });

  return (
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
      <div className="mx-auto flex max-w-screen-xl flex-col gap-4">
        <div className="flex flex-row justify-between gap-4">
          <H1>Clients</H1>
          <div className="flex items-center gap-4">
            <ClientButtons />
          </div>
        </div>

        {error ? (
          <div className="text-white">ERROR</div>
        ) : (
          // Pass our sorted array to the client-card component
          <ClientCards clients={clients} />
        )}
      </div>
    </AsyncErrorBoundary>
  );
}
