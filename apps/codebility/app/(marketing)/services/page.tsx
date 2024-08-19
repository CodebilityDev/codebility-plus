import Footer from "@/app/(marketing)/Footer"
import Hero from "@/app/(marketing)/services/components/Hero"
import Navigation from "@/app/(marketing)/Navigation"
import { PoppinFont } from "@/app/(marketing)/index/Index"
import Calendly from "@/app/(marketing)/index/components/Calendly"
import ServicesTab from "@/app/(marketing)/services/components/ServicesTab"

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
