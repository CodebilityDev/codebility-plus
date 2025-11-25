import PageContainer from "../../../_components/PageContainer";

export default function Loading() {
  return (
    <PageContainer>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
      </div>
    </PageContainer>
  );
}
