"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { H1 } from "@/components/shared/dashboard";
import CustomBreadcrumb from "@/components/shared/dashboard/CustomBreadcrumb";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@codevs/ui/accordion"
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
  MoreHorizontal,
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
        <div className="bg-card rounded-lg border p-6">
          <div className="mb-6">
            <Label htmlFor="search" className="text-sm font-medium text-muted-foreground mb-2 block">
              Search
            </Label>
            <div className="md:block relative lg:max-w-md max-w-full">
              <Input
                id="search"
                type="text"
                placeholder="Search applicant name, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card border text-foreground placeholder:text-muted-foreground focus:border-customBlue-500 focus:outline-none focus:ring-1 focus:ring-customBlue-500"
              />
            </div>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Sort By */}
            <div>
              <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                Sort By
              </Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-card border text-foreground">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border">
                  <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                  <SelectItem value="date_asc">Date Applied (Oldest)</SelectItem>
                  <SelectItem value="date_desc">Date Applied (Newest)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                Status
              </Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-card border text-foreground">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent className="bg-card border">
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
              <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                Resume
              </Label>
              <Select value={resumeFilter} onValueChange={setResumeFilter}>
                <SelectTrigger className="border bg-card text-foreground">
                  <SelectValue placeholder="All Applications" />
                </SelectTrigger>
                <SelectContent className="bg-card border">
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
                className="w-full px-4 py-2 text-sm font-medium text-foreground bg-destructive/80 border hover:bg-accent rounded-md"
              >
                Clear Filters
              </button>
            </div>
            <p className="mt-2 text-muted-foreground">
              {filteredApplications.length} applicant{filteredApplications.length !== 1 ? "s" : ""}{" "}
              found
            </p>
          </div>
        </div>

      </div>


      <div className="rounded-lg border bg-card">
        {/* Desktop Table */}
        <div className="hidden xl:block">
          <div className=" overflow-hidden">
            <table className="w-full min-w-[800px]">
              <thead className="border-b bg-card">
                <tr className="text-left">
                  <th className="px-4 py-3 text-sm font-medium text-foreground w-1/4 min-w-[200px]">
                    Applicant
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-foreground w-1/4 min-w-[200px]">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-foreground w-[15%] min-w-[120px]">
                    Applied
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-foreground w-[15%] min-w-[120px]">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-foreground w-[20%] min-w-[200px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-accent">
                    <td className="px-4 py-3 w-1/4 min-w-[200px]">
                      <div className="overflow-hidden">
                        <p className="font-medium text-foreground truncate">
                          {application.first_name} {application.last_name}
                        </p>
                        <div className="mt-1 flex items-center gap-3">
                          {application.years_of_experience !== undefined && (
                            <span className="text-xs text-muted-foreground flex-shrink-0">
                              {application.years_of_experience} years exp
                            </span>
                          )}
                          {application.linkedin && (
                            <a
                              href={application.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground flex-shrink-0"
                            >
                              <Linkedin className="h-3 w-3" />
                            </a>
                          )}
                          {application.github && (
                            <a
                              href={application.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground flex-shrink-0"
                            >
                              <Github className="h-3 w-3" />
                            </a>
                          )}
                          {application.portfolio && (
                            <a
                              href={application.portfolio}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground flex-shrink-0"
                            >
                              <Globe className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                        {application.notes && (
                          <p className="mt-1 text-xs text-muted-foreground truncate">
                            {application.notes}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 w-1/4 min-w-[200px]">
                      <div className="space-y-1 overflow-hidden">
                        <a
                          href={`mailto:${application.email}`}
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                        >
                          <Mail className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{application.email}</span>
                        </a>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{application.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 w-[15%] min-w-[120px]">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(application.applied_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 w-[15%] min-w-[120px]">
                      <Select
                        defaultValue={application.status}
                        onValueChange={(value) => handleStatusChange(application.id, value)}
                      >
                        <SelectTrigger className="h-8 w-full border border-muted-foreground bg-card text-xs text-foreground">
                          <SelectValue className="text-foreground" />
                        </SelectTrigger>
                        <SelectContent className="border bg-card text-foreground">
                          <SelectItem value="pending" className="text-muted-foreground hover:text-foreground">
                            Pending
                          </SelectItem>
                          <SelectItem value="reviewing" className="text-muted-foreground hover:text-foreground">
                            Reviewing
                          </SelectItem>
                          <SelectItem value="shortlisted" className="text-muted-foreground hover:text-foreground">
                            Shortlisted
                          </SelectItem>
                          <SelectItem value="rejected" className="text-muted-foreground hover:text-foreground">
                            Rejected
                          </SelectItem>
                          <SelectItem value="hired" className="text-muted-foreground hover:text-foreground">
                            Hired
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3 text-right w-[20%] min-w-[160px]">
                      <div className="inline-flex gap-2 items-center justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedApplication(application);
                            setIsDetailsModalOpen(true);
                          }}
                          className="h-8 text-xs text-muted-foreground hover:text-foreground whitespace-nowrap border border-muted-foreground"
                        >
                          View Details
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-xs text-muted-foreground hover:text-foreground"
                              title="Resume options"
                            >
                              <MoreVertical className="h-4 w-4 flex-shrink-0" />
                              <span className="sr-only">Open resume menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="border bg-card"
                          >
                            <DropdownMenuItem
                              onClick={async () => {
                                if (application.resume_url) {
                                  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
                                  const resumeUrl = `${supabaseUrl}/storage/v1/object/public/codebility/${application.resume_url}`;
                                  window.open(resumeUrl, "_blank");
                                } else {
                                  toast({
                                    title: "No Resume",
                                    description: "This applicant hasn't uploaded a resume",
                                  });
                                }
                              }}
                              className="text-muted-foreground hover:bg-accent hover:text-foreground"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download Resume
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteApplication(application.id)}
                              className="text-destructive hover:bg-accent hover:text-destructive"
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
        </div>

        {/* Mobile Accordion */}
        <div className="xl:hidden">
          <Accordion type="single" collapsible className="w-full">
            {filteredApplications.map((application) => (
              <AccordionItem key={application.id} value={application.id}>
                <AccordionTrigger className="px-4 py-3 text-left [&>svg]:text-white" >
                  <div>
                    <p className="font-medium text-foreground">
                      {application.first_name} {application.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {application.email}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {application.linkedin && (
                        <a
                          href={application.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground flex-shrink-0"
                        >
                          <Linkedin className="h-3 w-3" />
                        </a>
                      )}
                      {application.github && (
                        <a
                          href={application.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground flex-shrink-0"
                        >
                          <Github className="h-3 w-3" />
                        </a>
                      )}
                      {application.portfolio && (
                        <a
                          href={application.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground flex-shrink-0"
                        >
                          <Globe className="h-3 w-3" />
                        </a>
                      )}
                      {application.notes && (
                        <p className="mt-1 text-xs text-muted-foreground truncate">
                          {application.notes}
                        </p>
                      )}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 py-3 space-y-3 text-sm text-muted-foreground">
                  <div className="row-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div>
                      <span className="block text-foreground text-xs">Phone</span>
                      <span>{application.phone}</span>
                    </div>
                    <div>
                      <span className="block text-foreground text-xs">Email</span>
                      <span>{application.email}</span>
                    </div>
                    <div>
                      <span className="block text-foreground text-xs">Applied</span>
                      <span>{new Date(application.applied_at).toLocaleDateString()}</span>
                    </div>

                  </div>


                  <div>
                    <span className="block text-foreground text-xs">Status</span>
                    <Select
                      defaultValue={application.status}
                      onValueChange={(value) =>
                        handleStatusChange(application.id, value)
                      }
                    >
                      <SelectTrigger className="h-8 w-full border bg-card/80 text-xs text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border bg-card text-muted-foreground/90">
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="reviewing">Reviewing</SelectItem>
                        <SelectItem value="shortlisted">Shortlisted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="hired">Hired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedApplication(application)
                        setIsDetailsModalOpen(true)
                      }}
                      className="h-8 text-xs text-foreground border hover:bg-muted-foreground/25"
                    >
                      View Details
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs text-foreground hover:bg-muted-foreground/25"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="border bg-card/90">
                        <DropdownMenuItem
                          onClick={async () => {
                            if (application.resume_url) {
                              const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
                              const resumeUrl = `${supabaseUrl}/storage/v1/object/public/codebility/${application.resume_url}`
                              window.open(resumeUrl, "_blank")
                            } else {
                              toast({
                                title: "No Resume",
                                description: "This applicant hasn't uploaded a resume",
                              })
                            }
                          }}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download Resume
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteApplication(application.id)}
                          className="text-destructive hover:destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Application
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div >



      {
        filteredApplications.length === 0 && applications.length > 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border bg-card dark:border-gray-800 dark:bg-gray-900/50 py-16">
            <User className="mb-4 h-12 w-12 text-gray-600" />
            <p className="text-lg text-gray-400">No applications match your filters</p>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )
      }

      {
        applications.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border bg-card dark:border-gray-800 dark:bg-gray-900/50 py-16">
            <User className="mb-4 h-12 w-12 text-gray-600" />
            <p className="text-lg text-gray-400">No applications yet</p>
            <p className="mt-2 text-sm text-gray-500">
              Applications will appear here when candidates apply for this position
            </p>
          </div>
        )
      }

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
    </div >
  );
}
