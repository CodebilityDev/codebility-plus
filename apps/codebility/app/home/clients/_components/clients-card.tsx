"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DefaultAvatar from "@/Components/DefaultAvatar";
import { Button } from "@/Components/ui/button";
import DefaultPagination from "@/Components/ui/pagination";
import { pageSize } from "@/constants";
import { useModal } from "@/hooks/use-modal-clients";
import usePagination from "@/hooks/use-pagination";
import {
  IconCopy,
  IconMail,
  IconMapPin,
  IconTelephone,
} from "@/public/assets/svgs";
import { Client } from "@/types/home/codev";
import toast from "react-hot-toast";

import { copyToClipboard, handleDownload } from "../_lib/utils";
import { deleteClientAction, toggleClientStatusAction } from "../action";

interface Props {
  clients: Client[];
}

export default function ClientCards({ clients }: Props) {
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

  /**
   * Toggle client status between 'active' and 'inactive'.
   */
  const handleToggleStatus = async (id: string) => {
    if (!id) {
      toast.error("Invalid client ID");
      return;
    }

    setIsLoading(true);
    try {
      const response = await toggleClientStatusAction(id);
      if (response.success) {
        toast.success("Client status updated successfully");
      } else {
        toast.error(`Error: ${response.error}`);
      }
    } catch (error) {
      console.error("Failed to toggle client status:", error);
      toast.error("Failed to toggle client status");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete a client by ID.
   */
  const handleDeleteClient = async (id: string) => {
    if (!id) {
      toast.error("Invalid client ID");
      return;
    }

    setIsLoading(true);
    try {
      const response = await deleteClientAction(id);
      if (response.success) {
        toast.success("Client deleted successfully");
      } else {
        toast.error(`Error: ${response.error}`);
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Failed to delete client");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {clients?.length > 0 ? (
          paginatedClients?.map((client) => (
            <div
              key={client.id}
              className="background-box relative flex flex-col overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700"
            >
              {/* Top-right button toggles status */}
              <button
                onClick={() => handleToggleStatus(client.id!)}
                className="absolute right-4 top-4 z-10 cursor-pointer text-white"
                disabled={isLoading}
              >
                {client.status === "active" ? (
                  <span className="rounded bg-green-500 px-2 py-1 text-xs">
                    Active
                  </span>
                ) : (
                  <span className="rounded bg-red-500 px-2 py-1 text-xs">
                    Inactive
                  </span>
                )}
              </button>

              <div className="flex h-full flex-col md:flex-row">
                {/* Left side: image/logo */}
                <div className="dark:bg-dark-100 flex min-h-60 items-center justify-center rounded-l-lg p-4 md:basis-[40%]">
                  <div className="relative size-[130px] min-h-[130px] min-w-[130px]">
                    {client.company_logo ? (
                      <Image
                        src={client.company_logo}
                        alt="Client Logo"
                        fill
                        loading="eager"
                        priority
                        className="h-auto w-auto rounded-full bg-cover object-cover"
                      />
                    ) : (
                      <DefaultAvatar />
                    )}
                  </div>
                </div>

                {/* Right side: main details */}
                <div className="text-dark100_light900 relative flex flex-col gap-4 p-8 md:basis-[60%]">
                  <div className="flex flex-1 flex-col gap-4">
                    <p className="text-2xl">{client.name}</p>
                    <div className="flex flex-col gap-3">
                      {/* Address */}
                      <div className="text-gray flex items-center gap-4">
                        <IconMapPin className="h-6 min-w-6 invert dark:invert-0" />
                        {client.address ? (
                          <Link
                            href={`https://www.google.com/maps/search/${encodeURIComponent(
                              client.address,
                            )}`}
                            target="_blank"
                            className="hover:text-blue-100"
                          >
                            {client.address}
                          </Link>
                        ) : (
                          <p className="hover:text-blue-100">No address</p>
                        )}
                      </div>
                      {/* Email */}
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
                              className="hover:opacity-75"
                            >
                              <IconCopy className="h-4 min-w-4 invert dark:invert-0" />
                            </button>
                          </>
                        ) : (
                          <p className="hover:text-blue-100">No email</p>
                        )}
                      </div>
                      {/* Phone Number */}
                      <div className="text-gray flex items-center gap-4">
                        <IconTelephone className="h-6 min-w-6 invert dark:invert-0" />
                        {client.phone_number ? (
                          <>
                            <Link
                              href={`tel:${client.phone_number}`}
                              className="hover:text-blue-100"
                            >
                              {client.phone_number}
                            </Link>
                            <button
                              onClick={() =>
                                copyToClipboard(client.phone_number || "")
                              }
                              className="hover:opacity-75"
                            >
                              <IconCopy className="h-4 min-w-4 invert dark:invert-0" />
                            </button>
                          </>
                        ) : (
                          <p className="hover:text-blue-100">No phone</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom-right buttons (e.g., download or delete) */}
                  {client.status === "inactive" ? (
                    <div className="flex flex-col gap-3 md:flex-row">
                      {/* 'Download' typically exports the entire client list as XLSX or CSV.
                          If you don't want this feature, remove the button and handleDownload call. */}
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
            {pathname === "/home/clients" ? "No clients" : "No data"}
          </p>
        )}
      </div>

      {/* Pagination */}
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
}
