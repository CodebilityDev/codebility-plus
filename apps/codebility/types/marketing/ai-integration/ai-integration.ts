import type { StaticImageData } from "next/image";
import type { NodeProps } from "reactflow";

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

export interface GradientBackgroundWhiteProps { className: string }

export interface PartnerCardProps {
  title: string;
  description: string;
}
