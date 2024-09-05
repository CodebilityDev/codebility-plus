import { StaticImageData } from "next/image";

export type UnparallelCardProps = {
  title: string;
  description: string;
  image: StaticImageData | string;
};
