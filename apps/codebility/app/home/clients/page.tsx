"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useQuery, UseQueryResult } from "@tanstack/react-query"

import ClientCard from "@/app/home/clients/ClientCard"
import { getClients } from "@/app/api/clients"
import useAuthCookie from "@/hooks/use-cookie"
import { Button } from "@/Components/ui/button"
import H1 from "@/Components/shared/dashboard/H1"
import { useModal } from "@/hooks/use-modal-clients"
import { client_ClientCardT } from "@/types/protectedroutes"
import Loading from "@/app/home/clients/loading"
import Error from "@/app/home/clients/error"

const Clients = () => {
  const { data: authData } = useAuthCookie()
  const { userType } = authData || {}

  const { onOpen } = useModal()
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

  if (LoadingClients) return <Loading />

  if (ErrorClients) return <Error error={ErrorClients} reset={() => getClients()} />

  if (userType?.clients === false) return router.push("/404")

  const archivedClients = Clients?.filter((client) => client?.isArchive === false) || []

  return (
    <div className="max-w-screen-xl mx-auto flex flex-col gap-4">
      <div className="flex flex-row justify-between gap-4">
        <H1>Clients</H1>
        <div className="flex items-center gap-4">
          <Link href="/clients/archive">
            <Button variant="link">Archive</Button>
          </Link>
          <Button variant="default" onClick={() => onOpen("clientAddModal")}>
            Add New Client
          </Button>
        </div>
      </div>
      <ClientCard clients={archivedClients as client_ClientCardT[]} />
    </div>
  )
}

export default Clients
