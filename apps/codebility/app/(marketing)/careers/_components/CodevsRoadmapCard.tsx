interface Step {
  id: string;
  step: string;
}

interface RoadmapCardProps {
  id: string;
  phase: string;
  title: string;
  steps: Step[];
}

const RoadmapCard: React.FC<RoadmapCardProps> = ({
  id,
  phase,
  title,
  steps,
}) => {
  return (
    <div id={id} className="flex w-max flex-col gap-3 text-white md:mx-auto">
      <h3 className="text-customTeal text-lg font-medium xl:text-2xl">{phase}</h3>
      <h2 className="text-customTeal text-xl font-semibold xl:text-3xl">{title}</h2>
      <ul className="flex flex-col gap-3">
        {steps.map((data) => (
          <li key={data.id} className="flex gap-3">
            <span className="font-semibold xl:text-2xl">0{data.id}</span>
            <p className="xl:text-xl">{data.step}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoadmapCard;
