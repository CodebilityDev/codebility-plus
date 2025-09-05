import Image from "next/image";

interface FeaturesCardProps {
  imageName: string;
  imageAlt: string;
  title: string;
  description: string;
}

const FeaturesCard: React.FC<FeaturesCardProps> = ({
  imageName,
  imageAlt,
  title,
  description,
}) => {
  return (
    <div className="border-dark-100 bg-black-600 z-10 w-full rounded-lg border-2 p-4">
      <div className="flex flex-col gap-3">
        <div className="block">
          <Image
            src={imageName}
            alt={imageAlt}
            width={450}
            height={300}
            priority
            className="h-[250px] w-[370px] object-cover"
          />
        </div>
        <h3 className="text-lg">{title}</h3>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
};

export default FeaturesCard;
