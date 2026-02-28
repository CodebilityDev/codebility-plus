import ComingSoonModal from "@/app/home/ticket-support/_components/ComingSoonModal";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TicketSupportManagementPage() {
    return (
        <div className="relative min-h-screen bg-white dark:bg-gray-950">
            {/* Coming Soon Modal Overlay */}
            <ComingSoonModal />

            {/* Page Content (visible but blurred behind modal) */}
            <div className="mx-auto max-w-6xl px-6 py-12">
                {/* Header — Codev Overflow style */}
                <div className="mb-12 text-center">
                    <div className="mb-4">
                        <h1 className="text-5xl font-light tracking-tight text-gray-900 dark:text-white">
                            Ticket Support Management
                        </h1>
                        <div className="mx-auto mt-4 h-px w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                    </div>
                    <p className="mx-auto max-w-2xl text-lg font-light text-gray-600 dark:text-gray-300">
                        This feature is currently a work in progress and is yet to be fully developed.
                    </p>
                </div>

                {/* Form placeholder */}
                <div className="relative">
                    <div className="h-96 w-full rounded-2xl border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-gray-900/50" />
                </div>
            </div>
        </div>
    );
}
