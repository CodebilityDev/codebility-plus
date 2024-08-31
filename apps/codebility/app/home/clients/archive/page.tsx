import { getAllClients } from "../service";
import { ClientDetails } from "../_types/clients";
import H1 from "@/Components/shared/dashboard/H1"
import ClientCards from "../_components/clients-card"

const ClientArchivePage = async () => {
  const data = await getAllClients();

  const clients = (data as ClientDetails[]).filter(
    (client) => client.is_archive === true
  );

  return (
    <div className="max-w-screen-xl mx-auto flex flex-col gap-4">
      <H1>Archive</H1>
      <ClientCards clients={clients} />
    </div>
  )
}

export default ClientArchivePage
