import Image, { StaticImageData } from "next/image";

interface Props {
  title: string;
  description: string;
  image: StaticImageData | string;
}

const UnparallelCard = ({ title, description, image }: Props) => {
  return (
    <div className="flex h-[450px] w-[355px] flex-col gap-4 rounded-lg bg-white/5 p-4">
      <div>
        <Image
          src={image}
          alt={title}
          width={0}
          height={0}
          className="h-[267px] w-full rounded-md object-cover"
        />
      </div>
      <h2 className="text-lg font-semibold capitalize">{title}</h2>
      <p className="text-sm">{description}</p>
    </div>
  );
};

export default UnparallelCard;
