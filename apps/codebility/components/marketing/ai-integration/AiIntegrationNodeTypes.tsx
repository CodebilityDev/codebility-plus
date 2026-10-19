
import { Handle, Position } from "reactflow";
import type { DevProcessCardProps } from "@/types/marketing/ai-integration/ai-integration";


export const DevProcessCard = ({ data: { id, title, process } }: DevProcessCardProps) => {
  return (
    <>
      <div className="m-2 flex flex-col gap-3 text-white">
        <p className="flex h-12 w-12 items-center justify-center rounded-full bg-customViolet-100 text-2xl font-medium">
          {id}
        </p>
        <h3 className="mt-5 text-xl font-semibold text-gray-900">{title}</h3>
        <div className="flex flex-col gap-3">
          {process.map((p) => (
            <p key={p} className="text-lg font-normal">
              {p}
            </p>
          ))}
        </div>
      </div>
      <Handle type="source" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="target" position={Position.Bottom} id="bottom" />
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="target" position={Position.Right} id="right" />
    </>
  );
};
