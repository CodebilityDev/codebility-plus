import PageContainer from "../_components/PageContainer";
import CodevContainerSkeleton from "./_components/CodevContainerSkeleton";

export default function Loading() {
  return (
    <PageContainer maxWidth="2xl">
      <CodevContainerSkeleton />
    </PageContainer>
  );
}
