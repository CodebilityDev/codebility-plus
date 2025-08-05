import Container from "../../_components/MarketingContainer";
import SideNavMenu from "../../_components/MarketingSidenavMenu";

export default function Hero() {
  return (
    <div className="relative">
      <section className="relative mt-2 flex min-h-[300px] w-full flex-col items-center justify-center overflow-hidden bg-cover bg-no-repeat lg:mt-20">
        <SideNavMenu />
        <Container className="text-white">
          <div className="relative z-10 flex flex-col gap-4 pt-20 text-center lg:pt-0">
            <h1 className="flex flex-col gap-1 text-4xl font-semibold md:text-6xl">
              Our Services
            </h1>
            <h2 className="text-2xl">
              Partner with Us to Bring Your Vision to Life
            </h2>
          </div>
        </Container>
      </section>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 -translate-y-1/2 transform overflow-hidden blur-3xl md:-top-40 lg:top-1/2"
      >
        <div
          style={{
            clipPath:
              "polygon(20.7% 28%, 76.2% 29%, 89.8% 59.5%, 87.3% 98%, 70% 100%, 30% 100%, 9.4% 96.8%, 7.3% 64.8%)",
          }}
          className="relative aspect-[855/678] w-[40rem] bg-customBlue-200 opacity-30 sm:w-[72.1875rem]"
        />
      </div>
    </div>
  );
}
