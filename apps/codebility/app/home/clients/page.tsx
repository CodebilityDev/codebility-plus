import H1 from "@/Components/shared/dashboard/H1";
import { getClients } from "@/lib/server/codev.service";
import { Client } from "@/types/home/codev";

import ClientButtons from "./_components/clients-button";
import ClientCards from "./_components/clients-card";

export default async function Clients() {
  const { data, error } = await getClients();

  const clients = data
    ? (data as Client[]).filter((client) => client.status !== "inactive")
    : [];

  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        <H1>Clients</H1>
        <ClientButtons />
      </div>

      {error ? (
        <div className="text-white">ERROR</div>
      ) : (
        <ClientCards clients={clients} />
      )}
    </div>
  );
}
