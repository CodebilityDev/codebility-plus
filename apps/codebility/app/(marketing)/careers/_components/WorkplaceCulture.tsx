"use client";

import H2 from "@/components/shared/home/H2";
import Heading3 from "@/components/shared/home/Heading3";
import { Users, Lightbulb, Target, Heart, Zap, Globe } from "lucide-react";

import MarketingProgressiveSection from "../../_shared/MarketingProgressiveSection";
import ProgressiveMotion from "../../_shared/ProgressiveMotion";
import Section from "../../_shared/CodevsSection";

export const inter = { className: "font-sans" };
export const outfit = { className: "font-sans" };

const workplaceCultureData = [
  {
    id: 1,
    title: "Collaborative Environment",
    description:
      "Work in cross-functional teams where every voice is heard and ideas flourish through open communication.",
    icon: Users,
    iconBg: "bg-customTeal/10",
    iconColor: "text-customTeal",
  },
  {
    id: 2,
    title: "Innovation Driven",
    description:
      "Stay at the forefront of technology with opportunities to work on cutting-edge projects and emerging technologies.",
    icon: Lightbulb,
    iconBg: "bg-customViolet-100/10",
    iconColor: "text-customViolet-100",
  },
  {
    id: 3,
    title: "Results Focused",
    description:
      "Deliver high-quality solutions that create real value for clients while maintaining excellent engineering standards.",
    icon: Target,
    iconBg: "bg-customBlue-100/10",
    iconColor: "text-customBlue-100",
  },
  {
    id: 4,
    title: "Work-Life Balance",
    description:
      "Enjoy flexible schedules, remote work options, and comprehensive benefits that support your well-being.",
    icon: Heart,
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-500",
  },
  {
    id: 5,
    title: "Continuous Growth",
    description:
      "Access learning resources, conference budgets, and mentorship programs to advance your technical expertise.",
    icon: Zap,
    iconBg: "bg-customTeal/10",
    iconColor: "text-customTeal",
  },
  {
    id: 6,
    title: "Global Impact",
    description:
      "Contribute to projects that serve clients worldwide and make a meaningful difference in various industries.",
    icon: Globe,
    iconBg: "bg-customViolet-100/10",
    iconColor: "text-customViolet-100",
  },
];

const CultureCard = ({
  item,
}: {
  item: (typeof workplaceCultureData)[0];
}) => {
  const Icon = item.icon;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-gray-600 hover:bg-gray-900/70">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10">
        <div className={`mb-4 inline-flex rounded-lg p-3 ${item.iconBg}`}>
          <Icon className={`h-6 w-6 ${item.iconColor}`} />
        </div>

        <h3 className="mb-3 text-lg font-semibold text-white">{item.title}</h3>

        <p className="text-sm leading-relaxed text-gray-300">{item.description}</p>
      </div>
    </div>
  );
};

const WorkplaceCulture = () => {
  const skeleton = (
    <div className="relative flex flex-col gap-4">
      <div className="flex flex-col">
        <div className="mx-auto">
          <H2 className={`${inter.className} text-edit`}>OUR WORKPLACE</H2>
        </div>
        <div className="text-gray mx-auto max-w-[650px] text-center">
          <Heading3>At Codebility we create</Heading3>
          <H2 className={`${outfit.className} text-white`}>
            A THRIVING PROFESSIONAL ENVIRONMENT
          </H2>
        </div>
      </div>
      <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-6 px-6 md:grid-cols-2 lg:grid-cols-3">
        {workplaceCultureData.map((item) => (
          <CultureCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );

  return (
    <Section id="workplace-culture" className="relative mx-0">
      <MarketingProgressiveSection skeleton={skeleton}>
        <div className="relative flex flex-col gap-4">
          <ProgressiveMotion
            className="flex flex-col"
            y={30}
            duration={0.6}
            staggerChildren={0.12}
          >
            <div data-progressive-child className="mx-auto">
              <H2 className={`${inter.className} text-edit`}>OUR WORKPLACE</H2>
            </div>
            <div
              data-progressive-child
              className="text-gray mx-auto max-w-[650px] text-center"
            >
              <Heading3>At Codebility we create</Heading3>
              <H2 className={`${outfit.className} text-white`}>
                A THRIVING PROFESSIONAL ENVIRONMENT
              </H2>
            </div>
          </ProgressiveMotion>

          <ProgressiveMotion
            className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-6 px-6 md:grid-cols-2 lg:grid-cols-3"
            y={30}
            duration={0.55}
            staggerChildren={0.08}
          >
            {workplaceCultureData.map((item) => (
              <div key={item.id} data-progressive-child>
                <CultureCard item={item} />
              </div>
            ))}
          </ProgressiveMotion>

          <ProgressiveMotion
            className="mt-12 text-center"
            y={24}
            duration={0.5}
            staggerChildren={0.1}
          >
            <p data-progressive-child className="mb-4 text-gray-300">
              Ready to join a team that values your growth and innovation?
            </p>
            <button
              data-progressive-child
              type="button"
              onClick={() => {
                document.getElementById("open-positions")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className="inline-flex items-center justify-center rounded-full border border-customViolet-100/20 bg-customViolet-100/10 px-6 py-3 text-sm font-medium text-customViolet-100 transition-all hover:border-customViolet-100/40 hover:bg-customViolet-100/20"
            >
              View Open Positions
            </button>
          </ProgressiveMotion>
        </div>
      </MarketingProgressiveSection>
    </Section>
  );
};

export default WorkplaceCulture;
