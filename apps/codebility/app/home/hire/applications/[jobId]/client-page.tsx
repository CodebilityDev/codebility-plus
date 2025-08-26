"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Phone, Linkedin, Globe, FileText, Calendar, User, Github } from "lucide-react";
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
import ApplicationDetailsModal from "../../_components/ApplicationDetailsModal";
import CustomBreadcrumb from "@/components/shared/dashboard/CustomBreadcrumb";
import { H1 } from "@/components/shared/dashboard";
import { updateApplicationStatus } from "../../actions";

interface JobApplication {
  id: string;
  job_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  years_of_experience?: number;
  cover_letter?: string;
  experience?: string;
  resume_url?: string;
  applied_at: string;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired';
  notes?: string;
}

interface JobApplicationsClientProps {
  jobId: string;
  jobTitle: string;
  applications: JobApplication[];
}

export default function JobApplicationsClient({ jobId, jobTitle, applications }: JobApplicationsClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    const result = await updateApplicationStatus(
      applicationId, 
      newStatus as 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired'
    );
    
    if (result.success) {
      toast({
        title: "Status Updated",
        description: `Application status changed to ${newStatus}`,
      });
      router.refresh();
    } else {
      toast({
        title: "Failed to update status",
        description: result.error,
        variant: "destructive",
      });
    }
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
                      <div className="mt-1 flex items-center gap-3">
                        {application.years_of_experience !== undefined && (
                          <span className="text-xs text-gray-400">
                            {application.years_of_experience} years exp
                          </span>
                        )}
                        {application.linkedin && (
                          <a
                            href={application.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                          >
                            <Linkedin className="h-3 w-3" />
                          </a>
                        )}
                        {application.github && (
                          <a
                            href={application.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                          >
                            <Github className="h-3 w-3" />
                          </a>
                        )}
                        {application.portfolio && (
                          <a
                            href={application.portfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                          >
                            <Globe className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                      {application.notes && (
                        <p className="mt-1 text-xs text-gray-500">
                          {application.notes}
                        </p>
                      )}
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
                        onClick={async () => {
                          if (application.resume_url) {
                            // If it's a full URL, open directly
                            if (application.resume_url.startsWith('http')) {
                              window.open(application.resume_url, '_blank');
                            } else {
                              // Otherwise, construct the Supabase storage URL
                              const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
                              const resumeUrl = `${supabaseUrl}/storage/v1/object/public/resumes/${application.resume_url}`;
                              window.open(resumeUrl, '_blank');
                            }
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