import Image from "next/image";

interface AboutCardProps {
  icon: string;
  title: string;
  desc: string;
}

const AboutCard: React.FC<AboutCardProps> = ({ icon, title, desc }) => {
  return (
    <div className="bg-black-100 flex h-48 flex-col items-center justify-center gap-2 rounded-lg px-6 text-center lg:h-64 xl:px-10">
      <Image
        src={`/assets/svgs/${icon}`}
        alt={title}
        width={40}
        height={40}
        className="h-[40px] w-[40px]"
      />
      <h3 className="font-semibold text-white lg:text-2xl">{title}</h3>
      <p className="text-gray text-sm lg:text-base">{desc}</p>
    </div>
  );
};

export default AboutCard;
