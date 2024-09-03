import Navigation from "../_components/marketing-navigation"
import Footer from "../_components/marketing-footer"
import Hero from "./components/Hero"
import Admins from "./components/Admins"
import Parallax from "./components/Parallax"
import Calendly from "./components/Calendly"
import Features from "./components/Features"
import WorkWithUs from "./components/WorkWithUs"
import WhyChooseUs from "./components/WhyChooseUs"
import { PoppinFont } from "../_lib/font"

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
