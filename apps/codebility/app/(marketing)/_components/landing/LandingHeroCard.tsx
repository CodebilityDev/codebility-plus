import Image from "next/image";
import Link from "next/link";

interface HeroCardProps {
  title: string;
  description: string;
  url?: string;
}

const HeroCard: React.FC<HeroCardProps> = ({
  title,
  description,
  url = "#",
}) => {
  return (
    <Link href={url} className="hero-card">
      <div className="border-light-900/5 bg-light-700/10 hover:bg-light-700/30 flex h-40 w-full flex-col gap-2 rounded-md border-2 p-8 text-white backdrop-blur-lg duration-300">
        <div className="flex w-full flex-row items-center justify-between">
          <h3 className="text-2xl font-medium">{title}</h3>
          <span className="hero-change-bg-button flex size-10 flex-col items-center justify-center rounded-full border-2 border-white/5 bg-white/5">
            <Image
              src="/assets/svgs/icon-arrow-up-right.svg"
              width={15}
              height={15}
              alt="arrow up"
            />
          </span>
        </div>
        <p>{description}</p>
      </div>
    </Link>
  );
};

export default HeroCard;
