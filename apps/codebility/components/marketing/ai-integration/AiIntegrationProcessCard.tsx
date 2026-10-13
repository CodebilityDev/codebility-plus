import type { ProcessCardProps } from "@/types/marketing/ai-integration/ai-integration";


const ProcessCard = ({ id, title, process }: ProcessCardProps) => {
  return (
    <div className="-mt-5 flex flex-col gap-3 text-white">
      <p className="flex h-12 w-12 items-center justify-center rounded-full bg-[#9747FF] text-xl font-medium">
        {id}
      </p>
      <h3 className="mt-5 text-lg font-semibold text-gray-900">{title}</h3>
      <div className="flex flex-col gap-3">
        {process.map((p) => (
          <p key={p} className="text-base font-normal">
            {p}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ProcessCard;
