import Admins from "./_components/landing/landing-admins";
import Features from "./_components/landing/landing-features";
import Hero from "./_components/landing/landing-hero";
import Parallax from "./_components/landing/landing-parallax";
import Partners from "./_components/landing/landing-partners";
import WhyChooseUs from "./_components/landing/landing-why-choose-us";
import WorkWithUs from "./_components/landing/landing-work-with-us";
import Calendly from "./_components/marketing-calendly";
import Footer from "./_components/marketing-footer";
import Navigation from "./_components/marketing-navigation";

const Index = () => {
  return (
    <div
      className={`bg-black-400 relative flex w-full flex-col overflow-x-hidden overflow-y-hidden `}
    >
      <Navigation />
      <Hero />
      <Features />
      <Parallax />
      <WhyChooseUs />
      <WorkWithUs />
      <Admins />
      <Partners />
      <Calendly />
      <Footer />
    </div>
  );
};

export default Index;
