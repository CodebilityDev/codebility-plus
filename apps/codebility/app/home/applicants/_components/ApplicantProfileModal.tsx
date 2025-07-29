// apps/codebility/app/home/applicants/_components/ApplicantProfileModal.tsx

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import DefaultAvatar from "@/components/DefaultAvatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IconFigma, IconGithub, IconLink } from "@/public/assets/svgs";
import {
  Briefcase,
  Facebook,
  Github,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@codevs/ui/tabs";
import { useApplicantModal } from "./ApplicantClientWrapper";

const ApplicantProfileModal = () => {
  const { isModalOpen, selectedApplicant, closeModal } = useApplicantModal();

  // Debug logging
  useEffect(() => {
    console.log("🎯 ApplicantProfileModal - State:", {
      isModalOpen,
      hasApplicant: !!selectedApplicant,
      applicantName: selectedApplicant ? `${selectedApplicant.first_name} ${selectedApplicant.last_name}` : "No applicant"
    });
  }, [isModalOpen, selectedApplicant]);

  // Helper function to safely check array length
  const hasItems = (arr: string[] | null | undefined): arr is string[] => {
    return Array.isArray(arr) && arr.length > 0;
  };

  // Get status badge color for application status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "applying": return "bg-blue-500";
      case "testing": return "bg-amber-500"; 
      case "onboarding": return "bg-green-500";
      case "denied": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  // Early return with debug logging
  if (!isModalOpen || !selectedApplicant) {
    console.log("🚫 ApplicantProfileModal - Not rendering:", { isModalOpen, hasApplicant: !!selectedApplicant });
    return null;
  }

  console.log("✅ ApplicantProfileModal - Rendering modal for:", selectedApplicant.first_name, selectedApplicant.last_name);

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent
        className={`mobile:max-w-[95vw] flex max-h-[75vh] min-h-[75vh] flex-col
        overflow-y-auto sm:max-w-[90vw] lg:max-w-[80vw] xl:max-w-[70vw] 2xl:max-w-[60vw]
        `}
      >
        <DialogHeader>
          <div className="mobile:flex-col flex gap-6 p-4 sm:flex-col sm:justify-between 2xl:flex-row 2xl:justify-start">
            <div className="mobile:flex-col mobile:justify-center mobile:items-center sm:flex-row flex gap-2 sm:items-start sm:justify-start">
              <div className="relative flex-shrink-0 ">
                {/* Profile Image - 128px size like interns modal */}
                {selectedApplicant.image_url ? (
                  <div className="relative h-32 w-32">
                    <Image
                      src={selectedApplicant.image_url}
                      alt={`${selectedApplicant.first_name}'s profile`}
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
                  {selectedApplicant.first_name} {selectedApplicant.last_name}
                </DialogTitle>

                <div className="flex flex-col gap-1">
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    {selectedApplicant.display_position || "Position not specified"}
                  </p>
                  
                  {/* Application Status Badge */}
                  <div className={`inline-flex w-fit rounded px-2 py-1 text-xs text-white ${getStatusColor(selectedApplicant.application_status)}`}>
                    {selectedApplicant.application_status?.toUpperCase() || "UNKNOWN"}
                  </div>

                  <p>{selectedApplicant.years_of_experience} years experience</p>
                </div>
              </div>
            </div>

            {/* Contact and Social Information */}
            <div className="mobile:flex-col mobile:items-center flex gap-4 sm:items-start sm:justify-between 2xl:justify-start">
              {/* Contact Information */}
              <div className="mobile:flex-row mobile:gap-4 flex sm:flex-col">
                <InfoItem
                  icon={<Mail className="h-4 w-4" />}
                  label="Email"
                  value={selectedApplicant.email_address}
                />
                <InfoItem
                  icon={<Phone className="h-4 w-4" />}
                  label="Phone"
                  value={selectedApplicant.phone_number}
                />
                <InfoItem
                  icon={<MapPin className="h-4 w-4" />}
                  label="Location"
                  value={selectedApplicant.address}
                />
                <InfoItem
                  icon={<Briefcase className="h-4 w-4" />}
                  label="Experience"
                  value={`${selectedApplicant.years_of_experience} years`}
                />
              </div>

              {/* Social Links */}
              <div className="mobile:flex-row flex gap-4">
                {selectedApplicant.github && (
                  <Link
                    href={selectedApplicant.github}
                    target="_blank"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Github className="h-5 w-5" />
                  </Link>
                )}
                {selectedApplicant.linkedin && (
                  <Link
                    href={selectedApplicant.linkedin}
                    target="_blank"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Link>
                )}
                {selectedApplicant.facebook && (
                  <Link
                    href={selectedApplicant.facebook}
                    target="_blank"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Facebook className="h-5 w-5" />
                  </Link>
                )}
                {selectedApplicant.discord && (
                  <Link
                    href={selectedApplicant.discord}
                    target="_blank"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <MessageSquare className="h-5 w-5" />
                  </Link>
                )}
              </div>
            </div>

            {/* Availability Status */}
            <div className="mobile:flex-col-reverse absolute right-4 top-12 flex items-center gap-4">
              <div>
                {selectedApplicant.availability_status ? (
                  <div className="bg-green-500 rounded px-2 py-1 text-xs text-white">
                    Available
                  </div>
                ) : (
                  <div className="rounded bg-red-500 px-2 py-1 text-xs text-white">
                    Unavailable
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
            {selectedApplicant.about && (
              <Section title="About">
                <p className="text-gray-600 dark:text-gray-300">
                  {selectedApplicant.about}
                </p>
              </Section>
            )}

            {/* Application Details */}
            <Section title="Application Details">
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h4 className="font-medium">Application Status</h4>
                  <div className={`inline-flex rounded px-3 py-1 text-sm text-white ${getStatusColor(selectedApplicant.application_status)}`}>
                    {selectedApplicant.application_status?.toUpperCase()}
                  </div>
                  {selectedApplicant.date_applied && (
                    <p className="mt-2 text-sm text-gray-500">
                      Applied on {new Date(selectedApplicant.date_applied).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* Test Information if available */}
                {selectedApplicant.applicant && (
                  <div className="rounded-lg border p-4">
                    <h4 className="font-medium">Test Information</h4>
                    <p className="text-gray-600">
                      Test Status: {selectedApplicant.applicant.test_taken ? "Completed" : "Not taken"}
                    </p>
                    {selectedApplicant.applicant.test_taken && (
                      <p className="text-sm text-gray-500">
                        Taken on {new Date(selectedApplicant.applicant.test_taken).toLocaleDateString()}
                      </p>
                    )}
                    {selectedApplicant.applicant.fork_url && (
                      <Link
                        href={selectedApplicant.applicant.fork_url}
                        target="_blank"
                        className="mt-2 inline-flex items-center gap-2 text-blue-500 hover:text-blue-700"
                      >
                        <IconGithub className="h-4 w-4" />
                        View Test Repository
                      </Link>
                    )}
                  </div>
                )}

                {/* Portfolio */}
                {selectedApplicant.portfolio_website && (
                  <div className="rounded-lg border p-4">
                    <h4 className="font-medium">Portfolio</h4>
                    <Link
                      href={selectedApplicant.portfolio_website}
                      target="_blank"
                      className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-700"
                    >
                      <IconLink className="h-4 w-4" />
                      View Portfolio
                    </Link>
                  </div>
                )}
              </div>
            </Section>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience" className="mt-4 space-y-6">
            <Section title="Experience Level">
              <div className="rounded-lg border p-4">
                <h4 className="font-medium">Years of Experience</h4>
                <p className="text-2xl font-bold text-blue-500">
                  {selectedApplicant.years_of_experience}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedApplicant.years_of_experience <= 2 ? "Novice Level" : 
                   selectedApplicant.years_of_experience <= 5 ? "Intermediate Level" : "Expert Level"}
                </p>
              </div>
            </Section>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="mt-4 space-y-6">
            <div className="text-center py-8">
              <div className="mb-4 text-4xl">📁</div>
              <h3 className="text-lg font-medium mb-2">No Projects Available</h3>
              <p className="text-gray-500 mb-4">
                Project information will be available after the applicant joins the team.
              </p>
              
              {/* Show test repository if available */}
              {selectedApplicant.applicant?.fork_url && (
                <div className="mt-6 p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Test Repository</h4>
                  <Link
                    href={selectedApplicant.applicant.fork_url}
                    target="_blank"
                    className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-700"
                  >
                    <IconGithub className="h-4 w-4" />
                    View Submitted Test
                  </Link>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="mt-4 space-y-6">
            {/* Tech Stacks */}
            {hasItems(selectedApplicant.tech_stacks) && (
              <Section title="Technical Skills">
                <div className="flex flex-wrap gap-2">
                  {selectedApplicant.tech_stacks
                    .filter((tech): tech is string => Boolean(tech))
                    .map((tech, index) => (
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
                          onError={(e) => {
                            // Fallback for missing icons
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = `<span class="px-2 py-1 bg-gray-200 rounded text-sm">${tech}</span>`;
                          }}
                        />
                      </div>
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
        <p className="mobile:hidden text-sm text-gray-500 sm:hidden">{label}</p>
        <p className="mobile:hidden text-sm">{value}</p>
      </div>
    </div>
  );
};

export default ApplicantProfileModal;