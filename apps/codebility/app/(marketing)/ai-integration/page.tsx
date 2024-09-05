import Footer from "../_components/marketing-footer"
import Navigation from "../_components/marketing-navigation"
import AISolutions from "./_components/ai-integration-solutions"
import UnparallelDigitalSuccess from "./_components/ai-integration-unparallel-digital-success"
import MobileAppServices from "./_components/ai-integration-mobile-app-services"
import DevelopmentProcess from "./_components/ai-integration-development-process"
import Partner from "./_components/ai-integration-partner"
import NextStep from "./_components/ai-integration-next-step"
import HeroBackground from "./_components/ai-integration-hero-bg"
import PartnerReactFlow from "./_components/ai-integration-partner-react-flow"
import DevelopmentProcessReactFLow from "./_components/ai-integration-development-process-react-flow"
import LatestTech from "./_components/ai-integration-latest-tech"
import SideNavMenu from "../_components/marketing-sidenav-menu" 

const AiIntegration = () => {
  return (
    <div className="relative mx-auto flex min-h-screen flex-col gap-10 bg-[#030303] text-white">
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
  )
}

export default AiIntegration
