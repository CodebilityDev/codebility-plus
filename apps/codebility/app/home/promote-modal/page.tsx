import { fetchActiveModal } from "./actions";
import EditPromoModal from "./_components/EditPromoModal";
import PageContainer from "../_components/PageContainer";
import { H1 } from "@/components/shared/dashboard";

export default async function PromotionalFeaturePage() {
  const modal = await fetchActiveModal();

  return (
    <PageContainer maxWidth="xl">
      <H1>Promotional Feature</H1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-6">
        Edit the promotional popup displayed on the home page.
      </p>
      <EditPromoModal data={modal} />
    </PageContainer>
  );
}