import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/">
      <Image
        src="/assets/svgs/logos/codebility-light.svg"
        width={150}
        height={40}
        className="h-[40px] w-[150px]"
        alt="Codebility"
        loading="eager"
        priority
      />
    </Link>
  );
};

export default Logo;
