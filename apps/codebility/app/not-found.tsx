import { Button } from "@/Components/ui/button"
import Image from "next/image"
import Link from "next/link"

const NotFoundPage = () => {
  return (
    <section className="flex h-screen w-screen items-center justify-center overflow-hidden bg-backgroundColor text-primaryColor">
      <div className="flex flex-col gap-8 text-center lg:gap-10">
        <Link href="/">
          <Image
            className="mx-auto h-auto w-[250px] md:w-[350px] lg:w-[400px]"
            src="/assets/svgs/codebility-dark-blue.svg"
            alt="Codebility Logo"
            priority
            width={400}
            height={90}
          />
        </Link>

        <div className="flex flex-col gap-2">
          <p className="text-3xl font-bold text-white md:text-6xl lg:text-7xl">404</p>
          <p className="mx-auto text-sm font-bold uppercase text-white md:text-xl lg:max-w-[500px] lg:text-2xl">
            Page Not Found
          </p>
        </div>

        <Link
          href="/"
          className="mx-auto h-12 w-44 rounded-full bg-gradient-to-r from-teal via-blue-100 to-violet p-0.5 hover:bg-gradient-to-br"
        >
          <Button className="flex h-full w-full items-center justify-center rounded-full bg-black-500 text-sm text-white lg:text-lg">
            Go to Home Page
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

export default NotFoundPage
