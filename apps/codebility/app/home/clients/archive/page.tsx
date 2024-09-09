import H1 from "@/Components/shared/dashboard/H1";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@codevs/ui/breadcrumb";

import ClientCards from "../_components/clients-card";
import { ClientDetails } from "../_types/clients";
import { getAllClients } from "../service";

const ClientArchivePage = async () => {
  const { data, error } = await getAllClients();

  const clients = data
    ? (data as ClientDetails[]).filter((client) => client.is_archive === true)
    : [];

  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-4">
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
      {error ? (
        <div className="text-white">ERROR</div>
      ) : (
        <ClientCards clients={clients} />
      )}
    </div>
  );
};

export default ClientArchivePage;
