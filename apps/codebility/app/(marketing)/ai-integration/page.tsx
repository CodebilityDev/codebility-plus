import Footer from "../_components/MarketingFooter";
import Navigation from "../_components/MarketingNavigation";
import SideNavMenu from "../_components/MarketingSidenavMenu";
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

export const dynamic = "force-dynamic";
export const revalidate = 0;

const AiIntegration = () => {
  return (
    <div className="bg-black-400 relative mx-auto flex min-h-screen flex-col gap-10 text-white">
      <HeroBackground />
      <Navigation />
      <SideNavMenu />
      <AISolutions />
      <UnparallelDigitalSuccess />
      <LatestTech />
      <MobileAppServices />
      <DevelopmentProcess />
      <DevelopmentProcessReactFLow />
      <Partner />
      <PartnerReactFlow />
      <NextStep />
      <Footer />
    </div>
  );
};

export default AiIntegration;
