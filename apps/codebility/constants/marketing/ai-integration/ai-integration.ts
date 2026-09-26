import { CustomEdge } from "@/components/marketing/ai-integration/AiIntegrationEdgeTypes";
import { DevProcessCard } from "@/components/marketing/ai-integration/AiIntegrationNodeTypes";
import { DevProcessImage } from "@/components/marketing/ai-integration/DevProcessImage";
import { PartnerTitle } from "@/components/marketing/ai-integration/PartnerTitle";
import { PartnerCard } from "@/components/marketing/ai-integration/PartnerCard";

export const nodeTypes = {
  devProcessCard: DevProcessCard,
  devProcessImage: DevProcessImage,
};

export const edgeTypes = {
  customEdge: CustomEdge,
};

export const PartnerReactFlownodeTypes = {
  partnerTitle: PartnerTitle,
  partnerCard: PartnerCard,
};
