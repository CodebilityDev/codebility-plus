import { Suspense } from "react";

import DeclinedComponent from "./_components/DeclineComponent";

export const dynamic = "force-dynamic";
export default async function DeclinedPage() {
  return (
    <section className="bg-backgroundColor text-primaryColor flex h-screen w-screen items-center justify-center overflow-hidden">
      <Suspense
        fallback={
          <div className="h-screen w-screen animate-pulse bg-gray-200" />
        }
      >
        <DeclinedComponent />
      </Suspense>
    </section>
  );
}
