"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import ScrollToHash from "@/app/(home)/index/components/ScrollToHash"

const links = [
  { href: "/services", label: "Our Services" },
  { href: "/#whychooseus", label: "About Us" },
  { href: "/bookacall", label: "Book a Call" },
  { href: "/codevs", label: "Hire Codevs" },
]

const SideNavMenu = () => {
  const [isScrolling, setIsScrolling] = useState(false)

  const handleNav = () => {
    if (window.scrollY >= 200) {
      setIsScrolling(true)
    } else {
      setIsScrolling(false)
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", handleNav)
  }, [])

  return (
    <div className="fixed left-0 top-20 z-50 hidden w-60 flex-col gap-4 ps-5 pt-24 text-sm lg:flex xl:text-base">
      <ScrollToHash />
      {links.map((link, index) => (
        <Link key={index} href={link.href} className="hero-card relative duration-300 ">
          <div className="absolute -left-10 top-1/2 w-20 border border-darkgray" />
          <div
            className={`relative flex h-8 ${
              isScrolling ? "w-12 text-xs" : "w-36 text-base"
            } group items-center gap-2 rounded-md border-2 border-light-900/5 bg-light-700/10 ps-4 text-white backdrop-blur-lg duration-300 hover:ml-4 hover:w-36  hover:bg-[#9747FF] hover:text-base hover:text-opacity-100 hover:opacity-100 xl:h-10`}
          >
            <p
              className={`text-nowrap transition-opacity duration-300 ${
                isScrolling ? "opacity-0" : "opacity-100"
              } group-hover:opacity-100`}
            >
              {link.label}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default SideNavMenu
