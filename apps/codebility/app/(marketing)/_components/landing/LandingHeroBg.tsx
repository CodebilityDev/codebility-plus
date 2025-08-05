import Image from "next/image";

const HeroBackground = () => {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 -translate-y-1/2 transform overflow-hidden blur-3xl md:-top-40 lg:top-1/2"
      >
        <div
          style={{
            clipPath:
              "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
          }}
          className="relative aspect-[855/678] w-[40rem] bg-gradient-to-r from-[#00738B] via-[#0C3FDB] to-[#9707DD] opacity-30 sm:w-[72.1875rem]"
        />
      </div>
      <Image
        src={`https://codebility-cdn.pages.dev/assets/images/index/hero-image.png`}
        alt="Hero Background"
        width={910}
        height={420}
        className="absolute -right-[650px] top-[400px] hidden h-[420px] w-[910px] lg:block"
        
      />
    </>
  );
};

export default HeroBackground;
