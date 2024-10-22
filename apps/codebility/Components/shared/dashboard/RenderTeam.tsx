import Image from "next/image";
import { defaultAvatar } from "@/public/assets/images";

interface Props {
  imgURL?: string;
  onClick?: () => void;
}

const RenderTeam = ({ imgURL, onClick }: Props) => {
  return (
    <div
      className="m-1 inline-flex h-[30px] w-[30px] items-center rounded-full bg-blue-600"
      onClick={onClick}
    >
      <Image
        alt="avatar"
        src={imgURL || defaultAvatar}
        width={30}
        height={30}
        className="rounded-full"
      />
    </div>
  );
};

export default RenderTeam;
