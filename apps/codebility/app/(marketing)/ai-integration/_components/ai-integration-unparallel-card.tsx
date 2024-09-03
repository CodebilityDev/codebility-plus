import Image from "next/image"
import { StaticImageData } from "next/image"

interface Props {
  title: string
  description: string
  image: StaticImageData | string
}

const UnparallelCard = ({ title, description, image }: Props) => {
  return (
    <div className="w-[355px] h-[450px] flex flex-col gap-4 rounded-lg p-4 bg-white/5">
      <div>
        <Image
          src={image}
          alt={title}
          width={0}
          height={0}
          className="w-full h-[267px] rounded-md object-cover"
        />
      </div>
      <h2 className="text-lg font-semibold capitalize">{title}</h2>
      <p className="text-sm">{description}</p>
    </div>
  )
}

export default UnparallelCard
