import OrgChartSkeleton from "./_components/OrgChartSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-20 text-center">
          <div className="mb-6">
            <h1 className="text-5xl font-light tracking-tight text-gray-900 dark:text-white">
              Our Team
            </h1>
            <div className="mx-auto mt-6 h-px w-32 bg-gradient-to-r from-transparent via-customBlue-400 to-transparent"></div>
          </div>
          <p className="mx-auto max-w-3xl text-lg font-light text-gray-600 dark:text-gray-300">
            Meet the extraordinary individuals who drive innovation and excellence in everything we create
          </p>
        </div>
        
        <div className="relative">
          <OrgChartSkeleton />
        </div>
      </div>
    </div>
  );
}
