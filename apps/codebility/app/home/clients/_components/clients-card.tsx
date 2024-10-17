"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/Components/ui/button";
import DefaultPagination from "@/Components/ui/pagination";
import { pageSize } from "@/constants";
import { useModal } from "@/hooks/use-modal-clients";
import usePagination from "@/hooks/use-pagination";
import {
  IconArchive,
  IconCopy,
  IconMail,
  IconMapPin,
  IconTelephone,
} from "@/public/assets/svgs";
import toast from "react-hot-toast";

import { DEFAULT_AVATAR } from "../_lib/constants";
import { convertTime12h, copyToClipboard, handleDownload } from "../_lib/utils";
import { ClientDetails } from "../_types/clients";
import { deleteClientAction, toggleClientArchiveAction } from "../action";

const ClientCards = ({ clients }: { clients: ClientDetails[] }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { onOpen } = useModal();
  const pathname = usePathname();

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedClients,
    handleNextPage,
    handlePreviousPage,
    setCurrentPage,
  } = usePagination(clients, pageSize.clients);

  const handleArchive = async (id: number) => {
    if (!id) {
      toast.error("Can't Archived: Invalid client ID");
      return;
    }

    setIsLoading(true);

    try {
      const response = await toggleClientArchiveAction(id);

      if (response.success) {
        toast.success("Client updated successfully");
      } else {
        toast.error(`Error: ${response.error}`);
      }
    } catch (error) {
      console.log("Failed to archive client");
      toast.error("Failed to archive client");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClient = async (id: number) => {
    if (!id) {
      toast.error("Can't Archived: Invalid client ID");
      return;
    }

    setIsLoading(true);

    try {
      const response = await deleteClientAction(id);

      if (response.success) {
        toast.success("Client has been deleted");
      } else {
        toast.error(`Error: ${response.error}`);
      }
    } catch (error) {
      console.log("Error deleting client: ");
      toast.error("Failed to delete client");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {clients?.length > 0 ? (
          paginatedClients?.map((client, index) => (
            <div
              key={`${client.name}-${index}`}
              className="background-box relative flex flex-col overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700"
            >
              <button
                onClick={() => {
                  handleArchive(parseInt(client.id!));
                  console.log("handle archive click");
                }}
                className="absolute right-4 top-4 z-10 cursor-pointer text-white  hover:cursor-pointer"
              >
                <IconArchive className="h-5 w-5" />
              </button>
              <div className="flex h-full flex-col md:flex-row">
                <div className="dark:bg-dark-100 flex min-h-60 items-center justify-center rounded-l-lg p-4 md:basis-[40%]">
                  <div className="relative size-[130px] min-h-[130px] min-w-[130px]">
                    <Image
                      src={client.logo || DEFAULT_AVATAR}
                      alt="Avatar"
                      fill
                      loading="eager"
                      priority
                      className="bg-red-400 h-auto w-auto rounded-full bg-cover object-cover"
                    />
                  </div>
                </div>

                <div className="text-dark100_light900 relative flex flex-col gap-4 p-8 md:basis-[60%]">
                  <div className="flex flex-1 flex-col gap-4">
                    <p className="text-2xl">{client.name}</p>
                    <div>
                      <p className="lg:text-md text-gray text-sm">
                        Time Schedule
                      </p>
                      {client.start_time && client.end_time ? (
                        <p className="text-lg">
                          {`${convertTime12h(client.start_time)} - ${convertTime12h(client.end_time)}`}
                        </p>
                      ) : (
                        <p className="text-lg">No value</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="text-gray flex items-center gap-4">
                        <IconMapPin className="h-6 min-w-6 invert dark:invert-0" />
                        {client.location ? (
                          <Link
                            href={`https://www.google.com/maps/search/${encodeURIComponent(client.location)}`}
                            target="_blank"
                            className="hover:text-blue-100"
                          >
                            {client.location}
                          </Link>
                        ) : (
                          <p className="hover:cursor-pointer hover:text-blue-100">
                            No value
                          </p>
                        )}
                      </div>
                      <div className="text-gray flex items-center gap-4">
                        <IconMail className="h-6 min-w-6 invert dark:invert-0" />
                        {client.email ? (
                          <>
                            <Link
                              href={`mailto:${client.email}`}
                              className="hover:text-blue-100"
                            >
                              {client.email}
                            </Link>
                            <button
                              onClick={() =>
                                copyToClipboard(client.email || "")
                              }
                            >
                              <IconCopy className="h-4 min-w-4 invert dark:invert-0" />
                            </button>
                          </>
                        ) : (
                          <p className="hover:cursor-pointer hover:text-blue-100">
                            No value
                          </p>
                        )}
                      </div>
                      <div className="text-gray flex items-center gap-4">
                        <IconTelephone className="h-6 min-w-6 invert dark:invert-0" />
                        {client.contact_number ? (
                          <>
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
                          </>
                        ) : (
                          <p className="hover:cursor-pointer hover:text-blue-100">
                            No value
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  {client.is_archive ? (
                    <div className="flex flex-col gap-3 md:flex-row">
                      <Button
                        type="button"
                        variant="gradient"
                        className="w-full text-white"
                        onClick={() => handleDownload(clients)}
                        disabled={isLoading}
                      >
                        Download
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        className="w-full"
                        onClick={() => handleDeleteClient(parseInt(client.id!))}
                        disabled={isLoading}
                      >
                        Delete
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <Button
                        variant="default"
                        className="w-full md:w-1/2"
                        onClick={() => onOpen("clientEditModal", client)}
                        disabled={isLoading}
                      >
                        Edit
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-dark100_light900">
            {pathname === "/home/clients" ? "No clients" : "No archive clients"}
          </p>
        )}
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

export default ClientCards;
