import Link from "next/link"
import { Rowdies } from "next/font/google"
import { Button } from "@/Components/ui/button"
import OrbitingCirclesBackground from "@/app/(marketing)/codevs/_components/codevs-orbiting-circles-bg"
import SideNavMenu from "@/app/(marketing)/_components/marketing-sidenav-menu"
import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client"

const rowdies = Rowdies({
  weight: "300",
  subsets: ["latin"],
})

export default async function Hero() {
  const supabase = getSupabaseServerComponentClient();
  const { data: { user }} = await supabase.auth.getUser();

  return (
    <section
      id="home"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-cover bg-no-repeat"
    >
      <SideNavMenu />
      <div
        className="absolute left-1/2 top-1/2 h-[1100px] w-96 -translate-x-1/2 -translate-y-1/2 blur-3xl md:w-full xl:-left-10 xl:-top-96 xl:h-[1562.01px] xl:w-[1044.36px] xl:-translate-x-0 xl:-translate-y-0"
        style={{
          background: "radial-gradient(50% 50% at 50% 50%, rgba(151, 71, 255, 0.3) 0%, rgba(3, 3, 3, 0.3) 100%)",
        }}
      ></div>
      <OrbitingCirclesBackground />
      <div className="z-10 flex w-full flex-col gap-3 p-4 text-center text-white">
        <p className="text-sm lg:text-xl">Be part of our Community</p>
        <div className="relative">
          <h1
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl uppercase tracking-widest opacity-5 md:text-6xl lg:text-9xl ${rowdies.className}`}
          >
            Codebility
          </h1>
          <h2 className="text-xl font-semibold lg:text-5xl">Join Our Inclusive Community </h2>
        </div>
        <p className="text-xs md:text-sm lg:text-2xl">Where Diversity Flourishes and Connections Thrive</p>
        <div className="mx-auto mt-6 flex w-full flex-col justify-center gap-6 md:flex-row">
          <Link href={user ? "/dashboard" : "/auth/signin"}>
            <Button variant="purple" size="lg" rounded="full" className="md:w-40">
              {user ? "Dashboard" : "Join"}
            </Button>
          </Link>
          <Link href="#codevs">
            <Button className="h-12 rounded-full bg-gradient-to-r from-teal via-blue-100 to-violet p-0.5 hover:bg-gradient-to-br md:w-40">
              <span className="flex h-full w-full items-center justify-center rounded-full bg-black-500 text-sm text-white lg:text-lg">
                Hire Codevs
              </span>
            </Button>
          </Link>
        </div>
      </div>

      {/* old background */}
      {/* <div className="hero-gradient absolute -top-80 z-10  h-[400px] w-screen blur-[200px] md:blur-[500px]"></div> */}

      <div className="hero-bubble">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} />
        ))}
      </div>
    </section>
  )
}