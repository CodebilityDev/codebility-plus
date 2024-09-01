import { getAllClients } from "../service";
import { ClientDetails } from "../_types/clients";
import H1 from "@/Components/shared/dashboard/H1"
import ClientCards from "../_components/clients-card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@codevs/ui/breadcrumb"

const ClientArchivePage = async () => {
  const data = await getAllClients();

  const clients = (data as ClientDetails[]).filter(
    (client) => client.is_archive === true
  );

  return (
    <div className="max-w-screen-xl mx-auto flex flex-col gap-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/home/clients">Clients</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Archive</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <H1>Archive</H1>
      <ClientCards clients={clients} />
    </div>
  )
}

export default ClientArchivePage
