"use client";

import { SectionWrapper } from "@/components/shared/home";
import { Briefcase, TrendingUp, Users, Award } from "lucide-react";

import MarketingProgressiveSection from "../../_shared/MarketingProgressiveSection";
import ProgressiveMotion from "../../_shared/ProgressiveMotion";

interface CareerPath {
  id: string;
  level: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  benefits: string[];
  iconBg: string;
  iconColor: string;
  dotColor: string;
}

const careerPaths: CareerPath[] = [
  {
    id: "junior",
    level: "Entry Level",
    title: "Junior Developer",
    description:
      "Start your career with mentorship and hands-on experience in cutting-edge projects.",
    icon: Briefcase,
    benefits: [
      "Comprehensive onboarding program",
      "Dedicated mentor assignment",
      "Exposure to modern tech stack",
      "Code review and feedback culture",
    ],
    iconBg: "bg-customTeal/10",
    iconColor: "text-customTeal",
    dotColor: "bg-customTeal",
  },
  {
    id: "mid",
    level: "Mid Level",
    title: "Software Engineer",
    description:
      "Take ownership of features and contribute to architectural decisions while growing your expertise.",
    icon: TrendingUp,
    benefits: [
      "Lead feature development",
      "Cross-team collaboration",
      "Technical decision making",
      "Conference and training budget",
    ],
    iconBg: "bg-customBlue-100/10",
    iconColor: "text-customBlue-100",
    dotColor: "bg-customBlue-100",
  },
  {
    id: "senior",
    level: "Senior Level",
    title: "Senior Engineer",
    description:
      "Drive technical excellence, mentor junior developers, and shape the future of our products.",
    icon: Users,
    benefits: [
      "Technical leadership opportunities",
      "Mentoring responsibilities",
      "Architecture design input",
      "Flexible work arrangements",
    ],
    iconBg: "bg-customViolet-100/10",
    iconColor: "text-customViolet-100",
    dotColor: "bg-customViolet-100",
  },
  {
    id: "lead",
    level: "Leadership",
    title: "Technical Lead",
    description:
      "Lead engineering teams, define technical strategy, and drive innovation across the organization.",
    icon: Award,
    benefits: [
      "Team management experience",
      "Strategic planning involvement",
      "Innovation project leadership",
      "Executive development program",
    ],
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-500",
    dotColor: "bg-purple-500",
  },
];

const CareerGrowthCard = ({
  path,
  index,
}: {
  path: CareerPath;
  index: number;
}) => {
  const Icon = path.icon;

  return (
    <div className="group relative">
      {index < careerPaths.length - 1 && (
        <div className="absolute -right-5 top-16 hidden h-0.5 w-10 bg-gradient-to-r from-gray-600 to-gray-400 lg:block" />
      )}

      <div className="relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-gray-600 hover:bg-gray-900/70">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative z-10">
          <div className="mb-4 flex items-center gap-3">
            <div className={`rounded-lg p-3 ${path.iconBg}`}>
              <Icon className={`h-6 w-6 ${path.iconColor}`} />
            </div>
            <div>
              <span className={`text-sm font-medium ${path.iconColor}`}>
                {path.level}
              </span>
            </div>
          </div>

          <h3 className="mb-3 text-xl font-semibold text-white">{path.title}</h3>
          <p className="mb-4 text-sm leading-relaxed text-gray-300">
            {path.description}
          </p>

          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-200">
              Growth Opportunities:
            </h4>
            <ul className="space-y-1">
              {path.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div
                    className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${path.dotColor}`}
                  />
                  <span className="text-xs text-gray-400">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const CareerGrowthPath = () => {
  const skeleton = (
    <div className="mx-auto max-w-7xl px-6">
      <div className="mb-12 text-center">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-500/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.3em] text-purple-200">
          Career Growth
        </span>
        <h2 className="mb-4 text-4xl font-light tracking-tight text-white">
          Your Professional Journey
        </h2>
        <p className="mx-auto max-w-3xl text-lg text-gray-400">
          We believe in nurturing talent and providing clear paths for career
          advancement. Join us and grow from junior developer to technical
          leader.
        </p>
      </div>
      <div className="hidden lg:grid lg:grid-cols-4 lg:gap-8">
        {careerPaths.map((path, index) => (
          <CareerGrowthCard key={path.id} path={path} index={index} />
        ))}
      </div>
    </div>
  );

  return (
    <SectionWrapper id="career-growth" className="w-full py-20">
      <MarketingProgressiveSection skeleton={skeleton}>
        <div className="mx-auto max-w-7xl px-6">
          <ProgressiveMotion
            className="mb-12 text-center"
            y={30}
            duration={0.6}
            staggerChildren={0.12}
          >
            <span
              data-progressive-child
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-500/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.3em] text-purple-200"
            >
              Career Growth
            </span>
            <h2
              data-progressive-child
              className="mb-4 text-4xl font-light tracking-tight text-white"
            >
              Your Professional Journey
            </h2>
            <p
              data-progressive-child
              className="mx-auto max-w-3xl text-lg text-gray-400"
            >
              We believe in nurturing talent and providing clear paths for career
              advancement. Join us and grow from junior developer to technical
              leader.
            </p>
          </ProgressiveMotion>

          <ProgressiveMotion
            className="hidden lg:grid lg:grid-cols-4 lg:gap-8"
            y={30}
            duration={0.55}
            staggerChildren={0.1}
          >
            {careerPaths.map((path, index) => (
              <div key={path.id} data-progressive-child>
                <CareerGrowthCard path={path} index={index} />
              </div>
            ))}
          </ProgressiveMotion>

          <ProgressiveMotion
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:hidden"
            y={30}
            duration={0.55}
            staggerChildren={0.08}
          >
            {careerPaths.map((path, index) => (
              <div key={path.id} data-progressive-child>
                <CareerGrowthCard path={path} index={index} />
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
              Ready to take the next step in your career?
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
              Explore Open Positions
            </button>
          </ProgressiveMotion>
        </div>
      </MarketingProgressiveSection>
    </SectionWrapper>
  );
};

export default CareerGrowthPath;
