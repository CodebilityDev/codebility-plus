"use client";

import H2 from "@/components/shared/home/H2";
import Heading3 from "@/components/shared/home/Heading3";

import MarketingProgressiveSection from "../../_shared/MarketingProgressiveSection";
import ProgressiveMotion from "../../_shared/ProgressiveMotion";
import Section from "../../_shared/CodevsSection";

export const inter = { className: "font-sans" };
export const outfit = { className: "font-sans" };

const techCategories = [
  {
    id: 1,
    category: "Frontend",
    technologies: [
      { name: "React", className: "bg-customBlue-100/10 border-customBlue-100/20 text-customBlue-100" },
      { name: "Next.js", className: "bg-customViolet-100/10 border-customViolet-100/20 text-customViolet-100" },
      { name: "TypeScript", className: "bg-customTeal/10 border-customTeal/20 text-customTeal" },
      { name: "Tailwind CSS", className: "bg-customBlue-100/10 border-customBlue-100/20 text-customBlue-100" },
      { name: "Vue.js", className: "bg-customViolet-100/10 border-customViolet-100/20 text-customViolet-100" },
      { name: "Angular", className: "bg-customTeal/10 border-customTeal/20 text-customTeal" },
    ],
  },
  {
    id: 2,
    category: "Backend",
    technologies: [
      { name: "Node.js", className: "bg-customTeal/10 border-customTeal/20 text-customTeal" },
      { name: "Python", className: "bg-customViolet-100/10 border-customViolet-100/20 text-customViolet-100" },
      { name: "Java", className: "bg-customBlue-100/10 border-customBlue-100/20 text-customBlue-100" },
      { name: "C#", className: "bg-purple-500/10 border-purple-500/20 text-purple-500" },
      { name: "PHP", className: "bg-customTeal/10 border-customTeal/20 text-customTeal" },
      { name: "Go", className: "bg-customViolet-100/10 border-customViolet-100/20 text-customViolet-100" },
    ],
  },
  {
    id: 3,
    category: "Database",
    technologies: [
      { name: "PostgreSQL", className: "bg-customBlue-100/10 border-customBlue-100/20 text-customBlue-100" },
      { name: "MongoDB", className: "bg-customViolet-100/10 border-customViolet-100/20 text-customViolet-100" },
      { name: "MySQL", className: "bg-customTeal/10 border-customTeal/20 text-customTeal" },
      { name: "Redis", className: "bg-purple-500/10 border-purple-500/20 text-purple-500" },
      { name: "Supabase", className: "bg-customBlue-100/10 border-customBlue-100/20 text-customBlue-100" },
      { name: "Firebase", className: "bg-customViolet-100/10 border-customViolet-100/20 text-customViolet-100" },
    ],
  },
  {
    id: 4,
    category: "Cloud & DevOps",
    technologies: [
      { name: "AWS", className: "bg-customTeal/10 border-customTeal/20 text-customTeal" },
      { name: "Docker", className: "bg-customViolet-100/10 border-customViolet-100/20 text-customViolet-100" },
      { name: "Kubernetes", className: "bg-customBlue-100/10 border-customBlue-100/20 text-customBlue-100" },
      { name: "Vercel", className: "bg-purple-500/10 border-purple-500/20 text-purple-500" },
      { name: "GitHub Actions", className: "bg-customTeal/10 border-customTeal/20 text-customTeal" },
      { name: "Terraform", className: "bg-customViolet-100/10 border-customViolet-100/20 text-customViolet-100" },
    ],
  },
  {
    id: 5,
    category: "Mobile",
    technologies: [
      { name: "React Native", className: "bg-customBlue-100/10 border-customBlue-100/20 text-customBlue-100" },
      { name: "Flutter", className: "bg-customViolet-100/10 border-customViolet-100/20 text-customViolet-100" },
      { name: "Swift", className: "bg-customTeal/10 border-customTeal/20 text-customTeal" },
      { name: "Kotlin", className: "bg-purple-500/10 border-purple-500/20 text-purple-500" },
      { name: "Expo", className: "bg-customBlue-100/10 border-customBlue-100/20 text-customBlue-100" },
      { name: "Ionic", className: "bg-customViolet-100/10 border-customViolet-100/20 text-customViolet-100" },
    ],
  },
  {
    id: 6,
    category: "Tools & Others",
    technologies: [
      { name: "Git", className: "bg-customTeal/10 border-customTeal/20 text-customTeal" },
      { name: "Jest", className: "bg-customViolet-100/10 border-customViolet-100/20 text-customViolet-100" },
      { name: "Figma", className: "bg-customBlue-100/10 border-customBlue-100/20 text-customBlue-100" },
      { name: "Jira", className: "bg-purple-500/10 border-purple-500/20 text-purple-500" },
      { name: "Slack", className: "bg-customTeal/10 border-customTeal/20 text-customTeal" },
      { name: "VS Code", className: "bg-customViolet-100/10 border-customViolet-100/20 text-customViolet-100" },
    ],
  },
];

const TechBadge = ({ name, className }: { name: string; className: string }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium transition-all hover:opacity-90 ${className}`}
    >
      {name}
    </span>
  );
};

const TechCategoryCard = ({
  category,
}: {
  category: (typeof techCategories)[0];
}) => {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-gray-600 hover:bg-gray-900/70">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10">
        <h3 className="mb-4 text-lg font-semibold text-white">
          {category.category}
        </h3>

        <div className="flex flex-wrap gap-2">
          {category.technologies.map((tech) => (
            <TechBadge key={tech.name} name={tech.name} className={tech.className} />
          ))}
        </div>
      </div>
    </div>
  );
};

const TechStack = () => {
  const skeleton = (
    <div className="relative flex flex-col gap-4">
      <div className="flex flex-col">
        <div className="mx-auto">
          <H2 className={`${inter.className} text-edit`}>TECH STACK</H2>
        </div>
        <div className="text-gray mx-auto max-w-[650px] text-center">
          <Heading3>Work with the latest</Heading3>
          <H2 className={`${outfit.className} text-white`}>
            CUTTING-EDGE TECHNOLOGIES
          </H2>
        </div>
      </div>
      <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-6 px-6 md:grid-cols-2 lg:grid-cols-3">
        {techCategories.map((category) => (
          <TechCategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );

  return (
    <Section id="tech-stack" className="relative mx-0">
      <MarketingProgressiveSection skeleton={skeleton}>
        <div className="relative flex flex-col gap-4">
          <ProgressiveMotion
            className="flex flex-col"
            y={30}
            duration={0.6}
            staggerChildren={0.12}
          >
            <div data-progressive-child className="mx-auto">
              <H2 className={`${inter.className} text-edit`}>TECH STACK</H2>
            </div>
            <div
              data-progressive-child
              className="text-gray mx-auto max-w-[650px] text-center"
            >
              <Heading3>Work with the latest</Heading3>
              <H2 className={`${outfit.className} text-white`}>
                CUTTING-EDGE TECHNOLOGIES
              </H2>
            </div>
          </ProgressiveMotion>

          <ProgressiveMotion
            className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-6 px-6 md:grid-cols-2 lg:grid-cols-3"
            y={30}
            duration={0.55}
            staggerChildren={0.08}
          >
            {techCategories.map((category) => (
              <div key={category.id} data-progressive-child>
                <TechCategoryCard category={category} />
              </div>
            ))}
          </ProgressiveMotion>

          <ProgressiveMotion
            className="mx-auto mt-12 max-w-3xl text-center"
            y={24}
            duration={0.5}
            staggerChildren={0.1}
          >
            <p data-progressive-child className="mb-4 text-gray-300">
              Join our team and work with modern, industry-standard technologies.
              We continuously invest in the latest tools and frameworks to ensure
              our developers have the best resources to build exceptional software.
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
              Find Your Next Role
            </button>
          </ProgressiveMotion>
        </div>
      </MarketingProgressiveSection>
    </Section>
  );
};

export default TechStack;
