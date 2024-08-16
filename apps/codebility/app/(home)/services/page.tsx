import Footer from "@/app/(home)/Footer"
import Hero from "@/app/(home)/services/components/Hero"
import Navigation from "@/app/(home)/Navigation"
import { PoppinFont } from "@/app/(home)/index/Index"
import Calendly from "@/app/(home)/index/components/Calendly"
import ServicesTab from "@/app/(home)/services/components/ServicesTab"

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
