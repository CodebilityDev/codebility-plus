import { use } from 'react'

import { TicketsDataTable } from './_components/tickets-data-table'
import { getSupabaseServerClient } from './[ticketId]/_lib/server/server-client'
import { createTicketsService } from './[ticketId]/_lib/server/tickets.service'

interface TicketsPageProps {
  params: {
    account: string
  }

  searchParams: {
    page?: string
    query?: string
  }
}

export default function TicketsPage(props: TicketsPageProps) {
  const client = getSupabaseServerClient()
  const service = createTicketsService(client)

  const page = Number(props.searchParams.page ?? '1')
  const query = props.searchParams.query ?? ''

  const { data, pageSize, pageCount } = use(
    service.getTickets({
      accountSlug: props.params.account,
      page,
      query,
    }),
  )

  return (
    <TicketsDataTable
      pageIndex={page - 1}
      pageCount={pageCount}
      pageSize={pageSize}
      data={data}
    />
  )
}
