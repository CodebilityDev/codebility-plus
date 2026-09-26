import { NodeProps, Handle, Position } from "reactflow";

export const PartnerTitle = ({
  data: { title },
}: NodeProps<{ title: string }>) => {
  return (
    <>
      <h2 className="m-5 w-80 text-center text-4xl text-white">{title}</h2>
      <Handle type="source" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />
    </>
  );
};
