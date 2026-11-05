"use client";

import { createContext, useContext, useState } from "react";

import Image from "next/image";

import type {
  ProposalChromeProps,
  ProposalTabContextValue,
  Service,
} from "@/types/global/proposal";

const ProposalTabContext = createContext<ProposalTabContextValue | null>(null);

export const PROPOSAL_SERVICES: Service[] = [
  {
    id: "1",
    name: "Web Application Development",
    description: "Build robust, scalable web applications tailored to your business needs using modern frameworks and best practices.",
    category: "Development",
    features: [
      "Custom web applications",
      "Progressive Web Apps (PWA)",
      "Single Page Applications (SPA)",
      "API development and integration",
      "Database design and optimization",
      "Cloud deployment and scaling",
      "Responsive design across all devices",
      "Performance optimization and SEO"
    ],
    price: "Starting from $5,000",
    duration: "4-12 weeks"
  },
  {
    id: "2",
    name: "Mobile Application Development",
    description: "Create native and cross-platform mobile applications that deliver exceptional user experiences on iOS and Android.",
    category: "Development",
    features: [
      "Native iOS and Android apps",
      "Cross-platform development (React Native)",
      "Mobile UI/UX design",
      "Push notifications and real-time features",
      "Offline functionality",
      "App Store deployment and optimization",
      "In-app purchases and payment integration",
      "Analytics and crash reporting"
    ],
    price: "Starting from $8,000",
    duration: "6-14 weeks"
  },
  {
    id: "3",
    name: "UI/UX Design",
    description: "Design intuitive and engaging user interfaces that enhance user satisfaction and drive business results.",
    category: "Design",
    features: [
      "User research and personas",
      "Wireframing and prototyping",
      "Visual design and branding",
      "Responsive design for all screens",
      "Usability testing and iteration",
      "Design system creation",
      "Interactive prototypes",
      "Accessibility compliance"
    ],
    price: "Starting from $3,000",
    duration: "3-8 weeks"
  },
  {
    id: "4",
    name: "CMS Service",
    description: "Empower your team to manage content effortlessly with custom content management solutions.",
    category: "Development",
    features: [
      "Custom CMS development",
      "Headless CMS integration (Strapi, Sanity, Contentful)",
      "Content modeling and workflows",
      "Media management and optimization",
      "SEO optimization tools",
      "Multi-language support",
      "Role-based access control",
      "API generation and webhooks"
    ],
    price: "Starting from $4,000",
    duration: "4-10 weeks"
  },
  {
    id: "6",
    name: "Codev Hire",
    description: "Access our pool of talented developers to augment your team with the skills you need, when you need them.",
    category: "Staffing",
    features: [
      "Full-stack developers",
      "Frontend specialists (React, Vue, Angular)",
      "Backend engineers (Node.js, Python, PHP)",
      "Mobile developers (React Native, iOS, Android)",
      "DevOps engineers",
      "UI/UX Designers",
      "Part-time or full-time availability",
      "Vetted and experienced professionals"
    ],
    price: "$1,000 - $2,000/month per developer",
    duration: "Flexible contracts (3+ months minimum)"
  },
  {
    id: "7",
    name: "AI & Machine Learning",
    description: "Leverage artificial intelligence and machine learning to unlock insights and automate processes.",
    category: "Development",
    features: [
      "Natural Language Processing (NLP)",
      "Computer Vision solutions",
      "AI-powered chatbots and assistants",
      "Predictive analytics and forecasting",
      "Data pipeline automation",
      "Model deployment and monitoring",
      "Custom AI model training",
      "Integration with OpenAI, AWS, Google Cloud AI"
    ],
    price: "Starting from $10,000",
    duration: "6-16 weeks"
  }
];

export function useProposalTab() {
  const context = useContext(ProposalTabContext);

  if (!context) {
    throw new Error("useProposalTab must be used inside ProposalChrome");
  }

  return context;
}

export function ProposalChrome({ year, children }: ProposalChromeProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <ProposalTabContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="min-h-screen bg-black-400 text-white">
        <style jsx global>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
        {/* Fixed Header */}
        <header className="sticky top-0 z-50 bg-black-600/95 backdrop-blur-sm border-b border-dark-100">
          <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <Image
                src="/assets/svgs/codebility-white.svg"
                alt="Codebility Logo"
                width={180}
                height={60}
                className="h-12 w-auto object-contain"
              />
            </div>
            <div className="text-sm bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Services Proposal
            </div>
          </div>
        </header>
        {/* Tabs Navigation */}
        <div className="border-b border-dark-100 bg-black-600/50 sticky top-[73px] z-40">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex overflow-x-auto hide-scrollbar">
              {PROPOSAL_SERVICES.map((service, index) => (
                <button
                  key={service.id}
                  onClick={() => setActiveTab(index)}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                    activeTab === index
                      ? 'border-purple-500 text-white bg-gradient-to-r from-purple-500/10 to-cyan-500/10'
                      : 'border-transparent text-white/60 hover:text-white/80 hover:border-white/20'
                  }`}
                >
                  {service.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        {children}
        {/* Footer */}
        <footer className="bg-black-600 border-t-2 border-dark-100 py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-cyan-500/5"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-8 text-center">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Ready to Get Started?
            </h3>
            <p className="text-white/70 mb-6">Let's discuss your project and bring it to life</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-white/60 mb-8">
              <div>📧 admin@codebility.tech</div>
              <div className="hidden sm:block">•</div>
              <div>🌐 www.codebility.tech</div>
            </div>
            <div className="text-sm text-white/40 pt-8 border-t border-dark-100">
              © {year} Codebility • Professional Development Services
            </div>
          </div>
        </footer>
      </div>
    </ProposalTabContext.Provider>
  );
}
