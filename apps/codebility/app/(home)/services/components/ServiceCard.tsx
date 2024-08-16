import Image from "next/image"
import { services_ServiceCardT } from "@/types/home"

const ServiceCard = ({ projectName, description, projectImage }: services_ServiceCardT) => {
  return (
    <div className="flex flex-1 flex-col gap-4 rounded-lg border-2 border-light-900/5 bg-light-700/10 p-4 text-white">
      <Image
        src={projectImage || "https://codebility-cdn.pages.dev/assets/images/dafault-avatar-1248x845.jpg"}
        alt={projectName + "Image"}
        width={300}
        height={300}
        className="h-full w-full rounded-lg object-cover"
        priority
      />
      <div className="flex flex-col gap-3">
        <h3 className="text-base font-medium lg:text-xl">{projectName}</h3>
        <p className="line-clamp-3 text-sm lg:text-base">{description}</p>
      </div>
    </div>
  )
}

export default ServiceCard
