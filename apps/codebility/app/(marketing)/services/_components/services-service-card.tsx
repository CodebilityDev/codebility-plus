import Image from "next/image"
import { Service } from "../_types/service"
interface Props {
  service: Service;
}

export default function ServiceCard({ service }: Props) {
  const { name, main_image_url, description} = service;

  return (
    <div className="flex flex-1 flex-col gap-4 rounded-lg border-2 border-light-900/5 bg-light-700/10 p-4 text-white">
      <Image
        src={main_image_url ? (`${process.env.NEXT_PUBLIC_SUPABASE_URL}/${main_image_url}`) : "https://codebility-cdn.pages.dev/assets/images/dafault-avatar-1248x845.jpg"}
        alt={name}
        width={300}
        height={300}
        className="h-full w-full rounded-lg object-cover"
        priority
      />
      <div className="flex flex-col gap-3">
        <h3 className="text-base font-medium lg:text-xl">{name}</h3>
        <p className="line-clamp-3 text-sm lg:text-base">{description}</p>
      </div>
    </div>
  )
}