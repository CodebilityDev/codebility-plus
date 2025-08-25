"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Mail, Phone, Linkedin, Globe, FileText, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@codevs/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@codevs/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { JobApplication } from "@/app/(marketing)/careers/_types/job-listings";
import ApplicationDetailsModal from "../../_components/ApplicationDetailsModal";
import CustomBreadcrumb from "@/components/shared/dashboard/CustomBreadcrumb";
import { H1 } from "@/components/shared/dashboard";

// Mock data - replace with actual API call
const mockApplications: JobApplication[] = [
  {
    id: "1",
    job_id: "1",
    job_title: "Senior Full Stack Developer",
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    phone: "+63 912 345 6789",
    linkedin: "https://linkedin.com/in/johndoe",
    portfolio: "https://johndoe.dev",
    cover_letter: "I am excited to apply for the Senior Full Stack Developer position at Codebility. With over 7 years of experience in web development and a strong background in React, Node.js, and PostgreSQL, I believe I would be a valuable addition to your team...",
    experience: "7+ years of full-stack development experience. Led development of 3 major SaaS applications. Expert in React, Next.js, Node.js, and PostgreSQL. Strong experience with cloud services (AWS) and CI/CD pipelines.",
    resume_url: "resume-john-doe.pdf",
    applied_at: "2024-01-20T10:30:00Z",
    status: "pending",
  },
  {
    id: "2",
    job_id: "1",
    job_title: "Senior Full Stack Developer",
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@example.com",
    phone: "+63 917 654 3210",
    linkedin: "https://linkedin.com/in/janesmith",
    cover_letter: "I am writing to express my interest in the Senior Full Stack Developer role. My extensive experience in building scalable web applications aligns perfectly with your requirements...",
    experience: "6 years of experience in full-stack development. Specialized in React, TypeScript, and Node.js. Built and maintained multiple e-commerce platforms serving millions of users.",
    applied_at: "2024-01-21T14:15:00Z",
    status: "reviewing",
  },
  {
    id: "3",
    job_id: "1",
    job_title: "Senior Full Stack Developer",
    first_name: "Mike",
    last_name: "Johnson",
    email: "mike.j@example.com",
    phone: "+63 919 876 5432",
    portfolio: "https://mikejohnson.io",
    cover_letter: "As a passionate full-stack developer with a track record of delivering high-quality solutions, I am thrilled to apply for this position at Codebility...",
    experience: "8 years in software development. Expert in modern JavaScript frameworks, microservices architecture, and database design. Previously worked at top tech companies.",
    resume_url: "resume-mike-johnson.pdf",
    applied_at: "2024-01-22T09:45:00Z",
    status: "shortlisted",
  },
];

export default function JobApplicationsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const jobId = params.jobId as string;
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Filter applications for this specific job
  const applications = mockApplications.filter(app => app.job_id === jobId);
  const jobTitle = applications[0]?.job_title || "Job Position";

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    // Here you would update the status in your backend
    toast({
      title: "Status Updated",
      description: `Application status changed to ${newStatus}`,
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", label: "Pending" },
      reviewing: { color: "bg-blue-500/10 text-blue-400 border-blue-500/20", label: "Reviewing" },
      shortlisted: { color: "bg-green-500/10 text-green-400 border-green-500/20", label: "Shortlisted" },
      rejected: { color: "bg-red-500/10 text-red-400 border-red-500/20", label: "Rejected" },
      hired: { color: "bg-purple-500/10 text-purple-400 border-purple-500/20", label: "Hired" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant="outline" className={config.color}>{config.label}</Badge>;
  };

  const breadcrumbItems = [
    { label: "Management", href: "/home" },
    { label: "Hire", href: "/home/hire" },
    { label: jobTitle },
  ];

  return (
    <div className="container mx-auto max-w-7xl p-6">
      <div className="mb-6">
        <CustomBreadcrumb items={breadcrumbItems} />
      </div>

      <div className="mb-8">
        <H1>Applications for {jobTitle}</H1>
        <p className="mt-2 text-gray-400">
          {applications.length} applicant{applications.length !== 1 ? 's' : ''} found
        </p>
      </div>

        {/* Applications Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-800 bg-gray-900/50">
          <table className="w-full">
            <thead className="border-b border-gray-800">
              <tr className="text-left">
                <th className="px-4 py-3 text-sm font-medium text-gray-300">Applicant</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-300">Contact</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-300">Applied</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-300">Status</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {applications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-900/70">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-white">
                        {application.first_name} {application.last_name}
                      </p>
                      <div className="mt-1 flex gap-2">
                        {application.linkedin && (
                          <a
                            href={application.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-400 hover:text-white"
                          >
                            LinkedIn
                          </a>
                        )}
                        {application.portfolio && (
                          <a
                            href={application.portfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-400 hover:text-white"
                          >
                            Portfolio
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <a
                        href={`mailto:${application.email}`}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-white"
                      >
                        <Mail className="h-3 w-3" />
                        {application.email}
                      </a>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Phone className="h-3 w-3" />
                        {application.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-400">
                      {new Date(application.applied_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Select
                      defaultValue={application.status}
                      onValueChange={(value) => handleStatusChange(application.id, value)}
                    >
                      <SelectTrigger className="h-8 w-[120px] bg-gray-800 border-gray-700 text-xs text-white">
                        <SelectValue className="text-white" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="pending" className="text-gray-300 hover:text-white">Pending</SelectItem>
                        <SelectItem value="reviewing" className="text-gray-300 hover:text-white">Reviewing</SelectItem>
                        <SelectItem value="shortlisted" className="text-gray-300 hover:text-white">Shortlisted</SelectItem>
                        <SelectItem value="rejected" className="text-gray-300 hover:text-white">Rejected</SelectItem>
                        <SelectItem value="hired" className="text-gray-300 hover:text-white">Hired</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedApplication(application);
                          setIsDetailsModalOpen(true);
                        }}
                        className="h-8 text-xs text-gray-400 hover:text-white"
                      >
                        View Details
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (application.resume_url) {
                            window.open(application.resume_url, '_blank');
                          } else {
                            toast({
                              title: "No Resume",
                              description: "This applicant hasn't uploaded a resume",
                            });
                          }
                        }}
                        disabled={!application.resume_url}
                        className="h-8 text-xs text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        title={application.resume_url ? "Download Resume" : "No Resume Available"}
                      >
                        <FileText className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      {applications.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-gray-800 bg-gray-900/50 py-16">
          <User className="mb-4 h-12 w-12 text-gray-600" />
          <p className="text-lg text-gray-400">No applications yet</p>
          <p className="mt-2 text-sm text-gray-500">
            Applications will appear here when candidates apply for this position
          </p>
        </div>
      )}

      {/* Application Details Modal */}
      <ApplicationDetailsModal
        application={selectedApplication}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setSelectedApplication(null);
          setIsDetailsModalOpen(false);
        }}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}