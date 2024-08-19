import { Poppins } from "next/font/google"

import Navigation from "@/app/(marketing)/Navigation"
import Footer from "@/app/(marketing)/Footer"
import Hero from "@/app/(marketing)/index/components/Hero"
import Admins from "@/app/(marketing)/index/components/Admins"
import Parallax from "@/app/(marketing)/index/components/Parallax"
import Calendly from "@/app/(marketing)/index/components/Calendly"
import Features from "@/app/(marketing)/index/components/Features"
import WorkWithUs from "@/app/(marketing)/index/components/WorkWithUs"
import WhyChooseUs from "@/app/(marketing)/index/components/WhyChooseUs"

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
