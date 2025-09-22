"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Users,
  Calendar,
  MapPin,
  DollarSign,
  User,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@codevs/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@codevs/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { JobListing } from "@/app/(marketing)/careers/_types/job-listings";
import EditJobModal from "./EditJobModal";
import { createClientClientComponent } from "@/utils/supabase/client";
import { Skeleton } from "@/components/ui/skeleton/skeleton";
import { useUserStore } from "@/store/codev-store";
import { deleteJobListing } from "../actions";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@codevs/ui/accordion"
interface JobWithApplicationCount extends JobListing {
  application_count?: number;
  created_by_details?: {
    id: string;
    first_name: string;
    last_name: string;
    email_address: string;
  };
}

export default function JobListingsTable() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUserStore();
  const [jobs, setJobs] = useState<JobWithApplicationCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState<JobListing | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Check if user is admin (role_id 1 or 4)
  const isAdmin = user?.role_id === 1 || user?.role_id === 4;

  useEffect(() => {
    fetchJobListings();
  }, []);

  const fetchJobListings = async () => {
    try {
      setLoading(true);
      const supabase = createClientClientComponent();

      // Fetch job listings with creator details
      const { data: jobsData, error: jobsError } = await supabase
        .from('job_listings')
        .select(`
          *,
          created_by_details:codev!job_listings_created_by_fkey(
            id,
            first_name,
            last_name,
            email_address
          )
        `)
        .order('posted_date', { ascending: false });

      if (jobsError) {
        console.error('Error fetching job listings:', jobsError);
        toast({
          title: "Failed to load job listings",
          description: "Please refresh the page to try again.",
          variant: "destructive",
        });
        return;
      }

      // Fetch application counts for each job
      const jobsWithCounts = await Promise.all(
        (jobsData || []).map(async (job) => {
          const { count } = await supabase
            .from('job_applications')
            .select('*', { count: 'exact', head: true })
            .eq('job_id', job.id);

          return {
            ...job,
            application_count: count || 0,
            created_by: job.created_by_details ? {
              id: job.created_by_details.id,
              name: `${job.created_by_details.first_name} ${job.created_by_details.last_name}`,
              email: job.created_by_details.email_address
            } : undefined
          };
        })
      );

      setJobs(jobsWithCounts);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "An error occurred",
        description: "Failed to load job listings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (confirm("Are you sure you want to delete this job listing? This action cannot be undone.")) {
      try {
        const result = await deleteJobListing(jobId);

        if (!result.success) {
          throw new Error(result.error || "Failed to delete job");
        }

        // Remove from local state
        setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));

        toast({
          title: "Job Deleted",
          description: "The job listing has been permanently removed.",
        });
      } catch (error) {
        console.error('Delete error:', error);
        toast({
          title: "Failed to delete",
          description: error instanceof Error ? error.message : "Please try again later.",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (job: JobListing) => {
    setEditingJob(job);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditingJob(null);
    setIsEditModalOpen(false);
  };

  const handleJobUpdated = () => {
    // Refetch the jobs from the database
    fetchJobListings();

    toast({
      title: "Job Updated",
      description: "The job listing has been updated successfully.",
    });
  };

  const handleViewApplications = (jobId: string) => {
    router.push(`/home/hire/applications/${jobId}`);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Entry":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "Mid":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Senior":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "Lead":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      default:
        return "bg-gray-500/10 text-muted-foreground border-gray-500/20";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Full-time":
        return "bg-customTeal/10 text-customTeal border-customTeal/20";
      case "Part-time":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "Contract":
        return "bg-pink-500/10 text-pink-400 border-pink-500/20";
      case "Internship":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      default:
        return "bg-gray-500/10 text-muted-foreground border-gray-500/20";
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-gray-800 bg-gray-900/50 overflow-hidden p-8">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="rounded-lg border bg-card dark:border-gray-800 dark:bg-gray-900/50 p-12 text-center">
        <p className="text-muted-foreground">No job listings yet. Create your first job listing to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card dark:bg-blue-50/5  overflow-hidden">
      <div className="hidden xl:block">
        <Table className="border dark:border-gray-700">
          <TableHeader>
            <TableRow className="border-border hover:bg-muted/50 transition-colors dark:border-gray-700">
              <TableHead className="text-foreground">Position</TableHead>
              <TableHead className="text-foreground">Location</TableHead>
              <TableHead className="text-foreground">Type</TableHead>
              <TableHead className="text-foreground text-center">Applications</TableHead>
              <TableHead className="text-foreground">Created By</TableHead>
              <TableHead className="text-foreground">Posted</TableHead>
              <TableHead className="text-foreground text-right min-w-[200px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id} className="border-border hover:bg-muted/30 transition-colors dark:border-gray-700">
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{job.title}</p>
                    <div className="mt-1 flex gap-2">
                      <Badge variant="outline" className={getLevelColor(job.level)}>
                        {job.level}
                      </Badge>
                      {job.remote && (
                        <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                          Remote
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="text-sm">{job.location}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getTypeColor(job.type)}>
                    {job.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <button
                    onClick={() => handleViewApplications(job.id)}
                    className="group inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Users className="h-3.5 w-3.5" />
                    <span className="font-medium">{job.application_count || 0}</span>
                    <span className="text-xs ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      View
                    </span>
                  </button>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span className="text-sm">{job.created_by?.name || "Unknown"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span className="text-sm">
                      {new Date(job.posted_date).toLocaleDateString()}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"

                      onClick={() => handleViewApplications(job.id)}
                      className="h-8 bg-background border-border text-foreground transition-colors hover:bg-accent"
                    >
                      <Eye className="mr-2 h-3 w-3" />
                      Applications
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="group h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <MoreVertical className="h-4 w-4 flex-shrink-0" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover border-border">
                        <DropdownMenuItem
                          onClick={() => handleEdit(job)}
                          className="text-foreground hover:text-foreground hover:bg-accent"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Listing
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(job.id)}
                          className="text-destructive hover:text-destructive hover:bg-accent "
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Accordion */}
      <div className="xl:hidden">
        <Accordion type="single" collapsible className="w-full">
          {jobs.map((job) => (
            <AccordionItem key={job.id} value={job.id}>
              <AccordionTrigger className="px-4 py-3 text-left [&>svg]:text-foreground">
                <div className="w-full">
                  <p className="font-medium text-foreground">{job.title}</p>
                  <p className="text-xs text-muted-foreground">{job.location}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className={getLevelColor(job.level)} >
                      {job.level}
                    </Badge>
                    <Badge variant="outline" className={getTypeColor(job.type)} >
                      {job.type}
                    </Badge>
                    {job.remote && (
                      <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20" >
                        Remote
                      </Badge>
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-3 space-y-3 text-sm">

                <Table className="hidden sm:table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-foreground">Location</TableHead>
                      <TableHead className="text-foreground">Applications</TableHead>
                      <TableHead className="text-foreground">Created By</TableHead>
                      <TableHead className="text-foreground">Posted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{job.location}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground">
                        <button
                          onClick={() => handleViewApplications(job.id)}
                          className="group inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Users className="h-3.5 w-3.5" />
                          <span className="font-medium">{job.application_count || 0}</span>
                          <span className="text-xs ml-1  group-hover:opacity-100">
                            View
                          </span>
                        </button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>{job.created_by?.name || "Unknown"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(job.posted_date).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <div className="sm:hidden space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-foreground text-xs font-medium mb-1">Location</span>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{job.location}</span>
                      </div>
                    </div>

                    <div>
                      <span className="block text-foreground text-xs font-medium mb-1">Applications</span>
                      <button
                        onClick={() => handleViewApplications(job.id)}
                        className="group inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Users className="h-3.5 w-3.5" />
                        <span className="font-medium">{job.application_count || 0}</span>
                        <span className="text-xs ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          View
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-foreground text-xs font-medium mb-1">Created By</span>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>{job.created_by?.name || "Unknown"}</span>
                      </div>
                    </div>

                    <div>
                      <span className="block text-foreground text-xs font-medium mb-1">Posted</span>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(job.posted_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>




                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                  <Button
                    variant="outline"

                    onClick={() => handleViewApplications(job.id)}
                    className="h-8 text-xs text-foreground border hover:bg-muted"
                  >
                    <Eye className="mr-2 h-3 w-3" />
                    Applications
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"

                        className="h-8 text-xs text-foreground hover:bg-muted"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border-border">
                      <DropdownMenuItem
                        onClick={() => handleEdit(job)}
                        className="text-foreground hover:text-foreground hover:bg-accent"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Listing
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(job.id)}
                        className="text-destructive hover:text-destructive hover:bg-accent"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Edit Job Modal */}
      <EditJobModal
        job={editingJob}
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onJobUpdated={handleJobUpdated}
      />
    </div>
  );
}