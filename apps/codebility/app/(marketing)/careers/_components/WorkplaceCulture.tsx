"use client";

import { Inter, Outfit } from "next/font/google";
import { fadeInOutDownToUp } from "@/components/FramerAnimation/Framer";
import H2 from "@/components/shared/home/H2";
import Heading3 from "@/components/shared/home/Heading3";
import { motion } from "framer-motion";
import { Users, Lightbulb, Target, Heart, Zap, Globe } from "lucide-react";

import Section from "../../_shared/CodevsSection";

export const inter = { className: "font-sans" };
export const outfit = { className: "font-sans" };

const workplaceCultureData = [
  {
    id: 1,
    title: "Collaborative Environment",
    description: "Work in cross-functional teams where every voice is heard and ideas flourish through open communication.",
    icon: Users,
    color: "customTeal"
  },
  {
    id: 2,
    title: "Innovation Driven",
    description: "Stay at the forefront of technology with opportunities to work on cutting-edge projects and emerging technologies.",
    icon: Lightbulb,
    color: "customViolet-100"
  },
  {
    id: 3,
    title: "Results Focused",
    description: "Deliver high-quality solutions that create real value for clients while maintaining excellent engineering standards.",
    icon: Target,
    color: "customBlue-100"
  },
  {
    id: 4,
    title: "Work-Life Balance",
    description: "Enjoy flexible schedules, remote work options, and comprehensive benefits that support your well-being.",
    icon: Heart,
    color: "purple-500"
  },
  {
    id: 5,
    title: "Continuous Growth",
    description: "Access learning resources, conference budgets, and mentorship programs to advance your technical expertise.",
    icon: Zap,
    color: "customTeal"
  },
  {
    id: 6,
    title: "Global Impact",
    description: "Contribute to projects that serve clients worldwide and make a meaningful difference in various industries.",
    icon: Globe,
    color: "customViolet-100"
  }
];

const CultureCard = ({ 
  item 
}: { 
  item: typeof workplaceCultureData[0] 
}) => {
  const Icon = item.icon;

  return (
    <motion.div
      variants={fadeInOutDownToUp}
      initial="hidden"
      whileInView="visible"
      className="group relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-gray-600 hover:bg-gray-900/70"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative z-10">
        <div className={`mb-4 inline-flex rounded-lg bg-${item.color}/10 p-3`}>
          <Icon className={`h-6 w-6 text-${item.color}`} />
        </div>
        
        <h3 className="mb-3 text-lg font-semibold text-white">
          {item.title}
        </h3>
        
        <p className="text-sm text-gray-300 leading-relaxed">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
};

const WorkplaceCulture = () => {
  return (
    <Section id="workplace-culture" className="relative mx-0">
      <div className="relative flex flex-col gap-4">
        <div className="flex flex-col">
          <motion.div
            variants={fadeInOutDownToUp}
            initial="hidden"
            whileInView="visible"
            className="mx-auto"
          >
            <H2 className={`${inter.className} text-edit`}>OUR WORKPLACE</H2>
          </motion.div>
          <motion.div
            variants={fadeInOutDownToUp}
            initial="hidden"
            whileInView="visible"
            className="text-gray mx-auto max-w-[650px] text-center"
          >
            <Heading3>At Codebility we create</Heading3>
            <H2 className={`${outfit.className} text-white`}>
              A THRIVING PROFESSIONAL ENVIRONMENT
            </H2>
          </motion.div>
        </div>

        <motion.div
          variants={fadeInOutDownToUp}
          initial="hidden"
          whileInView="visible"
          className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-6 px-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {workplaceCultureData.map((item) => (
            <CultureCard key={item.id} item={item} />
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          variants={fadeInOutDownToUp}
          initial="hidden"
          whileInView="visible"
          className="mt-12 text-center"
        >
          <p className="mb-4 text-gray-300">
            Ready to join a team that values your growth and innovation?
          </p>
          <button
            onClick={() => {
              document.getElementById('open-positions')?.scrollIntoView({ 
                behavior: 'smooth' 
              });
            }}
            className="inline-flex items-center justify-center rounded-full border border-customViolet-100/20 bg-customViolet-100/10 px-6 py-3 text-sm font-medium text-customViolet-100 transition-all hover:bg-customViolet-100/20 hover:border-customViolet-100/40"
          >
            View Open Positions
          </button>
        </motion.div>
      </div>
    </Section>
  );
};

export default WorkplaceCulture;