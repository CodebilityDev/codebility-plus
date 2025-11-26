"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getRealProjects, RealProject, getCodevProfiles } from "../home/settings/services/actions";
import { techstacks } from '@/constants/techstack';

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  features: string[];
  price?: string;
  duration?: string;
}

export default function ProposalPage() {
  const [realProjects, setRealProjects] = useState<RealProject[]>([]);
  const [codevProfiles, setCodevProfiles] = useState<any[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const [services] = useState<Service[]>([
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
  ]);

  // Fetch real projects and codev profiles on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsResult, codevsResult] = await Promise.all([
          getRealProjects(),
          getCodevProfiles()
        ]);

        if (projectsResult.data && !projectsResult.error) {
          setRealProjects(projectsResult.data);
        } else {
          console.error('❌ Error fetching projects:', projectsResult.error);
        }

        console.log('🔍 Codevs result:', codevsResult);

        if (codevsResult.data && !codevsResult.error) {
          console.log('✅ Codevs fetched:', codevsResult.data.length);
          console.log('📋 Codev data sample:', codevsResult.data.slice(0, 3).map(c => ({
            name: `${c.first_name} ${c.last_name}`,
            role: c.role,
            image_url: c.image_url,
            full_data: c
          })));
          setCodevProfiles(codevsResult.data);
        } else {
          console.error('❌ Error fetching codevs:', codevsResult.error);
          console.log('❌ Codevs data:', codevsResult.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoadingProjects(false);
      }
    };

    fetchData();
  }, []);

  // Get service-specific project data
  const getServiceProjectData = (serviceName: string) => {
    const categoryMap: { [key: string]: number } = {
      "Web Application Development": 1,
      "Mobile Application Development": 2,
      "UI/UX Design": 3,
      "AI & Machine Learning": 4,
      "CMS Service": 5
    };

    const categoryId = categoryMap[serviceName];

    if (!categoryId || !Array.isArray(realProjects)) {
      return [];
    }

    const filtered = realProjects.filter(project => {
      return project.categories?.some((c: any) => c.id === categoryId);
    });

    const withImages = filtered.filter(p => p.main_image && p.main_image.trim() !== '');

    return withImages.slice(0, 12);
  };

  if (isLoadingProjects) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
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
            {services.map((service, index) => (
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

      {/* Active Service Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {services.map((service, index) => {
          if (index !== activeTab) return null;

          const isCodevHireService = service.name === "Codev Hire";
          const projectData = getServiceProjectData(service.name);

          return (
            <section key={service.id} className="animate-in fade-in duration-300">

              {/* Service Title */}
              <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {service.name}
              </h2>
              <p className="text-lg text-white/70 mb-8">{service.description}</p>

              {/* Project Showcase Grid / Codev Profiles - Below Hero */}
              {isCodevHireService ? (
                (() => {
                  console.log('🎯 Rendering Codev Hire section');
                  console.log('🎯 codevProfiles:', codevProfiles);
                  console.log('🎯 Is Array?', Array.isArray(codevProfiles));
                  console.log('🎯 Length:', codevProfiles?.length);

                  return Array.isArray(codevProfiles) && codevProfiles.length > 0 ? (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4 text-white">Available Developers & Mentors</h3>
                      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
                        {codevProfiles.map((codev, idx) => {
                        const codevName = `${codev.first_name || ''} ${codev.last_name || ''}`.trim() || 'Developer';
                        const codevPosition = codev.display_position || codev.positions?.[0] || 'Developer';
                        const codevImage = codev.image_url;

                        return (
                          <div key={idx} className="text-center p-4 bg-black-600 rounded-lg border border-dark-100">
                            <div className="mb-2">
                              {codevImage ? (
                                <img
                                  src={codevImage}
                                  alt={codevName}
                                  className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-purple-500/50"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "https://codebility-cdn.pages.dev/assets/images/default-avatar-200x200.jpg";
                                  }}
                                />
                              ) : (
                                <img
                                  src="https://codebility-cdn.pages.dev/assets/images/default-avatar-200x200.jpg"
                                  alt="Codev Avatar"
                                  className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-purple-500/50"
                                />
                              )}
                            </div>
                            <div className="text-sm font-medium truncate text-white">{codevName}</div>
                            <div className="text-xs text-white/60 truncate">{codevPosition}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  ) : (
                    <div className="mb-8 text-center text-white/60 py-8">
                      No codevs available
                    </div>
                  );
                })()
              ) : (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 text-white">Our Work</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {projectData.length > 0 ? (
                      projectData.map((project, idx) => (
                        <div key={idx} className="group relative overflow-hidden rounded-lg bg-black-600 border-2 border-dark-100 hover:border-purple-500/50 transition-all duration-300">
                          <img
                            src={project.main_image!}
                            alt={project.name}
                            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="p-3 relative z-10">
                            <div className="text-sm font-medium truncate text-white">{project.name}</div>
                            {project.tech_stack && project.tech_stack.length > 0 && (
                              <div className="text-xs text-white/60 truncate mt-1">
                                {project.tech_stack.slice(0, 2).join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      // Show placeholder message when no projects
                      <div className="col-span-full text-center text-white/60 py-8">
                        No projects available for this service
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Price and Duration */}
              {(service.price || service.duration) && (
                <div className="bg-black-600 rounded-lg p-6 mb-8 border-2 border-dark-100 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10"></div>
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="text-3xl">💎</div>
                    <div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                        {service.price}
                      </div>
                      {service.duration && <div className="text-white/60">{service.duration}</div>}
                    </div>
                  </div>
                </div>
              )}

              {/* Features */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-white">What's Included</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-black-600 rounded-lg border border-dark-100">
                      <div className="text-cyan-400 mt-0.5">✓</div>
                      <span className="text-white/80">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>

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
            © {new Date().getFullYear()} Codebility • Professional Development Services
          </div>
        </div>
      </footer>
    </div>
  );
}
