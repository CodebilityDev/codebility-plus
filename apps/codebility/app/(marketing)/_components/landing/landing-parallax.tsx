import { services } from "../../_lib/dummy-data"
import Diamond from "@/app/(marketing)/_components/landing/landing-diamond"
import Marquee from "@/app/(marketing)/_components/landing/landing-marquee"

const Parallax = () => {
  return (
    <div className="text-md flex w-full flex-col items-center justify-center gap-4 border-y-4 border-light-900/5 bg-light-900/5 p-8 text-center text-white md:mt-20 md:text-xl lg:gap-8 lg:text-5xl">
      <Marquee>
        {services.map((data) => (
          <div key={data.id} className="flex items-center justify-center gap-5">
            <Diamond color={data.starColor} />
            <p>{data.title}</p>
          </div>
        ))}
      </Marquee>
      <Marquee reverse={true}>
        {services.map((data) => (
          <div key={data.id} className="flex items-center justify-center gap-5">
            <Diamond color={data.starColor} />
            <p>{data.title}</p>
          </div>
        ))}
      </Marquee>
    </div>
  )
}

export default Parallax