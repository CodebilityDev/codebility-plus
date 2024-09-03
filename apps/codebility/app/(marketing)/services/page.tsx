import Footer from "../_components/marketing-footer"
import Hero from "./_components/services-hero"
import Navigation from "../_components/marketing-navigation"
import { PoppinFont } from "../_lib/font"
import Calendly from "../_components/marketing-calendly"
import ServicesTab from "./_components/services-tab"

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
