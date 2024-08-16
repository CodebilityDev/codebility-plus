import { roadmap_CardT } from "@/types/home"

const RoadmapCard = ({ id, phase, title, steps }: roadmap_CardT) => {
  return (
    <div id={id} className="flex w-max flex-col gap-3 md:mx-auto text-white">
      <h3 className="text-lg xl:text-2xl font-medium text-teal">{phase}</h3>
      <h2 className="text-xl xl:text-3xl font-semibold text-teal">{title}</h2>
      <ul className="flex flex-col gap-3">
        {steps.map((data) => (
          <li key={data.id} className="flex gap-3">
            <span className="xl:text-2xl font-semibold">0{data.id}</span>
            <p className="xl:text-xl">{data.step}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RoadmapCard
