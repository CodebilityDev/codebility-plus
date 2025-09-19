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
  User
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
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
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
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
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
      <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-12 text-center">
        <p className="text-gray-400">No job listings yet. Create your first job listing to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-800 hover:bg-gray-900/50">
            <TableHead className="text-gray-300">Position</TableHead>
            <TableHead className="text-gray-300">Location</TableHead>
            <TableHead className="text-gray-300">Type</TableHead>
            <TableHead className="text-gray-300 text-center">Applications</TableHead>
            <TableHead className="text-gray-300">Created By</TableHead>
            <TableHead className="text-gray-300">Posted</TableHead>
            <TableHead className="text-gray-300 text-right min-w-[200px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id} className="border-gray-800 hover:bg-gray-900/70">
              <TableCell>
                <div>
                  <p className="font-medium text-white">{job.title}</p>
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
                <div className="flex items-center gap-1 text-gray-400">
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
                  className="group inline-flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                >
                  <Users className="h-3.5 w-3.5" />
                  <span className="font-medium">{job.application_count || 0}</span>
                  <span className="text-xs ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    View
                  </span>
                </button>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-gray-400">
                  <User className="h-3 w-3" />
                  <span className="text-sm">{job.created_by?.name || "Unknown"}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-gray-400">
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
                    size="sm"
                    onClick={() => handleViewApplications(job.id)}
                    className="h-8 border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
                  >
                    <Eye className="mr-2 h-3 w-3" />
                    Applications
                  </Button>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="group h-8 w-8 text-gray-400 hover:text-white"
                      >
                        <MoreVertical className="h-4 w-4 flex-shrink-0" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
                      {(isAdmin || job.created_by === user?.id) && (
                        <>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleEdit(job);
                            }}
                            className="text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Listing
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDelete(job.id);
                            }}
                            className="text-red-400 hover:text-red-300 hover:bg-gray-800 cursor-pointer"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </>
                      )}
                      {!isAdmin && job.created_by !== user?.id && (
                        <DropdownMenuItem disabled className="text-gray-500">
                          No actions available
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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