import Image from "next/image";

type featured_CardT = {
  title?: string;
  description?: string;
  url?: string;
  src: string;
  alt: string;
};

const FeaturedCard = ({ title, description, src, alt }: featured_CardT) => {
  return (
    <div className="feature-card cursor-pointer">
      <div className="border-light-900/5 bg-light-700/10 hover:bg-light-700/30 flex h-full w-full flex-col gap-2 rounded-md border-2 p-8 text-white backdrop-blur-lg duration-300">
        <span className="relative flex aspect-square w-[25px] flex-col items-center justify-center">
          <Image
            src={src}
            // width={30}
            // height={30}
            fill
            alt={alt}
            unoptimized
            // style={{ width: "auto", height: "auto" }}
            className="absolute bg-center object-contain"
          />
        </span>
        <div className="flex w-full flex-row items-center justify-between">
          <h3 className="text-2xl font-medium">{title}</h3>
        </div>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default FeaturedCard;
