import { Suspense } from "react";
import { createClientServerComponent } from "@/utils/supabase/server";
import PageContainer from "../../_components/PageContainer";
import NewsBannersClient from "./_components/NewsBannersClient";
import type { NewsBanner } from "./_components/NewsBannersClient";

async function NewsBannersData() {
  const supabase = await createClientServerComponent();

  const { data, error } = await supabase
    .from("news_banners")
    .select("*")
    .order("priority", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching banners:", error);
  }

  return <NewsBannersClient banners={(data ?? []) as NewsBanner[]} />;
}

function NewsBannersLoading() {
  return (
    <PageContainer>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    </PageContainer>
  );
}

export default function NewsBannersPage() {
  return (
    <Suspense fallback={<NewsBannersLoading />}>
      <NewsBannersData />
    </Suspense>
  );
}
