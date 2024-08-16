"use client"

import Image from "next/image"
import Link from "next/link"
import ResetPasswordForm from "@/app/auth/reset-password/[token]/ResetPasswordForm"

const ForgotPassword = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black-500 px-3.5 text-white lg:flex-row">
      <div className="flex h-full w-full flex-col justify-between gap-6 rounded-2xl border border-zinc-800 p-10 md:w-[500px]">
        <Link href="/" className="mx-auto ">
          <Image src="/assets/svgs/codebility-white.svg" width={150} height={67} alt="Codebility Logo" />
        </Link>

        <ResetPasswordForm />
      </div>
    </div>
  )
}

export default ForgotPassword
