
import PageContainer from "../_components/PageContainer";
import { InHouseLoadingSkeleton } from "./_components/skeletons/InHouseLoadingSkeleton";

export default function InHouseLoading() {
  return (
    <PageContainer maxWidth="full">
      <InHouseLoadingSkeleton />
    </PageContainer>
  );
}
