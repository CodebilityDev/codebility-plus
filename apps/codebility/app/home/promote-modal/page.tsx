import { fetchAllModals } from "./actions";
import PageContainer from "../_components/PageContainer";
import { H1 } from "@/components/shared/dashboard";
import ModalListClient from "./_components/ModalList";

export default async function PromotionalFeaturePage() {
  const modals = await fetchAllModals();

  const total = modals.length;
  const active = modals.filter((m) => m.is_active).length;
  const inactive = modals.filter((m) => !m.is_active).length;

  return (
    <PageContainer maxWidth="xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <H1>Promotional Modals</H1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage feature popups displayed on the home page.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="rounded-full border border-gray-200 dark:border-gray-700 px-4 py-1.5 text-sm text-gray-600 dark:text-gray-300">
          <span className="font-bold text-gray-900 dark:text-white">{total}</span> total
        </span>
        <span className="rounded-full border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20 px-4 py-1.5 text-sm text-green-700 dark:text-green-400">
          <span className="font-bold">{active}</span> active
        </span>
        <span className="rounded-full border border-red-200 bg-red-100 dark:border-red-800 dark:bg-red-900/20 px-4 py-1.5 text-sm text-red-700 dark:text-red-400">
          <span className="font-bold">{inactive}</span> inactive
        </span>
      </div>

      {/* List */}
      <ModalListClient modals={modals} />
    </PageContainer>
  );
}