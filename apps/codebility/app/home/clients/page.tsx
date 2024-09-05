import { getAllClients } from "./service";
import { ClientDetails } from "./_types/clients";
import H1 from "@/Components/shared/dashboard/H1";
import ClientButtons from "./_components/clients-button";
import ClientCards from "./_components/clients-card";

const Clients = async () => {
  const { data, error } = await getAllClients();
  
  const clients = data ? (data as ClientDetails[]).filter(
    (client) => client.is_archive === false
  ) : [];

  return (
    <div className="max-w-screen-xl mx-auto flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        <H1>Clients</H1>
        <ClientButtons />
      </div>
      {
        error ?
          <div className="text-white">ERROR</div>
          :
          <ClientCards clients={clients} />
      }
    </div>
  );
};

export default Clients;
