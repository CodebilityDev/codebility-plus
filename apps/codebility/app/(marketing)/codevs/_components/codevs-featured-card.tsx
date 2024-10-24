import Image from "next/image";
import Link from "next/link";
import { featured_CardT } from "@/types/home";

const FeaturedCard = ({
  title,
  description,
  url,
  src,
  alt,
}: featured_CardT) => {
  return (
    <Link href={url || "#"} className="feature-card">
      <div className="border-light-900/5 bg-light-700/10 hover:bg-light-700/30 flex h-full w-full flex-col gap-2 rounded-md border-2 p-8 text-white backdrop-blur-lg duration-300">
        <span className="flex size-10 flex-col items-center justify-center">
          <Image src={src} width={30} height={30} alt={alt} unoptimized />
        </span>
        <div className="flex w-full flex-row items-center justify-between">
          <h3 className="text-2xl font-medium">{title}</h3>
        </div>
        <p>{description}</p>
      </div>
    </Link>
  );
};

export default FeaturedCard;
