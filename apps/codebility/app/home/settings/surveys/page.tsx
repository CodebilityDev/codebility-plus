import { Suspense } from "react";
import { createClientServerComponent } from "@/utils/supabase/server";

import SurveysClient, { type Survey } from "./_components/SurveysClient";
import SurveysLoading from "./loading";

async function SurveysData() {
  const supabase = await createClientServerComponent();

  // Same query the page used to run from the browser: access stays governed by
  // RLS, so anyone with the `settings` permission still sees what they saw before.
  const { data, error } = await supabase
    .from("surveys")
    .select("*")
    .order("priority", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching surveys:", error);
  }

  return <SurveysClient surveys={(data as Survey[] | null) ?? []} />;
}

export default function SurveysPage() {
  return (
    <Suspense fallback={<SurveysLoading />}>
      <SurveysData />
    </Suspense>
  );
}
