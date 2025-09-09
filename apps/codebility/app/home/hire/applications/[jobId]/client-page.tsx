"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { H1 } from "@/components/shared/dashboard";
import CustomBreadcrumb from "@/components/shared/dashboard/CustomBreadcrumb";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Calendar,
  Download,
  FileText,
  Github,
  Globe,
  Linkedin,
  Mail,
  MoreVertical,
  Phone,
  Trash2,
  User,
} from "lucide-react";
import { Input } from "@codevs/ui/input";
import { Label } from "@codevs/ui/label";
import { Search, ArrowUpDown } from "lucide-react";

import { Badge } from "@codevs/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@codevs/ui/select";

import ApplicationDetailsModal from "../../_components/ApplicationDetailsModal";
import { deleteJobApplication, updateApplicationStatus } from "../../actions";

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
  status: "pending" | "reviewing" | "shortlisted" | "rejected" | "hired";
  notes?: string;
}

interface JobApplicationsClientProps {
  jobId: string;
  jobTitle: string;
  applications: JobApplication[];
}

export default function JobApplicationsClient({
  jobId,
  jobTitle,
  applications,
}: JobApplicationsClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedApplication, setSelectedApplication] =
    useState<JobApplication | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // searcgh and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name_asc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [resumeFilter, setResumeFilter] = useState("all");

  const handleStatusChange = async (
    applicationId: string,
    newStatus: string,
  ) => {
    const result = await updateApplicationStatus(
      applicationId,
      newStatus as
      | "pending"
      | "reviewing"
      | "shortlisted"
      | "rejected"
      | "hired",
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
      pending: {
        color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        label: "Pending",
      },
      reviewing: {
        color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        label: "Reviewing",
      },
      shortlisted: {
        color: "bg-green-500/10 text-green-400 border-green-500/20",
        label: "Shortlisted",
      },
      rejected: {
        color: "bg-red-500/10 text-red-400 border-red-500/20",
        label: "Rejected",
      },
      hired: {
        color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        label: "Hired",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const breadcrumbItems = [
    { label: "Management", href: "/home" },
    { label: "Hire", href: "/home/hire" },
    { label: jobTitle },
  ];

  const handleDeleteApplication = async (applicationId: string) => {
    const result = await deleteJobApplication(applicationId, jobId);
    if (result.success) {
      toast({
        title: `Application Deleted: ${applicationId}`,
        description: "The application has been successfully removed",
      });
      setSelectedApplication(null);
      setIsDetailsModalOpen(false);
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete application",
        variant: "destructive",
      });
    }
  };

  const filterAndSortApplications = (applications: JobApplication[]) => {
    let filtered = applications.filter(app => {
      // Search filter - check name and email
      const fullName = `${app.first_name} ${app.last_name}`.toLowerCase();
      const matchesSearch = searchTerm === "" ||
        fullName.includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter - match your actual status values
      const matchesStatus = statusFilter === "all" ||
        (statusFilter === "reviewed" && app.status === "reviewing") ||
        (statusFilter === "accepted" && app.status === "shortlisted") ||
        (statusFilter === "interview" && app.status === "shortlisted") ||
        app.status === statusFilter;

      // Resume filter
      const matchesResume = resumeFilter === "all" ||
        (resumeFilter === "with_resume" && app.resume_url) ||
        (resumeFilter === "without_resume" && !app.resume_url);

      return matchesSearch && matchesStatus && matchesResume;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name_asc":
          return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
        case "name_desc":
          return `${b.first_name} ${b.last_name}`.localeCompare(`${a.first_name} ${a.last_name}`);
        case "date_asc":
          return new Date(a.applied_at).getTime() - new Date(b.applied_at).getTime();
        case "date_desc":
          return new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  };

  // Get filtered applications
  const filteredApplications = filterAndSortApplications(applications);

  return (
    <div className="container mx-auto max-w-7xl p-6">
      <div className="mb-6">
        <CustomBreadcrumb items={breadcrumbItems} />
      </div>

      <div className="mb-8">
        <H1>Applications for {jobTitle}</H1>

      </div>
      <div className="mb-6">
        <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-6">
          <div className="mb-6">
            <Label htmlFor="search" className="text-sm font-medium text-gray-300 mb-2 block">
              Search
            </Label>
            <div className="md:block relative lg:max-w-md max-w-full">
              <Input
                id="search"
                type="text"
                placeholder="Search applicant name, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400focus:border-customBlue-500 focus:outline-none focus:ring-1 focus:ring-customBlue-500"
              />
            </div>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Sort By */}
            <div>
              <Label className="text-sm font-medium text-gray-300 mb-2 block">
                Sort By
              </Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                  <SelectItem value="date_asc">Date Applied (Oldest)</SelectItem>
                  <SelectItem value="date_desc">Date Applied (Newest)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <Label className="text-sm font-medium text-gray-300 mb-2 block">
                Status
              </Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewing">Reviewing</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Resume Filter */}
            <div>
              <Label className="text-sm font-medium text-gray-300 mb-2 block">
                Resume
              </Label>
              <Select value={resumeFilter} onValueChange={setResumeFilter}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="All Applications" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">All Applications</SelectItem>
                  <SelectItem value="with_resume">With Resume</SelectItem>
                  <SelectItem value="without_resume">Without Resume</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters Button */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSortBy("name_asc");
                  setStatusFilter("all");
                  setResumeFilter("all");
                }}
                className="w-full px-4 py-2 text-sm font-medium text-dark bg-red-500 hover:bg-red-600 rounded-md transition-colors"
              >
                Clear Filters
              </button>
            </div>
            <p className="mt-2 text-gray-400">
              {filteredApplications.length} applicant{filteredApplications.length !== 1 ? "s" : ""}{" "}
              found
            </p>
          </div>
        </div>

      </div>
      {/* Applications Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-800 bg-gray-900/50">
        <table className="w-full table-fixed min-w-[800px]">
          <thead className="border-b border-gray-800">
            <tr className="text-left">
              <th className="px-4 py-3 text-sm font-medium text-gray-300" style={{ width: '25%' }}>
                Applicant
              </th>
              <th className="px-4 py-3 text-sm font-medium text-gray-300" style={{ width: '25%' }}>
                Contact
              </th>
              <th className="px-4 py-3 text-sm font-medium text-gray-300" style={{ width: '15%' }}>
                Applied
              </th>
              <th className="px-4 py-3 text-sm font-medium text-gray-300" style={{ width: '15%' }}>
                Status
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-300" style={{ width: '20%' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredApplications.map((application) => (
              <tr key={application.id} className="hover:bg-gray-900/70">
                <td className="px-4 py-3" style={{ width: '25%' }}>
                  <div className="overflow-hidden">
                    <p className="font-medium text-white truncate">
                      {application.first_name} {application.last_name}
                    </p>
                    <div className="mt-1 flex items-center gap-3">
                      {application.years_of_experience !== undefined && (
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {application.years_of_experience} years exp
                        </span>
                      )}
                      {application.linkedin && (
                        <a
                          href={application.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-gray-400 hover:text-white flex-shrink-0"
                        >
                          <Linkedin className="h-3 w-3" />
                        </a>
                      )}
                      {application.github && (
                        <a
                          href={application.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-gray-400 hover:text-white flex-shrink-0"
                        >
                          <Github className="h-3 w-3" />
                        </a>
                      )}
                      {application.portfolio && (
                        <a
                          href={application.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-gray-400 hover:text-white flex-shrink-0"
                        >
                          <Globe className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                    {application.notes && (
                      <p className="mt-1 text-xs text-gray-500 truncate">
                        {application.notes}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3" style={{ width: '25%' }}>
                  <div className="space-y-1 overflow-hidden">
                    <a
                      href={`mailto:${application.email}`}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-white"
                    >
                      <Mail className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{application.email}</span>
                    </a>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Phone className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{application.phone}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3" style={{ width: '15%' }}>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(application.applied_at).toLocaleDateString()}
                  </span>
                </td>
                <td className="px-4 py-3" style={{ width: '15%' }}>
                  <Select
                    defaultValue={application.status}
                    onValueChange={(value) => handleStatusChange(application.id, value)}
                  >
                    <SelectTrigger className="h-8 w-full border-gray-700 bg-gray-800 text-xs text-white">
                      <SelectValue className="text-white" />
                    </SelectTrigger>
                    <SelectContent className="border-gray-700 bg-gray-800 text-white">
                      <SelectItem value="pending" className="text-gray-300 hover:text-white">
                        Pending
                      </SelectItem>
                      <SelectItem value="reviewing" className="text-gray-300 hover:text-white">
                        Reviewing
                      </SelectItem>
                      <SelectItem value="shortlisted" className="text-gray-300 hover:text-white">
                        Shortlisted
                      </SelectItem>
                      <SelectItem value="rejected" className="text-gray-300 hover:text-white">
                        Rejected
                      </SelectItem>
                      <SelectItem value="hired" className="text-gray-300 hover:text-white">
                        Hired
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-3 text-right" style={{ width: '20%' }}>
                  <div className="inline-flex gap-2 items-center justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedApplication(application);
                        setIsDetailsModalOpen(true);
                      }}
                      className="h-8 text-xs text-gray-400 hover:text-white whitespace-nowrap"
                    >
                      View Details
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs text-gray-400 hover:text-white"
                          title="Resume options"
                        >
                          <MoreVertical className="h-4 w-4 flex-shrink-0" />
                          <span className="sr-only">Open resume menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="border-gray-800 bg-gray-900"
                      >
                        <DropdownMenuItem
                          onClick={async () => {
                            if (application.resume_url) {
                              // If it's a full URL, open directly
                              /*  if (application.resume_url.startsWith('http')) {
                                window.open(application.resume_url, '_blank');
                              } else { */
                              // Otherwise, construct the Supabase storage URL
                              const supabaseUrl =
                                process.env.NEXT_PUBLIC_SUPABASE_URL;
                              const resumeUrl = `${supabaseUrl}/storage/v1/object/public/codebility/${application.resume_url}`;
                              window.open(resumeUrl, "_blank");
                            } else {
                              toast({
                                title: "No Resume",
                                description:
                                  "This applicant hasn't uploaded a resume",
                              });
                            }
                          }}
                          className="text-gray-300 hover:bg-gray-800 hover:text-white"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download Resume
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleDeleteApplication(application.id)
                          }
                          className="text-red-400 hover:bg-gray-800 hover:text-red-300"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Application
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {filteredApplications.length === 0 && applications.length > 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-gray-800 bg-gray-900/50 py-16">
          <User className="mb-4 h-12 w-12 text-gray-600" />
          <p className="text-lg text-gray-400">No applications match your filters</p>
          <p className="mt-2 text-sm text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

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
