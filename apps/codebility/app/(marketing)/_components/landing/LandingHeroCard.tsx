import Image from "next/image";
import Link from "next/link";

interface HeroCardProps {
  title: string;
  description: string;
  url?: string;
  category?: string;
}

const HeroCard: React.FC<HeroCardProps> = ({ title, description, url = "#", category }) => {
  return (
    <Link href={url} className="hero-card block h-full">
      <div className="border-light-900/5 bg-light-700/10 hover:bg-light-700/30 flex h-[320px] flex-col justify-between rounded-xl border-2 p-8 text-white backdrop-blur-lg duration-300 sm:h-[340px] sm:p-10">
        <div className="flex w-full flex-col gap-3">
          {category && (
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/60 sm:text-xs">{category}</p>
          )}
          <h3 className="text-lg font-semibold leading-tight sm:text-xl line-clamp-2">{title}</h3>
        </div>
        <p className="text-sm leading-relaxed text-white/80 sm:text-base line-clamp-6 mt-auto">{description}</p>
      </div>
    </Link>
  );
};

export default HeroCard;
