import { H2, Paragraph } from "@/Components/shared/home"
import { Button } from "@/Components/ui/button"
import useAuth from "@/hooks/use-auth"
import Image from "next/image"
import Link from "next/link"
import React from "react"

const CTA = () => {
  const { userData } = useAuth()

  return (
    <div className="mx-auto flex h-screen w-full max-w-3xl flex-col items-center justify-center gap-4 px-5 text-center text-white">
      <Image
        src="/assets/images/CTA.png"
        alt="Codebility Devices"
        width={100}
        height={100}
        className="z-10 h-[200px] w-[200px] object-contain"
      />
      <H2 className="capitalize text-primaryColor">
        Become A <span className="text-[#9747FF]">Codev!</span>
      </H2>

      <Paragraph className="lg:max-w-auto z-10 mx-auto max-w-[550px]">
        Unlock your potential and embark on a journey of innovation and mastery with Codebility.
      </Paragraph>

      <Link href={userData ? "/dashboard" : "/auth/signin"}>
        <Button variant="purple" size="lg" rounded="full" className="md:w-40">
          {userData ? "Dashboard" : "Join Now"}
        </Button>
      </Link>
    </div>
  )
}

export default CTA
