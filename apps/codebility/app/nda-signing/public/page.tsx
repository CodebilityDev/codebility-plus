import NdaSigningPublicView from "@/components/global/nda-signing/NdaSigningPublicView";
import { getSiteDate } from "@/lib/global/site-date";

export default function NdaSigningPublicPage() {
  const { formatted } = getSiteDate();

  return <NdaSigningPublicView formattedDate={formatted} />;
}