import Image from "next/image";
import {
  IconNextJS,
  IconNodeJS,
  IconReact,
  IconTailwind,
} from "@/public/assets/svgs";

import OrbitingCircles from "./CodevsOrbitingCircles";

const OrbitingCirclesBackground = () => {
  return (
    <div className="absolute -right-72 z-0 hidden h-full w-full max-w-[60rem] items-center justify-center overflow-hidden rounded-lg md:flex md:shadow-xl">
      {/* Inner Circles */}
      <OrbitingCircles
        className="h-[50px] w-[50px]"
        duration={20}
        delay={30}
        radius={150}
      >
        <div className="relative h-full w-full">
          <Image
            src={IconTailwind}
            alt="Tailwind CSS"
            fill
            className="object-contain"
          />
        </div>
      </OrbitingCircles>
      <OrbitingCircles
        className="h-[50px] w-[50px]"
        duration={20}
        delay={20}
        radius={150}
      >
        <div className="relative h-full w-full">
          <Image
            src={IconNodeJS}
            alt="Tailwind CSS"
            fill
            className="object-contain"
          />
        </div>
      </OrbitingCircles>

      {/* Outer Circles (reverse) */}
      <OrbitingCircles
        className="h-[50px] w-[50px]"
        radius={330}
        duration={20}
        delay={30}
        reverse
      >
        <div className="relative h-full w-full">
          <Image
            src={IconNextJS}
            alt="Tailwind CSS"
            fill
            className="object-contain"
          />
        </div>
      </OrbitingCircles>
      <OrbitingCircles
        className="h-[50px] w-[50px]"
        radius={330}
        duration={20}
        delay={20}
        reverse
      >
        <div className="relative h-full w-full">
          <Image
            src={IconReact}
            alt="Tailwind CSS"
            fill
            className="object-contain"
          />
        </div>
      </OrbitingCircles>
    </div>
  );
};

export default OrbitingCirclesBackground;
