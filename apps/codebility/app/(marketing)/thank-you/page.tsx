import Link from "next/link";
import Logo from "@/Components/shared/Logo";
import { Button } from "@/Components/ui/button";

const ThankYou = () => {
  return (
    <section className="bg-backgroundColor text-primaryColor flex h-screen w-screen items-center justify-center overflow-hidden">
      <div className="flex flex-col items-center gap-8 text-center lg:gap-10">
        <Logo />
        <div>
          <p className="mb-2 text-lg md:text-lg lg:text-2xl">
            Thank you for applying to Codebility.
          </p>
          <p className="text-gray mx-auto text-xs md:text-lg lg:max-w-[500px] lg:text-lg">
            Please wait while your application is being reviewed.
          </p>
        </div>
        <Link href="/">
          <Button className="from-teal to-violet h-10 w-28 rounded-full bg-gradient-to-r via-blue-100 p-0.5 hover:bg-gradient-to-br xl:h-12 xl:w-36">
            <span className="bg-black-100 flex h-full w-full items-center justify-center rounded-full text-lg text-white lg:text-lg">
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
  );
};

export default ThankYou;