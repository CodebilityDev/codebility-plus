import { SectionWrapper } from "@/Components/shared/home"
import { roadmapData } from "@/app/(marketing)/codevs/_components/data"
import RoadmapCard from "@/app/(marketing)/codevs/_components/codevs-roadmap-card"

const Roadmap = () => {
  return (
    <SectionWrapper id="roadmap" className="w-full xl:py-0">
      <div className="grid max-w-screen-2xl grid-cols-1 gap-10 md:grid-cols-2 md:place-items-start md:bg-roadmap md:bg-contain md:bg-center md:bg-no-repeat lg:hidden">
        {roadmapData.map((data) => (
          <RoadmapCard key={data.id} id={data.id} phase={data.phase} title={data.title} steps={data.steps} />
        ))}
      </div>

      <div className="mx-auto hidden max-w-screen-xl bg-roadmap bg-contain bg-center bg-no-repeat lg:relative lg:flex lg:h-[1000px]">
        <div className="absolute left-0 top-1/2 h-1/2 w-1/2 -translate-y-1/2 transform">
          <span className="absolute right-6 top-[220px] h-6 w-6 animate-ping rounded-full bg-purple-600 opacity-75 xl:right-10 xl:top-[213px]"></span>
          <div className="relative h-full w-full">
            <div className="absolute left-10 top-1/2 flex w-max -translate-y-1/2 transform flex-col gap-3 text-white md:mx-auto">
              <h3 className="text-lg font-medium text-teal xl:text-2xl">{roadmapData[0]?.phase}</h3>
              <h2 className="text-xl font-semibold text-teal xl:text-3xl">{roadmapData[0]?.title}</h2>
              <ul className="flex flex-col gap-3">
                {roadmapData[0]?.steps.map((data) => (
                  <li key={data.id} className="flex gap-3">
                    <span className="font-semibold xl:text-2xl">0{data.id}</span>
                    <p className="xl:text-xl">{data.step}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="absolute -bottom-0 -right-56 flex w-max flex-col gap-3 text-white md:mx-auto xl:-bottom-32">
              <h3 className="text-lg font-medium text-teal xl:text-2xl">{roadmapData[1]?.phase}</h3>
              <h2 className="text-xl font-semibold text-teal xl:text-3xl">{roadmapData[1]?.title}</h2>
              <ul className="flex flex-col gap-3">
                {roadmapData[1]?.steps.map((data) => (
                  <li key={data.id} className="flex gap-3">
                    <span className="font-semibold xl:text-2xl">0{data.id}</span>
                    <p className="xl:text-xl">{data.step}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <span className="absolute bottom-[366px] right-[100px] h-6 w-6 animate-ping rounded-full bg-purple-600 opacity-75 xl:bottom-[310px] xl:right-[167px]"></span>
        <div className="absolute right-0 top-0 h-1/2 w-1/2">
          <div className="relative h-full w-full">
            <div className="absolute -left-10 top-40  flex w-max flex-col gap-3 text-white md:mx-auto xl:-left-10 xl:top-16">
              <h3 className="text-lg font-medium text-teal xl:text-2xl">{roadmapData[2]?.phase}</h3>
              <h2 className="text-xl font-semibold text-teal xl:text-3xl">{roadmapData[2]?.title}</h2>
              <ul className="flex flex-col gap-3">
                {roadmapData[2]?.steps.map((data) => (
                  <li key={data.id} className="flex gap-3">
                    <span className="font-semibold xl:text-2xl">0{data.id}</span>
                    <p className="xl:text-xl">{data.step}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="absolute -bottom-0 -right-16 flex w-max flex-col gap-3 text-white md:mx-auto xl:-bottom-1 xl:-right-1">
              <h3 className="text-lg font-medium text-teal xl:text-2xl">{roadmapData[3]?.phase}</h3>
              <h2 className="text-xl font-semibold text-teal xl:text-3xl">{roadmapData[3]?.title}</h2>
              <ul className="flex flex-col gap-3">
                {roadmapData[3]?.steps.map((data) => (
                  <li key={data.id} className="flex gap-3">
                    <span className="font-semibold xl:text-2xl">0{data.id}</span>
                    <p className="xl:text-xl">{data.step}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}

export default Roadmap