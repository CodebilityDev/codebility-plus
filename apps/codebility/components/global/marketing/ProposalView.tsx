"use client";

import Image from "next/image";

import {
  PROPOSAL_SERVICES,
  useProposalTab,
} from "@/components/global/marketing/ProposalChrome";
import type { ProposalViewProps } from "@/types/global/proposal";

export default function ProposalView({
  realProjects,
  codevProfiles,
}: ProposalViewProps) {
  const { activeTab } = useProposalTab();

  const getServiceProjectData = (serviceName: string) => {
    const categoryMap: Record<string, number> = {
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
      return project.categories?.some((c) => c.id === categoryId);
    });

    const withImages = filtered.filter(p => p.main_image && p.main_image.trim() !== '');

    return withImages.slice(0, 12);
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      {PROPOSAL_SERVICES.map((service, index) => {
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

                return Array.isArray(codevProfiles) && codevProfiles.length > 0 ? (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-white">Available Developers & Mentors</h3>
                    <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
                      {codevProfiles.map((codev, idx) => {
                      const codevName = `${codev.first_name} ${codev.last_name}`.trim() || 'Developer';
                      const codevPosition = codev.display_position ?? codev.positions?.[0] ?? 'Developer';
                      const codevImage = codev.image_url;

                      return (
                        <div key={idx} className="text-center p-4 bg-black-600 rounded-lg border border-dark-100">
                          <div className="mb-2">
                            {codevImage ? (
                              <Image
                                src={codevImage}
                                alt={codevName}
                                width={80}
                                height={80}
                                className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-purple-500/50"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "https://codebility-cdn.pages.dev/assets/images/default-avatar-200x200.jpg";
                                }}
                              />
                            ) : (
                              <Image
                                src="https://codebility-cdn.pages.dev/assets/images/default-avatar-200x200.jpg"
                                alt="Codev Avatar"
                                width={80}
                                height={80}
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
                        {project.main_image ? (
                          <Image
                            src={project.main_image}
                            alt={project.name}
                            width={400}
                            height={160}
                            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-40 bg-gray-800" />
                        )}
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
            {(service.price ?? service.duration) && (
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
  );
}
