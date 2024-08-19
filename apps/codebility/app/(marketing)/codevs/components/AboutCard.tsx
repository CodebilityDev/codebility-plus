import Image from "next/image"

import { codevs_AboutCardT } from "@/types/home"

const AboutCard = ({ icon, title, desc }: codevs_AboutCardT) => {
  return (
    <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-lg bg-black-100 px-6 text-center lg:h-64 xl:px-10">
      <Image src={`/assets/svgs/${icon}`} alt={title} width={40} height={40} className="h-[40px] w-[40px]" />
      <h3 className="font-semibold text-white lg:text-2xl">{title}</h3>
      <p className="text-sm text-gray lg:text-base">{desc}</p>
    </div>
  )
}

export default AboutCard
