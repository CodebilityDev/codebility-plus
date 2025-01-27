import Image from "next/image";
import { Project } from "@/types/home/codev";

interface Props {
  service: Project;
}

export default function ServiceCard({ service }: Props) {
  const { name, main_image, description } = service;

  // Resolve the correct image URL
  const imageUrl = main_image
    ? main_image.startsWith("public")
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/services-image/${main_image}`
      : main_image
    : "https://codebility-cdn.pages.dev/assets/images/default-avatar-1248x845.jpg";

  return (
    <div className="border-light-900/5 bg-light-700/10 flex flex-1 flex-col gap-4 rounded-lg border-2 p-4 text-white">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        <Image
          src={imageUrl}
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
          {description || "No description available."}
        </p>
      </div>
    </div>
  );
}
