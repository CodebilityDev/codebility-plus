import NdaSigningPublicView from "@/components/global/nda-signing/NdaSigningPublicView";
import { getSiteDate } from "@/lib/global/site-date";

export default async function NdaSigningPublicPage() {
  const { formatted } = await getSiteDate();

  return <NdaSigningPublicView formattedDate={formatted} />;
}