import Image from "next/image";
import Link from "next/link";
import { Heading3 } from "@/components/shared/home";
import { IconArrowRight } from "@/public/assets/svgs";

interface FeaturedProjectCardProps {
  name: string;
  image: string;
  logo: string;
  desc: string;
  link?: string; // Optional
}

const FeaturedProjectCard: React.FC<FeaturedProjectCardProps> = ({
  name,
  image,
  logo,
  desc,
  link,
}) => {
  return (
    <div className="bg-black-400 relative flex flex-col items-center justify-center gap-6 border-zinc-800 p-0 lg:flex-row lg:border lg:p-10">
      <div className="order-2 flex basis-[50%] flex-col items-center justify-center gap-6 lg:order-2 lg:items-start">
        <Image
          src={`/assets/images/${logo}`}
          alt={`${name} logo`}
          width={150}
          height={150}
          className="h-[150px] w-[150px] object-contain lg:h-[120px] lg:w-[120px]"
        />
        <div className="text-center lg:text-left">
          <Heading3>{name}</Heading3>
          <p className="text-gray">{desc}</p>
        </div>
        {link && (
          <Link
            href={link}
            target="_blank"
            className="mb-2 flex items-center gap-2 text-blue-100 duration-300 hover:ml-4"
          >
            Explore <IconArrowRight />
          </Link>
        )}
      </div>
      <div className="order-1 basis-[50%] lg:order-2">
        <Image
          src={`/assets/images/${image}`}
          alt={name}
          width={700}
          height={410}
          className="h-auto w-full object-contain"

        />
      </div>
    </div>
  );
};

export default FeaturedProjectCard;
