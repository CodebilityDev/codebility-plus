import { Poppins } from "next/font/google"

import Navigation from "@/app/(home)/Navigation"
import Footer from "@/app/(home)/Footer"
import Hero from "@/app/(home)/index/components/Hero"
import Admins from "@/app/(home)/index/components/Admins"
import Parallax from "@/app/(home)/index/components/Parallax"
import Calendly from "@/app/(home)/index/components/Calendly"
import Features from "@/app/(home)/index/components/Features"
import WorkWithUs from "@/app/(home)/index/components/WorkWithUs"
import WhyChooseUs from "@/app/(home)/index/components/WhyChooseUs"

export const PoppinFont = Poppins({
  weight: ["400"],
  style: "normal",
  subsets: ["latin"],
})

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
