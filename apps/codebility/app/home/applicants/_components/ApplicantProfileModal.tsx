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
      case "applying": return "bg-customBlue-500";
      case "testing": return "bg-purple-500";
      case "onboarding": return "bg-yellow-500";
      case "waitlist": return "bg-green-500";
      case "passed": return "bg-emerald-500";
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
        className="flex max-h-[85vh] w-[95vw] max-w-4xl flex-col overflow-hidden"
      >
        <DialogHeader className="overflow-y-auto px-6 pb-0">
          <div className="flex flex-col gap-4">
            {/* Top Row: Profile Image, Name, Status */}
            <div className="flex items-start gap-4">
              <div className="relative flex-shrink-0">
                {selectedApplicant.image_url ? (
                  <div className="relative h-20 w-20">
                    <Image
                      src={selectedApplicant.image_url}
                      alt={`${selectedApplicant.first_name}'s profile`}
                      className="rounded-full object-cover"
                      fill
                    />
                  </div>
                ) : (
                  <DefaultAvatar size={80} />
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <DialogTitle className="truncate text-xl font-bold">
                    {selectedApplicant.first_name} {selectedApplicant.last_name}
                  </DialogTitle>
                  {selectedApplicant.availability_status ? (
                    <div className="flex-shrink-0 rounded bg-green-500 px-2 py-1 text-xs text-white">
                      Available
                    </div>
                  ) : (
                    <div className="flex-shrink-0 rounded bg-red-500 px-2 py-1 text-xs text-white">
                      Unavailable
                    </div>
                  )}
                </div>

                <p className="truncate text-sm text-gray-600 dark:text-gray-300">
                  {selectedApplicant.display_position || "Position not specified"}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <div className={`inline-flex rounded px-2 py-1 text-xs text-white ${getStatusColor(selectedApplicant.application_status)}`}>
                    {selectedApplicant.application_status?.toUpperCase() || "UNKNOWN"}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedApplicant.years_of_experience} years experience
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information - Compact Grid */}
            <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              <div className="flex items-center gap-2 truncate">
                <Mail className="h-4 w-4 flex-shrink-0 text-gray-500" />
                <span className="truncate">{selectedApplicant.email_address}</span>
              </div>
              {selectedApplicant.phone_number && (
                <div className="flex items-center gap-2 truncate">
                  <Phone className="h-4 w-4 flex-shrink-0 text-gray-500" />
                  <span className="truncate">{selectedApplicant.phone_number}</span>
                </div>
              )}
              {selectedApplicant.address && (
                <div className="flex items-center gap-2 truncate">
                  <MapPin className="h-4 w-4 flex-shrink-0 text-gray-500" />
                  <span className="truncate">{selectedApplicant.address}</span>
                </div>
              )}

              {/* Social Links */}
              <div className="flex items-center gap-3">
                {selectedApplicant.github && (
                  <Link
                    href={selectedApplicant.github}
                    target="_blank"
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    <Github className="h-5 w-5" />
                  </Link>
                )}
                {selectedApplicant.linkedin && (
                  <Link
                    href={selectedApplicant.linkedin}
                    target="_blank"
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Link>
                )}
                {selectedApplicant.facebook && (
                  <Link
                    href={selectedApplicant.facebook}
                    target="_blank"
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    <Facebook className="h-5 w-5" />
                  </Link>
                )}
                {selectedApplicant.discord && (
                  <Link
                    href={selectedApplicant.discord}
                    target="_blank"
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    <MessageSquare className="h-5 w-5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Content Tabs */}
        <Tabs defaultValue="about" className="flex min-h-0 flex-1 flex-col overflow-hidden px-6">
          <TabsList className="grid w-full grid-cols-4 gap-1">
            <TabsTrigger value="about" className="text-xs sm:text-sm">About</TabsTrigger>
            <TabsTrigger value="experience" className="text-xs sm:text-sm">Experience</TabsTrigger>
            <TabsTrigger value="projects" className="text-xs sm:text-sm">Projects</TabsTrigger>
            <TabsTrigger value="skills" className="text-xs sm:text-sm">Skills</TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about" className="mt-4 space-y-4 overflow-y-auto pr-2">
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
                        className="mt-2 inline-flex items-center gap-2 text-customBlue-500 hover:text-customBlue-700"
                      >
                        <IconGithub className="h-4 w-4" />
                        View Test Repository
                      </Link>
                    )}
                  </div>
                )}

                {/* Onboarding Information */}
                {selectedApplicant.applicant && (selectedApplicant.application_status === "waitlist" || selectedApplicant.application_status === "onboarding") && (
                  <div className="rounded-lg border border-green-200 bg-green-50/50 p-4 dark:border-green-800 dark:bg-green-900/20">
                    <h4 className="font-medium text-green-900 dark:text-green-100">Onboarding Progress</h4>
                    <div className="mt-3 space-y-2">
                      {/* Quiz Score */}
                      {selectedApplicant.applicant.quiz_passed !== null && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Quiz:</span>
                          <div className="flex items-center gap-2">
                            {selectedApplicant.applicant.quiz_passed ? (
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                Passed ({selectedApplicant.applicant.quiz_score}/{selectedApplicant.applicant.quiz_total})
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                Failed ({selectedApplicant.applicant.quiz_score}/{selectedApplicant.applicant.quiz_total})
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Mobile Development */}
                      {selectedApplicant.applicant.can_do_mobile !== null && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Mobile Development:</span>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                            selectedApplicant.applicant.can_do_mobile
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                          }`}>
                            {selectedApplicant.applicant.can_do_mobile ? "Yes" : "No"}
                          </span>
                        </div>
                      )}

                      {/* Commitment Signature */}
                      {selectedApplicant.applicant.commitment_signed_at && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Commitment:</span>
                          <div className="flex flex-col items-end gap-1">
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              Signed
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(selectedApplicant.applicant.commitment_signed_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Portfolio */}
                {selectedApplicant.portfolio_website && (
                  <div className="rounded-lg border p-4">
                    <h4 className="font-medium">Portfolio</h4>
                    <Link
                      href={selectedApplicant.portfolio_website}
                      target="_blank"
                      className="inline-flex items-center gap-2 text-customBlue-500 hover:text-customBlue-700"
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
          <TabsContent value="experience" className="mt-4 space-y-4 overflow-y-auto pr-2">
            <Section title="Experience Level">
              <div className="rounded-lg border p-4">
                <h4 className="font-medium">Years of Experience</h4>
                <p className="text-2xl font-bold text-customBlue-500">
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
          <TabsContent value="projects" className="mt-4 space-y-4 overflow-y-auto pr-2">
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
                    className="inline-flex items-center gap-2 text-customBlue-500 hover:text-customBlue-700"
                  >
                    <IconGithub className="h-4 w-4" />
                    View Submitted Test
                  </Link>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="mt-4 space-y-4 overflow-y-auto pr-2">
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
                          src={`/assets/svgs/techstack/icon-${tech.toLowerCase()}.svg`}
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

export default ApplicantProfileModal;