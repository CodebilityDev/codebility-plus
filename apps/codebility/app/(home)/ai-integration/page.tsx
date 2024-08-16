import Footer from "@/app/(home)/Footer"
import Navigation from "@/app/(home)/Navigation"
import AISolutions from "@/app/(home)/ai-integration/components/AISolutions"
import UnparallelDigitalSuccess from "@/app/(home)/ai-integration/components/UnparallelDigitalSuccess"
import MobileAppServices from "@/app/(home)/ai-integration/components/MobileAppServices"
import DevelopmentProcess from "@/app/(home)/ai-integration/components/DevelopmentProcess"
import Partner from "@/app/(home)/ai-integration/components/Partner"
import NextStep from "@/app/(home)/ai-integration/components/NextStep"
import HeroBackground from "@/app/(home)/ai-integration/components/HeroBackground"
import PartnerReactFlow from "@/app/(home)/ai-integration/components/PartnerReactFlow"
import DevelopmentProcessReactFLow from "@/app/(home)/ai-integration/components/DevelopmentProcessReactFLow"
import LatestTech from "@/app/(home)/ai-integration/components/LatestTech"
import SideNavMenu from "@/app/(home)/index/components/SideNavMenu" 

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
