"use client";

import { useState } from "react";
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

// Mock data - replace with actual data from your backend
const mockJobListings: JobListing[] = [
  {
    id: "1",
    title: "Senior Full Stack Developer",
    department: "Engineering",
    location: "Manila, Philippines",
    type: "Full-time",
    level: "Senior",
    description: "We are looking for an experienced Full Stack Developer to join our growing team.",
    requirements: ["5+ years experience", "React/Next.js", "Node.js", "PostgreSQL"],
    posted_date: "2024-01-15",
    salary_range: "₱80,000 - ₱120,000",
    remote: true,
    created_by: {
      id: "user1",
      name: "Admin User",
      email: "admin@codebility.com"
    }
  },
  {
    id: "2",
    title: "Frontend Developer",
    department: "Engineering",
    location: "Cebu, Philippines",
    type: "Full-time",
    level: "Mid",
    description: "Join our frontend team to create beautiful, responsive user interfaces.",
    requirements: ["3+ years experience", "React", "TypeScript", "Tailwind CSS"],
    posted_date: "2024-01-18",
    salary_range: "₱50,000 - ₱80,000",
    remote: true,
    created_by: {
      id: "user2",
      name: "HR Manager",
      email: "hr@codebility.com"
    }
  },
  {
    id: "3",
    title: "UI/UX Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    level: "Mid",
    description: "We need a creative UI/UX designer to help us design intuitive user experiences.",
    requirements: ["3+ years experience", "Figma", "Design Systems", "User Research"],
    posted_date: "2024-01-20",
    salary_range: "₱45,000 - ₱70,000",
    remote: true,
    created_by: {
      id: "user1",
      name: "Admin User",
      email: "admin@codebility.com"
    }
  },
];

// Mock applications count - replace with actual data
const applicationCounts: Record<string, number> = {
  "1": 15,
  "2": 8,
  "3": 12,
};

export default function JobListingsTable() {
  const router = useRouter();
  const { toast } = useToast();
  const [jobs, setJobs] = useState(mockJobListings);
  const [editingJob, setEditingJob] = useState<JobListing | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = async (jobId: string) => {
    if (confirm("Are you sure you want to delete this job listing? This action cannot be undone.")) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Remove from local state
        setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
        
        toast({
          title: "Job Deleted",
          description: "The job listing has been permanently removed.",
        });
      } catch (error) {
        toast({
          title: "Failed to delete",
          description: "Please try again later.",
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
    // In a real app, you would refetch the jobs from the API
    // For now, we'll just show a success message
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

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-800 hover:bg-gray-900/50">
            <TableHead className="text-gray-300">Position</TableHead>
            <TableHead className="text-gray-300">Department</TableHead>
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
              <TableCell className="text-gray-400">{job.department}</TableCell>
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
                  <span className="font-medium">{applicationCounts[job.id] || 0}</span>
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-white"
                      >
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
                      <DropdownMenuItem
                        onClick={() => handleEdit(job)}
                        className="text-gray-300 hover:text-white hover:bg-gray-800"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Listing
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(job.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-gray-800"
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