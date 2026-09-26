import Image from "next/image";
import { NodeProps } from "reactflow";

export const DevProcessImage = ({
  data: { src, alt, width, height },
}: NodeProps<{ src: string; alt: string; width: number; height: number }>) => {
  return (
    <div className="m-5 flex flex-col gap-3">
      <Image src={src} alt={alt} width={width} height={height} />
    </div>
  );
};
