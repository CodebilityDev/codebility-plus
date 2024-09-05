import Navigation from "./_components/marketing-navigation"
import Footer from "./_components/marketing-footer"
import Hero from "./_components/landing/landing-hero"
import Admins from "./_components/landing/landing-admins"
import Parallax from "./_components/landing/landing-parallax"
import Calendly from "./_components/marketing-calendly"
import Features from "./_components/landing/landing-features"
import WorkWithUs from "./_components/landing/landing-work-with-us"
import WhyChooseUs from "./_components/landing/landing-why-choose-us"
import { PoppinFont } from "./_lib/font"

const Index = () => {
  return (
    <div
      className={`relative flex w-full flex-col overflow-x-hidden overflow-y-hidden bg-[#030303] ${PoppinFont.className}`}
    >
      <Navigation />
      <Hero />
      <Features />
      <Parallax />
      <WhyChooseUs />
      <WorkWithUs />
      <Admins />
      <Calendly />
      <Footer />
    </div>
  )
}

export default Index
