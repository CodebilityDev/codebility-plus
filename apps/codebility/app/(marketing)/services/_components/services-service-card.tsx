import Image from "next/image";

import { Service } from "../_types/service";

interface Props {
  service: Service;
}

export default function ServiceCard({ service }: Props) {
  const { name, mainImage, description } = service;

  return (
    <div className="border-light-900/5 bg-light-700/10 flex flex-1 flex-col gap-4 rounded-lg border-2 p-4 text-white">
      <Image
        src={
          mainImage
            ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/services-image/${mainImage}`
            : "https://codebility-cdn.pages.dev/assets/images/dafault-avatar-1248x845.jpg"
        }
        alt={name}
        width={600}
        height={600}
        className="h-full w-full rounded-lg object-cover"
        priority
      />
      <div className="flex basis-1/3 flex-col gap-3">
        <h3 className="text-base font-medium lg:text-xl">{name}</h3>
        <p className="line-clamp-3 text-sm lg:text-base">{description}</p>
      </div>
    </div>
  );
}
