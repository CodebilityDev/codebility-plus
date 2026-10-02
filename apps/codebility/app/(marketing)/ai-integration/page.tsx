import type { Metadata } from "next";

import DevelopmentProcessReactFLow from "@/components/marketing/ai-integration/AiIntegration-development-process-react-flow";
import DevelopmentProcess from "@/components/marketing/ai-integration/AiIntegrationDevelopmentProcess";
import HeroBackground from "@/components/marketing/ai-integration/AiIntegrationHeroBg";
import LatestTech from "@/components/marketing/ai-integration/AiIntegrationLatestTech";
import MobileAppServices from "@/components/marketing/ai-integration/AiIntegrationMobileAppServices";
import NextStep from "@/components/marketing/ai-integration/AiIntegrationNextStep";
import Partner from "@/components/marketing/ai-integration/AiIntegrationPartner";
import PartnerReactFlow from "@/components/marketing/ai-integration/AiIntegrationPartnerReactFlow";
import AISolutions from "@/components/marketing/ai-integration/AiIntegrationSolutions";
import UnparallelDigitalSuccess from "@/components/marketing/ai-integration/AiIntegrationUnparallelDigitalSuccess";

export const metadata: Metadata = {
    title: "AI Integration Services — Codebility",
    description: "Integrate AI into your business with Codebility. We build custom AI solutions, automation pipelines, and intelligent web applications.",
    alternates: { canonical: "https://www.codebility.tech/ai-integration" },
    openGraph: {
        title: "AI Integration Services | Codebility",
        description: "Custom AI solutions and automation built by Codebility developers.",
        url: "https://www.codebility.tech/ai-integration",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "AI Integration by Codebility" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Integration Services | Codebility",
        description: "Custom AI solutions and automation built by Codebility developers.",
        images: ["/og-image.jpg"],
    },
};

const AiIntegration = () => {
    return (
        <div className="bg-black-400 relative mx-auto flex min-h-screen flex-col gap-10 text-white">
            <HeroBackground />
            <AISolutions />
            <UnparallelDigitalSuccess />
            <LatestTech />
            <MobileAppServices />
            <DevelopmentProcess />
            <DevelopmentProcessReactFLow />
            <Partner />
            <PartnerReactFlow />
            <NextStep />
        </div>
    );
};

export default AiIntegration;