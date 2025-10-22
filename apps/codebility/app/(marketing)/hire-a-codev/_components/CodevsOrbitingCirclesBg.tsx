import {
  IconNextJS,
  IconNodeJS,
  IconReact,
  IconTailwind,
} from "@/public/assets/svgs/techstack";

import OrbitingCircles from "./CodevsOrbitingCircles";

const OrbitingCirclesBackground = () => {
  return (
    <div className="absolute -right-72 z-0 hidden h-full w-full max-w-[60rem] items-center justify-center overflow-hidden rounded-lg md:flex md:shadow-xl">
      {/* Inner Circles */}
      <OrbitingCircles
        className="h-[90px] w-[90px]"
        duration={20}
        delay={30}
        radius={150}
      >
        <div
          style={{ transform: "scale(5)" }}
          className="flex items-center justify-center"
        >
          <IconTailwind />
        </div>
      </OrbitingCircles>
      <OrbitingCircles
        className="h-[90px] w-[90px]"
        duration={20}
        delay={20}
        radius={150}
      >
        <div
          style={{ transform: "scale(4)" }}
          className="flex items-center justify-center"
        >
          <IconNodeJS />
        </div>
      </OrbitingCircles>

      {/* Outer Circles (reverse) */}
      <OrbitingCircles
        className="!border-1 h-[90px] w-[90px]"
        radius={330}
        duration={20}
        delay={30}
        reverse
      >
        <div
          style={{ transform: "scale(5)" }}
          className="flex items-center justify-center"
        >
          <IconNextJS />
        </div>
      </OrbitingCircles>
      <OrbitingCircles
        className="h-[90px] w-[90px]"
        radius={330}
        duration={20}
        delay={20}
        reverse
      >
        <div
          style={{ transform: "scale(3.5)" }}
          className="flex items-center justify-center"
        >
          <IconReact />
        </div>
      </OrbitingCircles>
    </div>
  );
};

export default OrbitingCirclesBackground;
