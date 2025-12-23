import { redirect } from 'next/navigation';
import { getTaskDetailsByTicketCode } from './actions';

interface PageProps {
  params: {
    ticketCode: string;
  };
}

export default async function TicketPage({ params }: PageProps) {
  const { ticketCode } = params;

  const ticketInfo = await getTaskDetailsByTicketCode(ticketCode);

  // Determine where to redirect
  const destination = `/home/kanban/${ticketInfo.data?.project_id}/${ticketInfo.data?.board_id}?taskId=${ticketInfo.data?.task_id}`;

  redirect(destination);
}
