import Link from "next/link"

import Logo from "@/Components/shared/Logo"
import { Button } from "@/Components/ui/button"

const ThankYouPage = () => {
  return (
    <section className="flex h-screen w-screen items-center justify-center overflow-hidden bg-backgroundColor text-primaryColor">
      <div className="flex flex-col items-center gap-8 text-center lg:gap-10">
        <Logo />
        <div>
          <p className="mb-2 text-lg md:text-lg lg:text-2xl">Please wait for approval as an intern.</p>
          <p className="mx-auto text-xs text-gray md:text-lg lg:max-w-[500px] lg:text-lg">
            You will receive an email notification with the status.
          </p>
        </div>
        <Link href="/">
          <Button className="h-10 w-28 rounded-full bg-gradient-to-r from-teal via-blue-100 to-violet p-0.5 hover:bg-gradient-to-br xl:h-12 xl:w-36">
            <span className="flex h-full w-full items-center justify-center rounded-full bg-black-100 text-lg text-white lg:text-lg">
              Go to Home
            </span>
          </Button>
        </Link>

        <div className="hero-gradient absolute top-0 z-10 h-[400px] w-[200px] overflow-hidden blur-[200px] lg:w-[500px] lg:blur-[350px]"></div>

        <div className="hero-bubble">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ThankYouPage
