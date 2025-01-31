import Footer from "../_components/marketing-footer";
import Navigation from "../_components/marketing-navigation";
import SideNavMenu from "../_components/marketing-sidenav-menu";
import DevelopmentProcess from "./_components/ai-integration-development-process";
import DevelopmentProcessReactFLow from "./_components/ai-integration-development-process-react-flow";
import HeroBackground from "./_components/ai-integration-hero-bg";
import LatestTech from "./_components/ai-integration-latest-tech";
import MobileAppServices from "./_components/ai-integration-mobile-app-services";
import NextStep from "./_components/ai-integration-next-step";
import Partner from "./_components/ai-integration-partner";
import PartnerReactFlow from "./_components/ai-integration-partner-react-flow";
import AISolutions from "./_components/ai-integration-solutions";
import UnparallelDigitalSuccess from "./_components/ai-integration-unparallel-digital-success";

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
