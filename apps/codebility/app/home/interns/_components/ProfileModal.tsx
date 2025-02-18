"use client";

import Image from "next/image";
import Link from "next/link";
import DefaultAvatar from "@/Components/DefaultAvatar";
import Box from "@/Components/shared/dashboard/Box";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { useModal } from "@/hooks/use-modal-users";
import { Codev, InternalStatus } from "@/types/home/codev";
import {
  Briefcase,
  Calendar,
  Facebook,
  Github,
  Linkedin,
  Link as LinkIcon,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
} from "lucide-react";

import { Badge } from "@codevs/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@codevs/ui/tabs";

import { StatusBadge } from "../../in-house/_components/shared/status-badge";

const ProfileModal = () => {
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
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-6 p-4">
            {/* Profile Image */}
            <div className="relative flex-shrink-0">
              {codev.image_url ? (
                <div className="relative h-32 w-32">
                  <img
                    src={codev.image_url}
                    alt={`${codev.first_name}'s profile`}
                    className="rounded-full object-cover"
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
                  status={
                    (codev.internal_status as InternalStatus) || "AVAILABLE"
                  }
                />
              </div>

              {/* Quick Info */}
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                {codev.email_address && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span>{codev.email_address}</span>
                  </div>
                )}
                {codev.phone_number && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span>{codev.phone_number}</span>
                  </div>
                )}
                {codev.address && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{codev.address}</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="mt-2 flex gap-2">
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
          </div>
        </DialogHeader>

        {/* Content Tabs */}
        <Tabs defaultValue="about" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>
          {/* About Tab */}
          <TabsContent value="about" className="mt-4 space-y-6">
            {/* About Section */}
            {codev.about && (
              <Section title="About">
                <p className="text-gray-600 dark:text-gray-300">
                  {codev.about}
                </p>
              </Section>
            )}

            {/* Contact Information */}
            <Section title="Contact Information">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
            </Section>

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
                  <div key={project.id} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium">{project.name}</h4>
                      <Badge variant="outline">
                        {project.status || "Active"}
                      </Badge>
                    </div>
                    {project.description && (
                      <p className="mt-2 text-sm text-gray-600">
                        {project.description}
                      </p>
                    )}
                    <div className="mt-4 flex gap-2">
                      {project.github_link && (
                        <Link
                          href={project.github_link}
                          target="_blank"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          <Github className="h-4 w-4" />
                        </Link>
                      )}
                      {project.website_url && (
                        <Link
                          href={project.website_url}
                          target="_blank"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          <LinkIcon className="h-4 w-4" />
                        </Link>
                      )}
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
            {/* Tech Stack */}
            {hasItems(codev.tech_stacks) && (
              <Section title="Tech Stack">
                <div className="flex flex-wrap gap-2">
                  {codev.tech_stacks.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </Section>
            )}

            {/* Skill Points */}
            {hasItems(codev.codev_points) && (
              <Section title="Skill Points">
                <div className="flex flex-wrap gap-2">
                  {codev.codev_points.map((point) => (
                    <Badge
                      key={point.skill_category_id}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <span>{point.skill_category_id}</span>
                      <span className="font-bold">{point.points} pts</span>
                    </Badge>
                  ))}
                </div>
              </Section>
            )}
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
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );
};

export default ProfileModal;
