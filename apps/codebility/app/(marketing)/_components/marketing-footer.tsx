"use client"

import Container from "./marketing-container"
import Logo from "@/Components/shared/Logo"
import Link from "next/link"
import { useModal } from "@/hooks/use-modal"
import { aboutUsData, companyData, connectUsData } from "../_lib/dummy-data"
import { IconFacebookWhite } from "@/public/assets/svgs"

const Footer = () => {
  const { onOpen } = useModal()

  return (
    <section className="w-full xl:mb-10">
      <Container className="mx-auto flex flex-col gap-2 bg-black-600 text-white xl:rounded-3xl">
        <div className="flex flex-col gap-4 md:p-8 lg:flex-row lg:gap-6">
          <div className="flex basis-[25%] flex-col gap-2">
            <Logo />
            <h3 className="text-gray">We serve as a dynamic hub for innovation, fostering a creative environment</h3>
          </div>
          <div className="flex basis-[70%] flex-col gap-6 lg:flex-row lg:gap-20">
            <div className="flex flex-1 flex-col gap-2 text-gray">
              <h4 className="pb-1 text-lg text-white">About us</h4>
              <div className="flex flex-wrap gap-4 lg:flex-col lg:gap-2">
                {aboutUsData.map((data) => (
                  <Link key={data.id} href={`${data.href}`}>
                    <p>{data.title}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-2 text-gray">
              <h4 className="pb-1 text-lg text-white">Company</h4>
              <ul className="flex flex-wrap gap-4 lg:flex-col lg:gap-2">
                {companyData.map((data) => (
                  <li key={data.id}>
                    <button onClick={() => onOpen(data.href)}>{data.title}</button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-1 flex-col gap-2 text-gray">
              <h4 className="pb-1 text-lg text-white">Connect Us</h4>
              <div className="flex items-center gap-4">
                {connectUsData.map((social) => {
                  const IconComponent = social.icon
                  return (
                    <Link key={social.id} href={social.href} target="_blank">
                      <IconComponent
                        className={`${
                          IconComponent === IconFacebookWhite ? "h-[25px] w-[25px]" : "h-[32px] w-[32px]"
                        }`}
                      />
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="flex border-t border-darkgray px-0 py-3 md:p-8 lg:items-center lg:justify-center">
          <p className="text-md text-gray">
            Copyright {new Date().getFullYear()} <Link href="/">Codebility</Link>. All Right Reserved.
          </p>
        </div>
      </Container>
    </section>
  )
}

export default Footer
