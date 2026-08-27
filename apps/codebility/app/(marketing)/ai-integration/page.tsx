import { Metadata } from "next";

import DevelopmentProcessReactFLow from "./_components/AiIntegration-development-process-react-flow";
import DevelopmentProcess from "./_components/AiIntegrationDevelopmentProcess";
import HeroBackground from "./_components/AiIntegrationHeroBg";
import LatestTech from "./_components/AiIntegrationLatestTech";
import MobileAppServices from "./_components/AiIntegrationMobileAppServices";
import NextStep from "./_components/AiIntegrationNextStep";
import Partner from "./_components/AiIntegrationPartner";
import PartnerReactFlow from "./_components/AiIntegrationPartnerReactFlow";
import AISolutions from "./_components/AiIntegrationSolutions";
import UnparallelDigitalSuccess from "./_components/AiIntegrationUnparallelDigitalSuccess";

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

export const dynamic = "force-dynamic";
export const revalidate = 0;

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