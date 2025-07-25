import { H1 } from "@/components/shared/dashboard";

import OverflowView from "./_components/OverflowView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function OverflowPage() {
  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex flex-row justify-between gap-4">
        <H1 className="text-xl text-gray-900 dark:text-gray-100 sm:text-2xl">Codev Overflow</H1>
      </div>
      <OverflowView />
    </div>
  );
}