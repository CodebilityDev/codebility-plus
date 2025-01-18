import Image from "next/image";

import { Service } from "../_types/service";

interface Props {
  service: Service;
}

export default function ServiceCard({ service }: Props) {
  const { name, mainImage, description } = service;

  const isImageUrlSegmented = mainImage && mainImage.split("/")[0] === "public";

  return (
    <div className="border-light-900/5 bg-light-700/10 flex flex-1 flex-col gap-4 rounded-lg border-2 p-4 text-white">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        <Image
          src={
            mainImage && isImageUrlSegmented
              ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/services-image/${mainImage}`
              : mainImage && !isImageUrlSegmented
                ? mainImage
                : "https://codebility-cdn.pages.dev/assets/images/dafault-avatar-1248x845.jpg"
          }
          alt={name}
          fill
          sizes="600px"
          className="absolute bg-center object-cover"
          priority
        />
      </div>
      <div className="flex basis-1/4 flex-col gap-3">
        <h3 className="line-clamp-1 text-base font-medium lg:text-xl">
          {name}
        </h3>
        <p className="line-clamp-3 text-ellipsis text-sm lg:text-base">
          {description}
        </p>
      </div>
    </div>
  );
}
