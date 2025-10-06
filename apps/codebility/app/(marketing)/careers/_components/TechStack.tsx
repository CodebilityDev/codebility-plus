"use client";

import { motion } from "framer-motion";
import { fadeInOutDownToUp } from "@/components/FramerAnimation/Framer";
import H2 from "@/components/shared/home/H2";
import Heading3 from "@/components/shared/home/Heading3";
import Section from "../../_shared/CodevsSection";

export const inter = { className: "font-sans" };
export const outfit = { className: "font-sans" };

const techCategories = [
  {
    id: 1,
    category: "Frontend",
    technologies: [
      { name: "React", color: "customBlue-100" },
      { name: "Next.js", color: "customViolet-100" },
      { name: "TypeScript", color: "customTeal" },
      { name: "Tailwind CSS", color: "customBlue-100" },
      { name: "Vue.js", color: "customViolet-100" },
      { name: "Angular", color: "customTeal" }
    ]
  },
  {
    id: 2,
    category: "Backend", 
    technologies: [
      { name: "Node.js", color: "customTeal" },
      { name: "Python", color: "customViolet-100" },
      { name: "Java", color: "customBlue-100" },
      { name: "C#", color: "purple-500" },
      { name: "PHP", color: "customTeal" },
      { name: "Go", color: "customViolet-100" }
    ]
  },
  {
    id: 3,
    category: "Database",
    technologies: [
      { name: "PostgreSQL", color: "customBlue-100" },
      { name: "MongoDB", color: "customViolet-100" },
      { name: "MySQL", color: "customTeal" },
      { name: "Redis", color: "purple-500" },
      { name: "Supabase", color: "customBlue-100" },
      { name: "Firebase", color: "customViolet-100" }
    ]
  },
  {
    id: 4,
    category: "Cloud & DevOps",
    technologies: [
      { name: "AWS", color: "customTeal" },
      { name: "Docker", color: "customViolet-100" },
      { name: "Kubernetes", color: "customBlue-100" },
      { name: "Vercel", color: "purple-500" },
      { name: "GitHub Actions", color: "customTeal" },
      { name: "Terraform", color: "customViolet-100" }
    ]
  },
  {
    id: 5,
    category: "Mobile",
    technologies: [
      { name: "React Native", color: "customBlue-100" },
      { name: "Flutter", color: "customViolet-100" },
      { name: "Swift", color: "customTeal" },
      { name: "Kotlin", color: "purple-500" },
      { name: "Expo", color: "customBlue-100" },
      { name: "Ionic", color: "customViolet-100" }
    ]
  },
  {
    id: 6,
    category: "Tools & Others",
    technologies: [
      { name: "Git", color: "customTeal" },
      { name: "Jest", color: "customViolet-100" },
      { name: "Figma", color: "customBlue-100" },
      { name: "Jira", color: "purple-500" },
      { name: "Slack", color: "customTeal" },
      { name: "VS Code", color: "customViolet-100" }
    ]
  }
];

const TechBadge = ({ 
  tech 
}: { 
  tech: { name: string; color: string } 
}) => {
  return (
    <span 
      className={`inline-flex items-center rounded-full bg-${tech.color}/10 border border-${tech.color}/20 px-3 py-1 text-sm font-medium text-${tech.color} transition-all hover:bg-${tech.color}/20 hover:border-${tech.color}/40`}
    >
      {tech.name}
    </span>
  );
};

const TechCategoryCard = ({ 
  category 
}: { 
  category: typeof techCategories[0] 
}) => {
  return (
    <motion.div
      variants={fadeInOutDownToUp}
      initial="hidden"
      whileInView="visible"
      className="group relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-gray-600 hover:bg-gray-900/70"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative z-10">
        <h3 className="mb-4 text-lg font-semibold text-white">
          {category.category}
        </h3>
        
        <div className="flex flex-wrap gap-2">
          {category.technologies.map((tech, index) => (
            <TechBadge key={index} tech={tech} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const TechStack = () => {
  return (
    <Section id="tech-stack" className="relative mx-0">
      <div className="relative flex flex-col gap-4">
        <div className="flex flex-col">
          <motion.div
            variants={fadeInOutDownToUp}
            initial="hidden"
            whileInView="visible"
            className="mx-auto"
          >
            <H2 className={`${inter.className} text-edit`}>TECH STACK</H2>
          </motion.div>
          <motion.div
            variants={fadeInOutDownToUp}
            initial="hidden"
            whileInView="visible"
            className="text-gray mx-auto max-w-[650px] text-center"
          >
            <Heading3>Work with the latest</Heading3>
            <H2 className={`${outfit.className} text-white`}>
              CUTTING-EDGE TECHNOLOGIES
            </H2>
          </motion.div>
        </div>

        <motion.div
          variants={fadeInOutDownToUp}
          initial="hidden"
          whileInView="visible"
          className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-6 px-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {techCategories.map((category) => (
            <TechCategoryCard key={category.id} category={category} />
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          variants={fadeInOutDownToUp}
          initial="hidden"
          whileInView="visible"
          className="mt-12 text-center"
        >
          <p className="mb-4 text-gray-300 max-w-3xl mx-auto">
            Join our team and work with modern, industry-standard technologies. 
            We continuously invest in the latest tools and frameworks to ensure 
            our developers have the best resources to build exceptional software.
          </p>
          <button
            onClick={() => {
              document.getElementById('open-positions')?.scrollIntoView({ 
                behavior: 'smooth' 
              });
            }}
            className="inline-flex items-center justify-center rounded-full border border-customViolet-100/20 bg-customViolet-100/10 px-6 py-3 text-sm font-medium text-customViolet-100 transition-all hover:bg-customViolet-100/20 hover:border-customViolet-100/40"
          >
            Find Your Next Role
          </button>
        </motion.div>
      </div>
    </Section>
  );
};

export default TechStack;