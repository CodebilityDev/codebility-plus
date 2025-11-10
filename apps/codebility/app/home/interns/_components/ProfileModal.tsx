"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import DefaultAvatar from "@/components/DefaultAvatar";
import Box from "@/components/shared/dashboard/Box";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SwitchStatusButton from "@/components/ui/SwitchStatusButton";
import { useModal } from "@/hooks/use-modal-users";
import { IconGithub, IconLink } from "@/public/assets/svgs";
import { IconFigma } from "@/public/assets/svgs/techstack";
import { Codev, InternalStatus } from "@/types/home/codev";
import {
  Briefcase,
  Facebook,
  Github,
  Linkedin,
  Link as LinkIcon,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@codevs/ui/tabs";

import { StatusBadge } from "../../in-house/_components/shared/StatusBadge";
import SkillPoints from "./SkillPoints";

// Type guard to check if project has required properties
const isValidProject = (project: any): boolean => {
  return project && typeof project === 'object' && 'id' in project;
};

const ProfileModal = ({ user }: { user?: Codev | null }) => {
  const { isOpen, type, onClose, data } = useModal();
  const isModalOpen = isOpen && type === "profileModal";
  const codev = data as Codev;

  if (!isModalOpen || !codev) return null;

  // Helper function to safely check array length
  const hasItems = (arr: any[] | undefined): arr is any[] => {
    return Array.isArray(arr) && arr.length > 0;
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      {/* ✅ ENHANCED: Pure dark slate with blue border accent */}
      <DialogContent
        className={`mobile:max-w-[95vw] flex max-h-[75vh] min-h-[75vh] flex-col
        overflow-y-auto sm:max-w-[90vw] lg:max-w-[80vw] xl:max-w-[70vw] 2xl:max-w-[60vw]
        bg-white 
        dark:bg-slate-950
        border-2 border-slate-300 dark:border-blue-900/60 shadow-2xl
        `}
      >
        <DialogHeader>
          <div className="mobile:flex-col flex gap-6 p-4 sm:flex-col sm:justify-between 2xl:flex-row 2xl:justify-start">
            <div className="mobile:flex-col mobile:justify-center mobile:items-center sm:flex-rcw flex gap-2 sm:items-start sm:justify-start">
              <div className="relative flex-shrink-0 ">
                {/* Profile Image */}
                {codev.image_url ? (
                  <div className="relative h-32 w-32">
                    <Image
                      src={codev.image_url}
                      alt={`${codev.first_name}'s profile`}
                      className="rounded-full object-cover"
                      fill
                    />
                  </div>
                ) : (
                  <DefaultAvatar size={128} />
                )}
              </div>

              {/* Basic Info */}
              <div className="flex flex-col gap-2">
                <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  {codev.first_name} {codev.last_name}
                </DialogTitle>

                <div className="flex flex-col gap-1">
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    {codev.display_position}
                  </p>
                  <StatusBadge
                    className="mobile:justify-center"
                    status={
                      (codev.internal_status as InternalStatus) || "GRADUATED"
                    }
                  />

                  <p className="text-gray-700 dark:text-gray-300">{codev.years_of_experience} years experience</p>
                </div>
              </div>
            </div>

            {/* additional info */}
            <div className="mobile:flex-col mobile:items-center flex gap-4 sm:items-start sm:justify-between 2xl:justify-start">
              {/* Contact Information */}
              <div className="mobile:flex-row mobile:gap-4 flex sm:flex-col">
                <InfoItem
                  icon={<Mail className="h-4 w-4" />}
                  label="Email"
                  value={codev.email_address}
                />
                <InfoItem
                  icon={<Phone className="h-4 w-4" />}
                  label="Phone"
                  value={codev.phone_number}
                />
                <InfoItem
                  icon={<MapPin className="h-4 w-4" />}
                  label="Location"
                  value={codev.address}
                />
                <InfoItem
                  icon={<Briefcase className="h-4 w-4" />}
                  label="Experience"
                  value={`${codev.years_of_experience} years`}
                />
              </div>

              {/* Social Links */}
              <div className="mobile:flex-row flex gap-4">
                {codev.github && (
                  <Link
                    href={codev.github}
                    target="_blank"
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <Github className="h-5 w-5" />
                  </Link>
                )}
                {codev.linkedin && (
                  <Link
                    href={codev.linkedin}
                    target="_blank"
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Link>
                )}
                {codev.facebook && (
                  <Link
                    href={codev.facebook}
                    target="_blank"
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <Facebook className="h-5 w-5" />
                  </Link>
                )}
                {codev.discord && (
                  <Link
                    href={codev.discord}
                    target="_blank"
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <MessageSquare className="h-5 w-5" />
                  </Link>
                )}
              </div>
            </div>

            <div className="mobile:flex-col-reverse absolute right-4 top-12 flex items-center gap-4">
              <div>
                {codev.availability_status ? (
                  <div className="bg-green-500 rounded px-2 py-1 text-xs text-white font-medium">
                    Active
                  </div>
                ) : (
                  <div className="rounded bg-red-500 px-2 py-1 text-xs text-white font-medium">
                    Inactive
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Content Tabs */}
        <Tabs defaultValue="about" className="mobile:mt-2 flex flex-col gap-10 px-2">
          {/* ✅ FIXED: Perfectly aligned tabs without gaps */}
          <TabsList className="mobile:text-sm mobile:grid-cols-2 
            grid w-full grid-cols-4 gap-0
            bg-slate-100 dark:bg-slate-950
            border-2 border-slate-300 dark:border-blue-800/60 
            rounded-lg p-1 shadow-sm h-auto
            items-stretch">
            <TabsTrigger 
              value="about"
              className="
                rounded-md h-10 
                data-[state=active]:bg-gradient-to-r 
                data-[state=active]:from-blue-500 
                data-[state=active]:to-cyan-400 
                data-[state=active]:text-white 
                data-[state=active]:shadow-md
                hover:bg-slate-200 dark:hover:bg-slate-800 
                transition-all duration-200
                flex items-center justify-center
                font-medium
              "
            >
              About
            </TabsTrigger>
            <TabsTrigger 
              value="experience"
              className="
                rounded-md h-10 
                data-[state=active]:bg-gradient-to-r 
                data-[state=active]:from-blue-500 
                data-[state=active]:to-cyan-400 
                data-[state=active]:text-white 
                data-[state=active]:shadow-md
                hover:bg-slate-200 dark:hover:bg-slate-800 
                transition-all duration-200
                flex items-center justify-center
                font-medium
              "
            >
              Experience
            </TabsTrigger>
            <TabsTrigger 
              value="projects"
              className="
                rounded-md h-10 
                data-[state=active]:bg-gradient-to-r 
                data-[state=active]:from-blue-500 
                data-[state=active]:to-cyan-400 
                data-[state=active]:text-white 
                data-[state=active]:shadow-md
                hover:bg-slate-200 dark:hover:bg-slate-800 
                transition-all duration-200
                flex items-center justify-center
                font-medium
              "
            >
              Projects
            </TabsTrigger>
            <TabsTrigger 
              value="skills"
              className="
                rounded-md h-10 
                data-[state=active]:bg-gradient-to-r 
                data-[state=active]:from-blue-500 
                data-[state=active]:to-cyan-400 
                data-[state=active]:text-white 
                data-[state=active]:shadow-md
                hover:bg-slate-200 dark:hover:bg-slate-800 
                transition-all duration-200
                flex items-center justify-center
                font-medium
              "
            >
              Skills
            </TabsTrigger>
          </TabsList>
          
          {/* About Tab */}
          <TabsContent value="about" className="space-y-6 pb-8">
            {/* About Section */}
            <Section title="About">
              <p className="text-gray-700 dark:text-gray-300">
                {codev.about || "None"}
              </p>
            </Section>

          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience" className="mt-4 space-y-6 pb-8">
            {hasItems(codev.work_experience) ? (
              <div className="space-y-4">
                {codev.work_experience.map((exp) => (
                  /* ✅ ENHANCED: Pure dark slate with subtle blue tint */
                  <div key={exp.id} className="rounded-lg 
                    bg-white 
                    dark:bg-slate-900
                    border-2 border-slate-200 dark:border-blue-800/40 p-4 shadow-sm">
                    <h4 className="font-medium text-gray-900 dark:text-white">{exp.position}</h4>
                    <p className="text-gray-700 dark:text-gray-300">{exp.company_name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(exp.date_from).toLocaleDateString()} -
                      {exp.is_present
                        ? "Present"
                        : new Date(exp.date_to!).toLocaleDateString()}
                    </p>
                    {exp.description && (
                      <p className="mt-2 text-gray-700 dark:text-gray-300">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-700 dark:text-gray-300">None</p>
            )}
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="mt-4 space-y-6 pb-8">
            {hasItems(codev.projects) ? (
              <div className="grid gap-4 md:grid-cols-2">
                {codev.projects
                  .filter(isValidProject)
                  .map((project, index) => {
                    if (!project || !project.id) {
                      return null;
                    }

                    const uniqueKey = project.id || `project-${index}`;

                    return (
                      /* ✅ ENHANCED: Pure dark slate with blue tint */
                      <div key={uniqueKey} className="rounded-lg 
                        bg-white 
                        dark:bg-slate-900
                        border-2 border-slate-200 dark:border-blue-800/40 overflow-hidden shadow-sm">
                        {project.main_image ? (
                          <div className="relative h-48 w-full">
                            <Image
                              alt={`${project.name} image`}
                              src={project.main_image}
                              fill
                              className="object-cover"
                              loading="eager"
                              priority
                            />
                            <div className="absolute right-2 top-2 flex items-center rounded-xl 
                              bg-white/95 dark:bg-slate-950/95 
                              px-2 py-1 text-slate-800 dark:text-white 
                              border border-slate-200 dark:border-blue-800/40">
                              <span
                                className={`rounded-full px-3 py-1 text-sm font-medium ${
                                  project.status === "active"
                                    ? "bg-green-500/20 text-green-700 dark:text-green-400"
                                    : project.status === "pending"
                                      ? "bg-orange-500/20 text-orange-700 dark:text-orange-400"
                                      : project.status === "completed"
                                        ? "bg-customBlue-500/20 text-customBlue-700 dark:text-customBlue-400"
                                        : "bg-gray-500/20 text-gray-700 dark:text-gray-400"
                                }`}
                              >
                                {project.status || "Unknown"}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-48 bg-gray-100 dark:bg-gray-700">
                            <DefaultAvatar size={64} />
                          </div>
                        )}

                        <div className="space-y-2 p-4">
                          <div className="flex items-start justify-between">
                            <h4 className="text-xl font-medium text-gray-900 dark:text-white">{project.name}</h4>
                          </div>
                          {project.description && (
                            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                              {project.description}
                            </p>
                          )}
                          {/* Links */}
                          <div className="flex items-center gap-3">
                            {project.github_link && (
                              <Link
                                href={project.github_link}
                                target="_blank"
                                className="group"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <IconGithub className="size-5 text-gray-700 dark:text-gray-300 transition-all group-hover:-translate-y-1 group-hover:text-customBlue-500" />
                              </Link>
                            )}
                            {project.website_url && (
                              <Link
                                href={project.website_url}
                                target="_blank"
                                className="group"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <IconLink className="size-5 text-gray-700 dark:text-gray-300 transition-all group-hover:-translate-y-1 group-hover:text-customBlue-500" />
                              </Link>
                            )}
                            {project.figma_link && (
                              <Link
                                href={project.figma_link}
                                target="_blank"
                                className="group"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <IconFigma className="size-5 text-gray-700 dark:text-gray-300 transition-all group-hover:-translate-y-1 group-hover:text-customBlue-500" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                  .filter(Boolean)}
              </div>
            ) : (
              <p className="text-gray-700 dark:text-gray-300">None</p>
            )}
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="mt-4 space-y-6 pb-8">
            {/* Tech Stacks */}
            <Section title="Tech Stacks">
              <div className="rounded-lg 
                bg-slate-50 
                dark:bg-slate-900
                border-2 border-slate-300 dark:border-blue-800/50 p-5 shadow-sm">
                {hasItems(codev.tech_stacks) ? (
                  <div className="flex flex-wrap gap-2">
                    {codev.tech_stacks.map((tech, index) =>
                      tech ? (
                        <div
                          key={`${tech}-${index}`}
                          className="flex items-center"
                        >
                          <Image
                            src={`/assets/svgs/techstack/icon-${tech.toLowerCase()}.svg`}
                            alt={`${tech} icon`}
                            width={32}
                            height={32}
                            title={tech}
                            className="h-[32px] w-[32px] object-contain transition duration-300 hover:-translate-y-0.5"
                          />
                        </div>
                      ) : null,
                    )}
                  </div>
                ) : (
                  <p className="text-gray-700 dark:text-gray-300">None</p>
                )}
              </div>
            </Section>

            {/* Skill Points */}
            <Section title="Skill Points">
              <div className="rounded-lg 
                bg-slate-50 
                dark:bg-slate-900
                border-2 border-slate-300 dark:border-blue-800/50 p-5 shadow-sm">
                <SkillPoints points={codev.codev_points ?? []} />
              </div>
            </Section>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

// Helper Components
const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-3">
    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
    {children}
  </div>
);

const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) => {
  if (!value) return null;

  return (
    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
      {icon}
      <div>
        <p className="mobile:hidden text-sm text-gray-600 dark:text-gray-400 sm:hidden">{label}</p>
        <p className="mobile:hidden text-sm">{value}</p>
      </div>
    </div>
  );
};

export default ProfileModal;