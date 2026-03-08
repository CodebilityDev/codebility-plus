import { fetchModalById } from "../actions";
import EditPromoModal from "../_components/EditPromoModal";
import PageContainer from "../../_components/PageContainer";
import { H1 } from "@/components/shared/dashboard";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface EditModalPageProps {
  params: { id: string };
}

export default async function EditModalPage({ params }: EditModalPageProps) {
  const modal = await fetchModalById(params.id);

  return (
    <PageContainer maxWidth="xl">
      {/* Back link */}
      <Link
        href="/home/promote-modal"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Promotional Modals
      </Link>

      <H1>{modal ? modal.headline || "Edit Modal" : "Modal Not Found"}</H1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-6">
        Edit the content of this promotional popup.
      </p>

      {modal ? (
        <EditPromoModal data={modal} />
      ) : (
        <p className="text-sm text-red-500">
          Modal not found. It may have been deleted.
        </p>
      )}
    </PageContainer>
  );
}