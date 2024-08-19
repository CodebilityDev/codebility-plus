import Footer from "@/app/(marketing)/Footer"
import Navigation from "@/app/(marketing)/Navigation"
import AISolutions from "@/app/(marketing)/ai-integration/components/AISolutions"
import UnparallelDigitalSuccess from "@/app/(marketing)/ai-integration/components/UnparallelDigitalSuccess"
import MobileAppServices from "@/app/(marketing)/ai-integration/components/MobileAppServices"
import DevelopmentProcess from "@/app/(marketing)/ai-integration/components/DevelopmentProcess"
import Partner from "@/app/(marketing)/ai-integration/components/Partner"
import NextStep from "@/app/(marketing)/ai-integration/components/NextStep"
import HeroBackground from "@/app/(marketing)/ai-integration/components/HeroBackground"
import PartnerReactFlow from "@/app/(marketing)/ai-integration/components/PartnerReactFlow"
import DevelopmentProcessReactFLow from "@/app/(marketing)/ai-integration/components/DevelopmentProcessReactFLow"
import LatestTech from "@/app/(marketing)/ai-integration/components/LatestTech"
import SideNavMenu from "@/app/(marketing)/index/components/SideNavMenu" 

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
