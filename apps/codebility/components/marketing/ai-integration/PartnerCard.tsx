import { NodeProps, Handle, Position } from "reactflow";

export const PartnerCard = ({
  data: { title, description },
}: NodeProps<{ title: string; description: string }>) => {
  return (
    <div className="flex flex-col gap-3 rounded-lg bg-white/5 p-5 lg:w-96">
      <h3 className="text-xl font-semibold text-customViolet-100">{title}</h3>
      <p className="text-base font-normal">{description}</p>
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="target" position={Position.Bottom} id="bottom" />
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="target" position={Position.Right} id="right" />
    </div>
  );
};
