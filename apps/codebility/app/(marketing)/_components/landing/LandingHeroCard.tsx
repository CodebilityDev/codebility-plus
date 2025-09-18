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
      <div className="border-light-900/5 bg-light-700/10 hover:bg-light-700/30 flex min-h-[140px] w-full flex-col gap-3 rounded-md border-2 p-4 text-white backdrop-blur-lg duration-300 sm:gap-2 sm:p-6 md:min-h-[160px] lg:p-8">
        <div className="flex w-full flex-row items-start justify-between gap-3">
          <h3 className="text-lg font-medium leading-tight sm:text-xl md:text-2xl">{title}</h3>
          <span className="hero-change-bg-button flex size-8 flex-shrink-0 flex-col items-center justify-center rounded-full border-2 border-white/5 bg-white/5 sm:size-10">
            <Image
              src="/assets/svgs/icon-arrow-up-right.svg"
              width={12}
              height={12}
              alt="arrow up"
              className="sm:h-[15px] sm:w-[15px]"
            />
          </span>
        </div>
        <p className="text-sm leading-relaxed sm:text-base">{description}</p>
      </div>
    </Link>
  );
};

export default HeroCard;
