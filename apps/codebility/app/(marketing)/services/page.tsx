import Footer from "../_components/marketing-footer"
import Hero from "./components/Hero"
import Navigation from "../_components/marketing-navigation"
import { PoppinFont } from "@/app/(marketing)/index/Index"
import Calendly from "@/app/(marketing)/index/components/Calendly"
import ServicesTab from "./components/ServicesTab"

const Services = () => {
  return (
    <div
      className={`relative flex w-full flex-col overflow-x-hidden overflow-y-hidden bg-[#030303] ${PoppinFont.className}`}
    >
      <Navigation />
      <Hero />

      <ServicesTab />
      <Calendly />
      <Footer />
    </div>
  )
}

export default Services
