import { services } from "../../../../constants/landing_data";
import Section from "../MarketingSection";
import Diamond from "./LandingDiamond";
import Marquee from "./LandingMarquee";

const Parallax = () => {
  return (
    <div className="text-md border-light-900/5 bg-light-900/5 my-6 flex w-full flex-col items-center justify-center gap-4 border-y-4 p-8 text-center text-white md:text-xl lg:gap-8 lg:text-5xl">
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
  );
};

export default Parallax;
