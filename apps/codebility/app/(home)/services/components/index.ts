import { StaticImageData } from "next/image"

export type ServiceTabCardProps = {
  id?: string
  projectName: string
  description?: string
  projectImage?: StaticImageData | string
  projectType?: string
}
