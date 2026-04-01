import OrgChartSkeleton from "./_components/OrgChartSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1600px] px-6 py-12">
        <div className="relative">
          <OrgChartSkeleton />
        </div>
      </div>
    </div>
  );
}
