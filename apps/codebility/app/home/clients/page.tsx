import H1 from "@/Components/shared/dashboard/H1";

import ClientButtons from "./_components/clients-button";
import ClientCards from "./_components/clients-card";
import { ClientDetails } from "./_types/clients";
import { getAllClients } from "./service";

const Clients = async () => {
  const { data, error } = await getAllClients();

  const clients = data
    ? (data as ClientDetails[]).filter((client) => client.is_archive === false)
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
};

export default Clients;
