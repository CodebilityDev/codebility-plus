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
        <IconTailwind className="h-full w-full" />
      </OrbitingCircles>
      <OrbitingCircles
        className="h-[50px] w-[50px]"
        duration={20}
        delay={20}
        radius={150}
      >
        <IconNodeJS className="h-full w-full" />
      </OrbitingCircles>

      {/* Outer Circles (reverse) */}
      <OrbitingCircles
        className="h-[50px] w-[50px]"
        radius={330}
        duration={20}
        delay={30}
        reverse
      >
        <IconNextJS className="h-full w-full" />
      </OrbitingCircles>
      <OrbitingCircles
        className="h-[50px] w-[50px]"
        radius={330}
        duration={20}
        delay={20}
        reverse
      >
        <IconReact className="h-full w-full" />
      </OrbitingCircles>
    </div>
  );
};

export default OrbitingCirclesBackground;
