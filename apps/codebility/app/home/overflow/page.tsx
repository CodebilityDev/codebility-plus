import { H1 } from "@/components/shared/dashboard";

import OverflowView from "./_components/OverflowView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function OverflowPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-12 text-center">
          <div className="mb-4">
            <h1 className="text-5xl font-light tracking-tight text-gray-900 dark:text-white">
              Codev Overflow
            </h1>
            <div className="mx-auto mt-4 h-px w-32 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
          </div>
          <p className="mx-auto max-w-2xl text-lg font-light text-gray-600 dark:text-gray-300">
            A community-driven platform where developers collaborate, share knowledge, and solve problems together
          </p>
        </div>
        
        <div className="relative">
          <OverflowView />
        </div>
      </div>
    </div>
  );
}