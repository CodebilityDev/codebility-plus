import Image from "next/image";
import { Handle, NodeProps, Position } from "reactflow";

type Props = NodeProps<{ id: string; title: string; process: string[] }>;

export const DevProcessCard = ({ data: { id, title, process } }: Props) => {
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

export const DevProcessImage = ({
  data: { src, alt, width, height },
}: NodeProps<{ src: string; alt: string; width: number; height: number }>) => {
  return (
    <div className="m-5 flex flex-col gap-3">
      <Image src={src} alt={alt} width={width} height={height} />
    </div>
  );
};

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
