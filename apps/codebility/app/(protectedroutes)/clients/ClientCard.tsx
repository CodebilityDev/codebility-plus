import Link from "next/link"
import Image from "next/image"

import toast from "react-hot-toast"
import { pageSize } from "@/constants"
import { Button } from "@/Components/ui/button"
import { useModal } from "@/hooks/use-modal-clients"
import usePagination from "@/hooks/use-pagination"
import { defaultAvatar } from "@/public/assets/images"
import DefaultPagination from "@/Components/ui/pagination"
import { client_ClientCardT } from "@/types/protectedroutes/index"
import { IconCopy, IconMail, IconMapPin, IconTelephone, IconArchive } from "@/public/assets/svgs"
import { updateClient } from "@/app/api/clients"
import useToken from "@/hooks/use-token"

const ClientCards = ({ clients }: { clients: client_ClientCardT[] }) => {
  const { token } = useToken()

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedClients,
    handleNextPage,
    handlePreviousPage,
    setCurrentPage,
  } = usePagination(clients, pageSize.clients)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Copied to clipboard!")
    } catch (err) {
      toast.error("Failed to copy text")
    }
  }

  const { onOpen } = useModal()

  const handleArchive = async (id: string) => {
    try {
      await updateClient(id, { id: id, isArchive: true }, token).then((response) => {
        if (response.status === 200) {
          toast.success("Client has been archived")
        }
      })
    } catch (error) {
      toast.error("Something went wrong!")
    }
  }

  const convertTime12h = (time: string) => {
    const [hour, minute] = time.split(":")
    let formattedTime = ""
    if (!hour) return
    if (+hour === 0) {
      formattedTime = `12:${minute} AM`
    } else if (+hour === 12) {
      formattedTime = `12:${minute}`
    } else if (+hour > 12) {
      formattedTime = `${+hour - 12}:${minute}`
    } else {
      formattedTime = `${+hour}:${minute}`
    }

    return formattedTime
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {clients.length > 0 &&
          paginatedClients?.map((client: client_ClientCardT, index) => (
            <div
              key={`${client.company_name}-${index}`}
              className="background-box relative flex flex-col overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700"
            >
              <button
                onClick={() => handleArchive(client.id)}
                className="absolute right-4 top-4 z-10 cursor-pointer text-white  hover:cursor-pointer"
              >
                <IconArchive />
              </button>
              <div className="flex h-full flex-col xl:flex-row">
                <div className="flex min-h-60 items-center justify-center rounded-l-lg p-4 dark:bg-dark-100 lg:basis-[40%]">
                  <div className="relative size-[130px] min-h-[130px] min-w-[130px]">
                    <Image
                      src={client.company_logo || defaultAvatar}
                      alt="Avatar"
                      fill
                      className="h-auto w-auto rounded-full bg-dark-400 bg-cover object-cover"
                    />
                  </div>
                </div>

                <div className="text-dark100_light900 relative flex flex-col gap-4 p-8 lg:basis-[60%]">
                  <div className="flex flex-1 flex-col gap-4">
                    <p className="text-2xl">{client.company_name}</p>
                    <div>
                      <p className="lg:text-md text-sm text-gray">Time Schedule</p>
                      <p className="text-lg">
                        {convertTime12h(client.client_start_time as string)}-
                        {convertTime12h(client.client_end_time as string)}
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
                  <div className="flex justify-end">
                    <Button
                      variant="default"
                      className="w-full lg:w-[130px]"
                      onClick={() => onOpen("clientEditModal", client)}
                    >
                      Edit
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
  )
}

export default ClientCards
