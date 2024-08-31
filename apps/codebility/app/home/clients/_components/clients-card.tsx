"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import toast from "react-hot-toast"
import { pageSize } from "@/constants"
import { Button } from "@/Components/ui/button"
import DefaultPagination from "@/Components/ui/pagination"
import usePagination from "@/hooks/use-pagination"
import { useModal } from "@/hooks/use-modal-clients"
import { ClientDetails } from "../_types/clients"
import { DEFAULT_AVATAR } from "../_lib/constants"
import { convertTime12h, copyToClipboard, handleDownload } from "../_lib/utils"
import { deleteClientAction, toggleClientArchiveAction } from "../action"
import { IconCopy, IconMail, IconMapPin, IconTelephone, IconArchive } from "@/public/assets/svgs"

const ClientCards = ({ clients }: { clients: ClientDetails[] }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { onOpen } = useModal();

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedClients,
    handleNextPage,
    handlePreviousPage,
    setCurrentPage,
  } = usePagination(clients, pageSize.clients)

  const handleArchive = async (id: string) => {
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
  }

  const handleDeleteClient = async (id: string) => {
    if (!id) {
      toast.error("Can't Archived: Invalid client ID");
      return;
    }

    setIsLoading(true);

    try {
      const response = await deleteClientAction(id)

      if (response.success) {
        toast.success("Client has been deleted")
      } else {
        toast.error(`Error: ${response.error}`);
      }
    } catch (error) {
      console.log("Error deleting client: ",);
      toast.error("Failed to delete client")
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {clients?.length > 0 &&
          paginatedClients?.map((client, index) => (
            <div
              key={`${client.name}-${index}`}
              className="background-box relative flex flex-col overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700"
            >
              <button
                onClick={() => {handleArchive(client.id!)
                  console.log("handle archive click")
                }}
                className="absolute right-4 top-4 z-10 cursor-pointer text-white  hover:cursor-pointer"
              >
                <IconArchive className="w-5 h-5" />
              </button>
              <div className="flex h-full flex-col md:flex-row">
                <div className="flex min-h-60 items-center justify-center rounded-l-lg p-4 dark:bg-dark-100 md:basis-[40%]">
                  <div className="relative size-[130px] min-h-[130px] min-w-[130px]">
                    <Image
                      src={client.logo || DEFAULT_AVATAR}
                      alt="Avatar"
                      fill
                      className="h-auto w-auto rounded-full bg-dark-400 bg-cover object-cover"
                    />
                  </div>
                </div>

                <div className="text-dark100_light900 relative flex flex-col gap-4 p-8 md:basis-[60%]">
                  <div className="flex flex-1 flex-col gap-4">
                    <p className="text-2xl">{client.name}</p>
                    <div>
                      <p className="lg:text-md text-sm text-gray">Time Schedule</p>
                      <p className="text-lg">
                        {`${convertTime12h(client.start_time)} - ${convertTime12h(client.end_time)}`}
                      </p>
                    </div>
                    <div className="flex flex-col gap-3">
                      {client.location && (
                        <div className="flex items-center gap-4 text-gray">
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
                        <div className="flex items-center gap-4 text-gray">
                          <IconMail className="h-6 min-w-6 invert dark:invert-0" />
                          <Link href={`mailto:${client.email}`} className="hover:text-blue-100">
                            {client.email}
                          </Link>
                          <button onClick={() => copyToClipboard(client.email || "")}>
                            <IconCopy className="h-4 min-w-4 invert dark:invert-0" />
                          </button>
                        </div>
                      )}
                      {client.contact_number && (
                        <div className="flex items-center gap-4 text-gray">
                          <IconTelephone className="h-6 min-w-6 invert dark:invert-0" />
                          <Link href={`tel:${client.contact_number}`} className="hover:text-blue-100">
                            {client.contact_number}
                          </Link>
                          <button onClick={() => copyToClipboard(client.contact_number || "")}>
                            <IconCopy className="h-4 min-w-4 invert dark:invert-0" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {client.is_archive ? 
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
                        onClick={() => handleDeleteClient(client.id!)}
                        disabled={isLoading}
                      >
                        Delete
                      </Button>
                    </div> : 
                    <div className="flex justify-end">
                      <Button
                        variant="default"
                        className="w-full md:w-1/2"
                        onClick={() => onOpen("clientEditModal", client)}
                        disabled={isLoading}
                      >
                        Edit
                      </Button>
                    </div>}
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
  )
}

export default ClientCards
