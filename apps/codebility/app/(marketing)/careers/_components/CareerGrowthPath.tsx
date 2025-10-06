"use client";

import { SectionWrapper } from "@/components/shared/home";
import { Briefcase, TrendingUp, Users, Award } from "lucide-react";

interface CareerPath {
  id: string;
  level: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  benefits: string[];
  color: string;
}

const careerPaths: CareerPath[] = [
  {
    id: "junior",
    level: "Entry Level",
    title: "Junior Developer",
    description: "Start your career with mentorship and hands-on experience in cutting-edge projects.",
    icon: Briefcase,
    benefits: [
      "Comprehensive onboarding program",
      "Dedicated mentor assignment",
      "Exposure to modern tech stack",
      "Code review and feedback culture"
    ],
    color: "customTeal"
  },
  {
    id: "mid",
    level: "Mid Level", 
    title: "Software Engineer",
    description: "Take ownership of features and contribute to architectural decisions while growing your expertise.",
    icon: TrendingUp,
    benefits: [
      "Lead feature development",
      "Cross-team collaboration",
      "Technical decision making",
      "Conference and training budget"
    ],
    color: "customBlue-100"
  },
  {
    id: "senior",
    level: "Senior Level",
    title: "Senior Engineer",
    description: "Drive technical excellence, mentor junior developers, and shape the future of our products.",
    icon: Users,
    benefits: [
      "Technical leadership opportunities",
      "Mentoring responsibilities", 
      "Architecture design input",
      "Flexible work arrangements"
    ],
    color: "customViolet-100"
  },
  {
    id: "lead",
    level: "Leadership",
    title: "Technical Lead",
    description: "Lead engineering teams, define technical strategy, and drive innovation across the organization.",
    icon: Award,
    benefits: [
      "Team management experience",
      "Strategic planning involvement",
      "Innovation project leadership",
      "Executive development program"
    ],
    color: "purple-500"
  }
];

const CareerGrowthCard = ({ path, index }: { path: CareerPath; index: number }) => {
  const Icon = path.icon;
  
  return (
    <div className="group relative">
      {/* Connecting line for desktop */}
      {index < careerPaths.length - 1 && (
        <div className="absolute -right-5 top-16 hidden h-0.5 w-10 bg-gradient-to-r from-gray-600 to-gray-400 lg:block" />
      )}
      
      <div className="relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-gray-600 hover:bg-gray-900/70">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <div className="relative z-10">
          {/* Icon and Level */}
          <div className="mb-4 flex items-center gap-3">
            <div className={`rounded-lg bg-${path.color}/10 p-3`}>
              <Icon className={`h-6 w-6 text-${path.color}`} />
            </div>
            <div>
              <span className={`text-sm font-medium text-${path.color}`}>
                {path.level}
              </span>
            </div>
          </div>

          {/* Title and Description */}
          <h3 className="mb-3 text-xl font-semibold text-white">
            {path.title}
          </h3>
          <p className="mb-4 text-sm text-gray-300 leading-relaxed">
            {path.description}
          </p>

          {/* Benefits */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-200">
              Growth Opportunities:
            </h4>
            <ul className="space-y-1">
              {path.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className={`mt-1.5 h-1.5 w-1.5 rounded-full bg-${path.color} flex-shrink-0`} />
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
  return (
    <SectionWrapper id="career-growth" className="w-full py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-500/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.3em] text-purple-200 mb-4">
            Career Growth
          </span>
          <h2 className="mb-4 text-4xl font-light tracking-tight text-white">
            Your Professional Journey
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            We believe in nurturing talent and providing clear paths for career advancement. 
            Join us and grow from junior developer to technical leader.
          </p>
        </div>

        {/* Desktop Layout - Horizontal */}
        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-8">
          {careerPaths.map((path, index) => (
            <CareerGrowthCard key={path.id} path={path} index={index} />
          ))}
        </div>

        {/* Mobile/Tablet Layout - Vertical */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:hidden">
          {careerPaths.map((path, index) => (
            <CareerGrowthCard key={path.id} path={path} index={index} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="mb-4 text-gray-300">
            Ready to take the next step in your career?
          </p>
          <button
            onClick={() => {
              document.getElementById('open-positions')?.scrollIntoView({ 
                behavior: 'smooth' 
              });
            }}
            className="inline-flex items-center justify-center rounded-full border border-customViolet-100/20 bg-customViolet-100/10 px-6 py-3 text-sm font-medium text-customViolet-100 transition-all hover:bg-customViolet-100/20 hover:border-customViolet-100/40"
          >
            Explore Open Positions
          </button>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default CareerGrowthPath;