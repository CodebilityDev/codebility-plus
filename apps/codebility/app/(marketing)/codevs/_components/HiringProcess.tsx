"use client";

import { motion } from "framer-motion";
import { fadeInOutDownToUp } from "@/components/FramerAnimation/Framer";
import { SectionWrapper } from "@/components/shared/home";
import { User, MessageSquare, UserCheck, Handshake } from "lucide-react";

const hiringSteps = [
  {
    id: 1,
    step: "01",
    title: "Tell Us Your Needs",
    description: "Share your project requirements, tech stack preferences, timeline, and team size. We'll help you define the perfect developer profile for your project.",
    icon: MessageSquare,
    color: "customTeal"
  },
  {
    id: 2,
    step: "02", 
    title: "Meet Pre-Vetted Talent",
    description: "We present 3-5 carefully selected CoDevs who match your criteria. Each developer has been thoroughly vetted for technical skills and communication abilities.",
    icon: User,
    color: "customViolet-100"
  },
  {
    id: 3,
    step: "03",
    title: "Interview & Select",
    description: "Conduct interviews with your shortlisted candidates. We facilitate the process and provide technical assessments to help you make the best choice.",
    icon: UserCheck,
    color: "customBlue-100"
  },
  {
    id: 4,
    step: "04",
    title: "Start Building",
    description: "Your selected CoDevs integrate seamlessly with your team. We provide ongoing support to ensure successful project delivery and smooth collaboration.",
    icon: Handshake,
    color: "purple-500"
  }
];

const HiringStepCard = ({ 
  step, 
  index 
}: { 
  step: typeof hiringSteps[0];
  index: number;
}) => {
  const Icon = step.icon;

  return (
    <motion.div
      variants={fadeInOutDownToUp}
      initial="hidden"
      whileInView="visible"
      className="group relative"
    >
      {/* Connecting line for desktop */}
      {index < hiringSteps.length - 1 && (
        <div className="absolute -right-8 top-16 hidden h-0.5 w-16 bg-gradient-to-r from-purple-500 to-purple-300 lg:block" />
      )}
      
      <div className="relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-gray-600 hover:bg-gray-900/70">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <div className="relative z-10">
          {/* Step number and icon */}
          <div className="mb-4 flex items-center gap-4">
            <div className={`rounded-lg bg-${step.color}/10 p-3`}>
              <Icon className={`h-6 w-6 text-${step.color}`} />
            </div>
            <span className={`text-2xl font-bold text-${step.color}`}>
              {step.step}
            </span>
          </div>

          {/* Title and description */}
          <h3 className="mb-3 text-xl font-semibold text-white">
            {step.title}
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            {step.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const HiringProcess = () => {
  return (
    <SectionWrapper className="relative lg:w-full lg:overflow-hidden py-20">
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <motion.div
          variants={fadeInOutDownToUp}
          initial="hidden"
          whileInView="visible"
          className="mb-12 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-500/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.3em] text-purple-200 mb-4">
            Hiring Process
          </span>
          <h2 className="mb-4 text-4xl font-light tracking-tight text-white">
            How to Hire CoDevs
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Our streamlined process makes it easy to find and hire the perfect developers 
            for your project. From initial consultation to project delivery, we're with you every step of the way.
          </p>
        </motion.div>

        {/* Desktop Layout - Horizontal */}
        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-8">
          {hiringSteps.map((step, index) => (
            <HiringStepCard key={step.id} step={step} index={index} />
          ))}
        </div>

        {/* Mobile/Tablet Layout - Vertical */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:hidden">
          {hiringSteps.map((step, index) => (
            <HiringStepCard key={step.id} step={step} index={index} />
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          variants={fadeInOutDownToUp}
          initial="hidden"
          whileInView="visible"
          className="mt-16 text-center"
        >
          <h3 className="mb-4 text-2xl font-semibold text-white">
            Ready to Build Your Dream Team?
          </h3>
          <p className="mb-6 text-gray-300 max-w-2xl mx-auto">
            Start your hiring journey today. Get matched with skilled developers 
            who can bring your vision to life.
          </p>
          <div className="flex flex-col gap-4 items-center sm:flex-row sm:justify-center">
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center rounded-full bg-customViolet-100 px-8 py-3 text-sm font-medium text-white transition-all hover:bg-customViolet-100/90"
            >
              Start Hiring Process
            </a>
            <a 
              href="/bookacall" 
              className="inline-flex items-center justify-center rounded-full border border-customTeal/20 bg-customTeal/10 px-8 py-3 text-sm font-medium text-customTeal transition-all hover:bg-customTeal/20 hover:border-customTeal/40"
            >
              Schedule a Call
            </a>
          </div>
        </motion.div>
      </div>

      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[20%] hidden transform-gpu overflow-hidden blur-3xl sm:-bottom-80 lg:block"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="from-customViolet-100 to-customTeal relative left-[calc(50%-15rem)] aspect-[855/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>
    </SectionWrapper>
  );
};

export default HiringProcess;