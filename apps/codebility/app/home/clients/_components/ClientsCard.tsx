"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DefaultAvatar from "@/Components/DefaultAvatar";
import { Button } from "@/Components/ui/button";
import DefaultPagination from "@/Components/ui/pagination";
import SwitchStatusButton from "@/Components/ui/SwitchStatusButton";
import { pageSize } from "@/constants";
import { useModal } from "@/hooks/use-modal-clients";
import usePagination from "@/hooks/use-pagination";
import {
  IconCopy,
  IconMail,
  IconMapPin,
  IconTelephone,
} from "@/public/assets/svgs";
import { useUserStore } from "@/store/codev-store";
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
  const { user } = useUserStore();
  const canEditClients =
    user?.role_id === 1 ||
    user?.role_id === 2 ||
    user?.role_id === 3 ||
    user?.role_id === 5;

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
      <article className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {clients?.length > 0 ? (
          paginatedClients?.map((client) => {
            const isActive = client.status === "active";
            return (
              <div
                key={client.id}
                /* If inactive, gray out or slightly dim the card */
                className={`relative flex flex-col overflow-hidden rounded-lg border border-zinc-200 transition-colors dark:border-zinc-700
                  ${
                    isActive
                      ? "dark:bg-dark-100 bg-white"
                      : "bg-gray-50 opacity-90 dark:bg-gray-800"
                  }
                `}
              >
                {/* Top-right button toggles status */}
                <div className="absolute right-4 top-4 z-10 flex cursor-pointer items-center gap-2 text-white">
                  <div>
                    {isActive ? (
                      <div className="bg-green rounded px-2 py-1 text-xs">
                        Active
                      </div>
                    ) : (
                      <div className="rounded bg-red-500 px-2 py-1 text-xs">
                        Inactive
                      </div>
                    )}
                  </div>

                  <SwitchStatusButton
                    isActive={isActive}
                    handleSwitch={() => handleToggleStatus(client.id!)}
                    disabled={isLoading}
                  />
                </div>

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
                          unoptimized={true}
                          className="h-auto w-auto rounded-full bg-cover object-cover"
                        />
                      ) : (
                        <DefaultAvatar />
                      )}
                    </div>
                  </div>

                  {/* Right side: main details */}
                  <div className="text-dark100_light900 relative flex flex-1 flex-col gap-4 p-8">
                    <div className="flex flex-1 flex-col gap-4">
                      <p className="text-2xl">{client.name}</p>
                      <div className="flex flex-col gap-3">
                        {/* Address */}
                        <div className="text-gray flex items-center gap-4">
                          <Image
                            src={IconMapPin}
                            alt="Map Pin"
                            className="h-6 min-w-6 invert dark:invert-0"
                          />
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
                          <Image
                            src={IconMail}
                            alt="Mail"
                            className="h-6 min-w-6 invert dark:invert-0"
                          />
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
                                <Image
                                  src={IconCopy}
                                  alt="Copy"
                                  className="h-4 min-w-4 invert dark:invert-0"
                                />
                              </button>
                            </>
                          ) : (
                            <p className="hover:text-blue-100">No email</p>
                          )}
                        </div>
                        {/* Phone Number */}
                        <div className="text-gray flex items-center gap-4">
                          <Image
                            src={IconTelephone}
                            alt="Phone"
                            className="h-6 min-w-6 invert dark:invert-0"
                          />
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
                                <Image
                                  src={IconCopy}
                                  alt="Copy"
                                  className="h-4 min-w-4 invert dark:invert-0"
                                />
                              </button>
                            </>
                          ) : (
                            <p className="hover:text-blue-100">No phone</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom-right buttons */}
                    {isActive && canEditClients ? (
                      // For active clients: Show "Edit" button
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
                    ) : (
                      // For inactive clients: Show "Edit" and "Delete" buttons
                      <div className="flex flex-col gap-3 md:flex-row">
                        <Button
                          variant="default"
                          className="w-full md:w-1/2"
                          onClick={() => onOpen("clientEditModal", client)}
                          disabled={isLoading}
                        >
                          Edit
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
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-dark100_light900">
            {pathname === "/home/clients" ? "No clients" : "No data"}
          </p>
        )}
      </article>

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
