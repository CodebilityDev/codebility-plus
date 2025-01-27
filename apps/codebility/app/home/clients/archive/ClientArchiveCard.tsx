import Image from "next/image";
import Link from "next/link";
// import { deleteClient, updateClient } from "@/app/api/clients";
import { Button } from "@/Components/ui/button";
import DefaultPagination from "@/Components/ui/pagination";
import { pageSize } from "@/constants";
import usePagination from "@/hooks/use-pagination";
import { defaultAvatar } from "@/public/assets/images";
import {
  IconCopy,
  IconMail,
  IconMapPin,
  IconTelephone,
} from "@/public/assets/svgs";
import { Client } from "@/types/home/codev";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

const ClientArchiveCards = ({ clients }: { clients: Client[] }) => {
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedClients,
    handleNextPage,
    handlePreviousPage,
    setCurrentPage,
  } = usePagination(clients, pageSize.clients);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy text");
    }
  };

  const handleArchive = async (id: string) => {
    try {
      // await updateClient(id, { id: id, isArchive: false }, token).then(
      //   (response) => {
      //     if (response.status === 200) {
      //       toast.success("Client has been restored");
      //     }
      //   },
      // );
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const handleDownload = async () => {
    const formattedData = clients.map((appointment) => ({ ...appointment }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");
    XLSX.writeFile(workbook, "clients.xlsx");
  };

  const convertTime12h = (time: string) => {
    const [hour, minute] = time.split(":");
    let formattedTime = "";
    if (!hour) return;
    if (+hour === 0) {
      formattedTime = `12:${minute} AM`;
    } else if (+hour === 12) {
      formattedTime = `12:${minute}`;
    } else if (+hour > 12) {
      formattedTime = `${+hour - 12}:${minute}`;
    } else {
      formattedTime = `${+hour}:${minute}`;
    }

    return formattedTime;
  };

  const handleDeleteClient = async (id: string) => {
    event?.preventDefault();
    try {
      // await deleteClient(id, token).then((response) => {
      //   if (response) {
      //     toast.success("Client has been deleted");
      //   } else if (!response) {
      //     toast.error(response.statusText);
      //   }
      // });
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {clients.length > 0 &&
          paginatedClients?.map((client: Client, index) => (
            <div
              key={`${client.company_name}-${index}`}
              className="background-box relative flex flex-col overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700"
            >
              <div className="flex h-full flex-col xl:flex-row">
                <div className="dark:bg-dark-100 flex min-h-60 items-center justify-center rounded-l-lg p-4 lg:basis-[40%]">
                  <div className="relative size-[130px] min-h-[130px] min-w-[130px]">
                    <Image
                      src={client.company_logo || defaultAvatar}
                      alt="Avatar"
                      fill
                      className="bg-dark-400 h-auto w-auto rounded-full bg-cover object-cover"
                    />
                  </div>
                </div>

                <div className="text-dark100_light900 relative flex flex-col gap-4 p-8 lg:basis-[60%]">
                  <div className="flex flex-1 flex-col gap-4">
                    <p className="text-2xl">{client.company_name}</p>
                    <div>
                      <p className="lg:text-md text-gray text-sm">
                        Time Schedule
                      </p>
                      <p className="text-lg">
                        {convertTime12h(client.client_start_time as string)}-
                        {convertTime12h(client.client_end_time as string)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-3">
                      {client.location && (
                        <div className="text-gray flex items-center gap-4">
                          <IconMapPin className="h-6 min-w-6 invert dark:invert-0" />
                          <Link
                            href={`https://www.google.com/maps/search/${encodeURIComponent(client.location)}`}
                            target="_blank"
                            className="hover:text-blue-100"
                          >
                            {client.location}
                          </Link>
                        </div>
                      )}
                      {client.email && (
                        <div className="text-gray flex items-center gap-4">
                          <IconMail className="h-6 min-w-6 invert dark:invert-0" />
                          <Link
                            href={`mailto:${client.email}`}
                            className="hover:text-blue-100"
                          >
                            {client.email}
                          </Link>
                          <button
                            onClick={() => copyToClipboard(client.email || "")}
                          >
                            <IconCopy className="h-4 min-w-4 invert dark:invert-0" />
                          </button>
                        </div>
                      )}
                      {client.contact_number && (
                        <div className="text-gray flex items-center gap-4">
                          <IconTelephone className="h-6 min-w-6 invert dark:invert-0" />
                          <Link
                            href={`tel:${client.contact_number}`}
                            className="hover:text-blue-100"
                          >
                            {client.contact_number}
                          </Link>
                          <button
                            onClick={() =>
                              copyToClipboard(client.contact_number || "")
                            }
                          >
                            <IconCopy className="h-4 min-w-4 invert dark:invert-0" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="gradient"
                      className="order-2 w-full sm:order-1 sm:w-[130px]"
                      onClick={() => handleDownload()}
                    >
                      Download
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      className="order-2 w-full sm:order-1 sm:w-[130px]"
                      onClick={() => handleDeleteClient(client.id)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="default"
                      className="w-full lg:w-[130px]"
                      onClick={() => handleArchive(client.id)}
                    >
                      Restore
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {clients.length > pageSize.clients && (
        <DefaultPagination
          currentPage={currentPage}
          handleNextPage={handleNextPage}
          handlePreviousPage={handlePreviousPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      )}
    </>
  );
};

export default ClientArchiveCards;
