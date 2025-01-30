import H1 from "@/Components/shared/dashboard/H1";
import { getClients } from "@/lib/server/codev.service";
import { Client } from "@/types/home/codev";

import ClientButtons from "./_components/clients-button";
import ClientCards from "./_components/clients-card";

export default async function Clients() {
  // Fetch clients data
  const { data, error } = await getClients();

  // If 'data' is nullish, fallback to an empty array
  let clients: Client[] = data ?? [];

  // Sort so 'active' clients come first, and 'inactive' clients come last
  // If you have more statuses, extend this logic
  clients.sort((a, b) => {
    if (a.status === b.status) return 0;
    if (a.status === "active") return -1;
    return 1;
  });

  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        <H1>Clients</H1>
        <ClientButtons />
      </div>

      {error ? (
        <div className="text-white">ERROR</div>
      ) : (
        // Pass our sorted array to the client-card component
        <ClientCards clients={clients} />
      )}
    </div>
  );
}
