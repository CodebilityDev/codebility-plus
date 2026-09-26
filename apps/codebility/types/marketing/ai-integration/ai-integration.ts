import { StaticImageData } from "next/image";
import { NodeProps } from "reactflow";

export type DevProcessCardProps = NodeProps<{ id: string; title: string; process: string[] }>;

export interface ProcessCardProps {
  id: string;
  title: string;
  process: string[];
}

export interface UnparallelCardProps {
  title: string;
  description: string;
  image: StaticImageData | string;
}
