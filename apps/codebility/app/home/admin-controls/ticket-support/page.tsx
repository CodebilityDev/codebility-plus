import PageContainer from "@/app/home/_components/PageContainer";
import { H1 } from "@/components/shared/dashboard";
import ComingSoonModal from "@/app/home/ticket-support/_components/ComingSoonModal";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TicketSupportManagementPage() {
    return (
        <PageContainer maxWidth="xl">
            <div className="relative">
                {/* Coming Soon Modal Overlay */}
                <ComingSoonModal />

                {/* Page Content (visible but blurred behind modal) */}
                <div className="space-y-6">
                    <H1>Ticket Support Management</H1>

                    <div className="mx-auto mt-4 h-px w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

                    <p className="mx-auto max-w-2xl text-center text-lg font-light text-gray-600 dark:text-gray-300">
                        This feature is currently a work in progress and is yet to be fully developed.
                    </p>

                    {/* Placeholder content section */}
                    <div className="relative mt-8 min-h-[500px] w-full rounded-xl border border-gray-200 bg-light-900/50 dark:border-white/10 dark:bg-dark-100 shadow-sm backdrop-blur-sm" />
                </div>
            </div>
        </PageContainer>
    );
}
