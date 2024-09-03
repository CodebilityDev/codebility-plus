import Footer from "../_components/marketing-footer"
import Navigation from "../_components/marketing-navigation"
import AISolutions from "./components/AISolutions"
import UnparallelDigitalSuccess from "./components/UnparallelDigitalSuccess"
import MobileAppServices from "./components/MobileAppServices"
import DevelopmentProcess from "./components/DevelopmentProcess"
import Partner from "./components/Partner"
import NextStep from "./components/NextStep"
import HeroBackground from "./components/HeroBackground"
import PartnerReactFlow from "./components/PartnerReactFlow"
import DevelopmentProcessReactFLow from "./components/DevelopmentProcessReactFLow"
import LatestTech from "./components/LatestTech"
import SideNavMenu from "../index/components/SideNavMenu" 

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
