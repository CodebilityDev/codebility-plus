import { getCodevPointsSummary } from "@/lib/server/codev-points.service";
import { getCurrentCodev } from "@/lib/server/current-codev";

import CertificatePreview from "./_components/CertificatePreviewClient";

export default async function CertificatePreviewPage() {
  const codev = await getCurrentCodev();
  const initialPoints = await getCodevPointsSummary(codev?.id ?? "");

  return (
    <CertificatePreview viewerId={codev?.id ?? ""} initialPoints={initialPoints} />
  );
}
