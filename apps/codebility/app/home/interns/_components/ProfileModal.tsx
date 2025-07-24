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
import { IconFigma, IconGithub, IconLink } from "@/public/assets/svgs";
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
      <DialogContent
        className={`mobile:max-w-[95vw] flex max-h-[75vh] min-h-[75vh] flex-col
        overflow-y-auto sm:max-w-[90vw] lg:max-w-[80vw] xl:max-w-[70vw] 2xl:max-w-[60vw]
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
                <DialogTitle className="text-2xl font-bold">
                  {codev.first_name} {codev.last_name}
                </DialogTitle>

                <div className="flex flex-col gap-1">
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    {codev.display_position}
                  </p>
                  <StatusBadge
                    className="mobile:justify-center"
                    status={
                      (codev.internal_status as InternalStatus) || "AVAILABLE"
                    }
                  />

                  <p>{codev.years_of_experience} years experience</p>
                </div>
              </div>
            </div>

            {/* addtional info */}
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
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Github className="h-5 w-5" />
                  </Link>
                )}
                {codev.linkedin && (
                  <Link
                    href={codev.linkedin}
                    target="_blank"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Link>
                )}
                {codev.facebook && (
                  <Link
                    href={codev.facebook}
                    target="_blank"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Facebook className="h-5 w-5" />
                  </Link>
                )}
                {codev.discord && (
                  <Link
                    href={codev.discord}
                    target="_blank"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <MessageSquare className="h-5 w-5" />
                  </Link>
                )}
              </div>
            </div>

            <div className="mobile:flex-col-reverse absolute right-4 top-12 flex items-center gap-4">
              <div>
                {codev.availability_status ? (
                  <div className="bg-green rounded px-2 py-1 text-xs">
                    Active
                  </div>
                ) : (
                  <div className="rounded bg-red-500 px-2 py-1 text-xs">
                    Inactive
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Content Tabs */}
        <Tabs defaultValue="about" className="mobile:mt-2 flex flex-col gap-10">
          <TabsList className="mobile:text-sm mobile:gap-2 mobile:grid-cols-2 grid w-full grid-cols-4">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>
          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            {/* About Section */}
            {codev.about && (
              <Section title="About">
                <p className="text-gray-600 dark:text-gray-300">
                  {codev.about}
                </p>
              </Section>
            )}

            {/* Education */}
            {hasItems(codev.education) && (
              <Section title="Education">
                <div className="space-y-4">
                  {codev.education.map((edu) => (
                    <div key={edu.id} className="rounded-lg border p-4">
                      <h4 className="font-medium">{edu.institution}</h4>
                      {edu.degree && (
                        <p className="text-gray-600">{edu.degree}</p>
                      )}
                      {edu.description && (
                        <p className="mt-2 text-sm text-gray-500">
                          {edu.description}
                        </p>
                      )}
                      {edu.start_date && (
                        <p className="mt-1 text-sm text-gray-500">
                          {new Date(edu.start_date).getFullYear()} -
                          {edu.end_date
                            ? new Date(edu.end_date).getFullYear()
                            : "Present"}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience" className="mt-4 space-y-6">
            {hasItems(codev.work_experience) && (
              <div className="space-y-4">
                {codev.work_experience.map((exp) => (
                  <div key={exp.id} className="rounded-lg border p-4">
                    <h4 className="font-medium">{exp.position}</h4>
                    <p className="text-gray-600">{exp.company_name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(exp.date_from).toLocaleDateString()} -
                      {exp.is_present
                        ? "Present"
                        : new Date(exp.date_to!).toLocaleDateString()}
                    </p>
                    {exp.description && (
                      <p className="mt-2 text-gray-600">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="mt-4 space-y-6">
            {hasItems(codev.projects) ? (
              <div className="grid gap-4 md:grid-cols-2">
                {codev.projects.map((project) => (
                  <div key={project.id} className="rounded-lg border">
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
                        <div className="absolute right-2 top-2 flex items-center rounded-xl bg-slate-200 px-2 py-1 text-slate-800 transition-all dark:bg-zinc-700 dark:text-white">
                          <span
                            className={`rounded-full px-3 py-1 text-sm font-medium ${
                              project.status === "active"
                                ? "bg-green-500/20 text-green-500"
                                : project.status === "pending"
                                  ? "bg-orange-500/20 text-orange-500"
                                  : project.status === "completed"
                                    ? "bg-blue-500/20 text-blue-500"
                                    : "bg-gray-500/20 text-gray-500"
                            }`}
                          >
                            {project.status || "Unknown"}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <DefaultAvatar size={64} />
                    )}

                    <div className="space-y-2 p-4">
                      <div className="flex items-start justify-between">
                        <h4 className="text-xl font-medium">{project.name}</h4>
                      </div>
                      {project.description && (
                        <p className="mt-2 text-sm text-gray-600">
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
                            onClick={(e) => e.stopPropagation()} // Prevent card click when clicking link
                          >
                            <IconGithub className="size-5 invert transition-all group-hover:-translate-y-1 group-hover:text-blue-500 dark:invert-0" />
                          </Link>
                        )}
                        {project.website_url && (
                          <Link
                            href={project.website_url}
                            target="_blank"
                            className="group"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <IconLink className="size-5 invert transition-all group-hover:-translate-y-1 group-hover:text-blue-500 dark:invert-0" />
                          </Link>
                        )}
                        {project.figma_link && (
                          <Link
                            href={project.figma_link}
                            target="_blank"
                            className="group"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <IconFigma className="size-5 invert transition-all group-hover:-translate-y-1 group-hover:text-blue-500 dark:invert-0" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No projects available</p>
            )}
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="mt-4 space-y-6">
            {/* Tech Stacks */}
            {hasItems(codev.tech_stacks) && (
              <div>
                <div className="flex flex-wrap gap-2">
                  {codev.tech_stacks.map((tech, index) =>
                    tech ? (
                      <div
                        key={`${tech}-${index}`}
                        className="flex items-center"
                      >
                        <Image
                          src={`/assets/svgs/icon-${tech.toLowerCase()}.svg`}
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
              </div>
            )}

            {/* Skill Points */}
            <Section title="Skill Points">
              <SkillPoints points={codev.codev_points ?? []} />
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
    <h3 className="text-lg font-medium">{title}</h3>
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
    <div className="flex items-center gap-2">
      {icon}
      <div>
        <p className="mobile:hidden text-sm text-gray-500 sm:hidden">{label}</p>
        <p className="mobile:hidden text-sm">{value}</p>
      </div>
    </div>
  );
};

export default ProfileModal;
