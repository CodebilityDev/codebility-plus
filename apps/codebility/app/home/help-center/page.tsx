import { getFaqItems, getHelpTickets, getCurrentCodevId, getCurrentUserRole } from "./actions";
import { HelpCenterClient } from "./HelpCenterClient";

export default async function HelpCenterPage() {
  const [
    { data: faqItems, error: faqError },
    { data: tickets, error: ticketError },
    { data: currentCodevId },
    { data: roleId },
  ] = await Promise.all([
    getFaqItems(),
    getHelpTickets(),
    getCurrentCodevId(),
    getCurrentUserRole(),
  ]);

  if (faqError || ticketError) {
    return (
      <div className="rounded-3xl bg-violet-50/40 p-6 dark:bg-slate-900/40">
        <p className="text-sm text-red-600 dark:text-red-400">
          Couldn&apos;t load the Help Center right now. Please try again shortly.
        </p>
      </div>
    );
  }

  const isAdmin = roleId === 1;

  return (
    <HelpCenterClient
      initialFaqItems={faqItems ?? []}
      initialTickets={tickets ?? []}
      isAdmin={isAdmin}
      currentCodevId={currentCodevId}
    />
  );
}