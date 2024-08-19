"use client"

import { useRouter } from "next/navigation"
import { useQuery, UseQueryResult } from "@tanstack/react-query"

import { getClients } from "@/app/api/clients"
import useAuthCookie from "@/hooks/use-cookie"
import { H1 } from "@/Components/shared/dashboard"
import ClientArchiveCards from "@/app/home/clients/archive/ClientArchiveCard"
import { client_ClientCardT } from "@/types/protectedroutes"

const ClientArchivePage = () => {
  const auth = useAuthCookie()
  const router = useRouter()

  const {
    data: Clients,
    isLoading: LoadingClients,
    error: ErrorClients,
  }: UseQueryResult<client_ClientCardT[]> = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      return await getClients()
    },
    refetchInterval: 3000,
  })

  if (LoadingClients) return <div>Loading...</div>

  if (ErrorClients) return <div>Error loading clients</div>

  if (auth?.data?.userType.clients === false) return router.push("/404")

  const archivedClients = Clients?.filter((client) => client.isArchive === true) || []

  return (
    <div className="flex flex-col gap-4">
      <H1>Archive</H1>

      <ClientArchiveCards clients={archivedClients} />
    </div>
  )
}

export default ClientArchivePage
