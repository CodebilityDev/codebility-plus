import OrbitingCircles from "@/app/(marketing)/codevs/components/OrbitingCircles"
import { IconNextJS, IconReact, IconTailwind, IconNodeJS } from "@/public/assets/svgs"

const OrbitingCirclesBackground = () => {
  return (
    <div className="hidden absolute -right-72 z-0 md:flex h-full w-full max-w-[60rem] items-center justify-center overflow-hidden rounded-lg md:shadow-xl">
      {/* Inner Circles */}
      <OrbitingCircles className="h-[50px] w-[50px]" duration={20} delay={30} radius={150}>
        <IconTailwind className="h-full w-full" />
      </OrbitingCircles>
      <OrbitingCircles className="h-[50px] w-[50px]" duration={20} delay={20} radius={150}>
        <IconNodeJS className="h-full w-full" />
      </OrbitingCircles>

      {/* Outer Circles (reverse) */}
      <OrbitingCircles className="h-[50px] w-[50px]" radius={330} duration={20} delay={30} reverse>
        <IconNextJS className="h-full w-full" />
      </OrbitingCircles>
      <OrbitingCircles className="h-[50px] w-[50px]" radius={330} duration={20} delay={20} reverse>
        <IconReact className="h-full w-full" />
      </OrbitingCircles>
    </div>
  )
}

export default OrbitingCirclesBackground

