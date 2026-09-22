import Image from "next/image";
import { outerSpace } from "@/public/assets/images/ai-integration";

const HeroBackground = () => {
  return (
    <>
      <div
        className="mx-auto"
        style={{
          background:
            "linear-gradient(180deg, rgba(13, 13, 13, 0) 0%, #030303 100%)",
        }}
      >
        <Image
          width={0}
          height={0}
          src={outerSpace}
          alt="Outer's Space Background"
          className="mask-fade-x absolute left-1/2 top-0 h-auto w-full max-w-[1440px] -translate-x-1/2 object-contain"
          sizes="(min-width: 1441px) 1440px, 100vw"
          priority
        />
        <div
          className="absolute -top-96 left-0 h-[1100px] w-80 blur-3xl md:w-1/2 xl:-top-96 xl:left-10 xl:h-[1229.24px] xl:w-[663.11px]"
          style={{
            borderRadius: "576px 0px 0px 0px",
            background:
              "radial-gradient(50% 50% at 50% 50%, rgba(151, 71, 255, 0.3) 0%, rgba(3, 3, 3, 0.3) 100%)",
          }}
        />
      </div>
    </>
  );
};

export default HeroBackground;
