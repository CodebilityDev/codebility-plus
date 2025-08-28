"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  Linkedin,
  Globe,
  FileText,
  Calendar,
  User,
  Briefcase,
  Download,
  Github
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@codevs/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@codevs/ui/select";
import { Label } from "@codevs/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { JobApplication } from "@/app/(marketing)/careers/_types/job-listings";

interface ApplicationDetailsModalProps {
  application: JobApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (applicationId: string, status: string) => void;
}

export default function ApplicationDetailsModal({
  application,
  isOpen,
  onClose,
  onStatusChange
}: ApplicationDetailsModalProps) {
  const { toast } = useToast();
  const [status, setStatus] = useState(application?.status || "pending");

  if (!application) return null;

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    onStatusChange?.(application.id, newStatus);
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto overflow-x-hidden bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light text-white">
            Application Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4 min-w-0">
          {/* Applicant Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-medium text-white">
                {application.first_name} {application.last_name}
              </h2>
              <p className="text-gray-400">{application.job_title || 'Position'}</p>
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Applied {new Date(application.applied_at).toLocaleDateString()}
                </span>
                {application.years_of_experience !== undefined && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {application.years_of_experience} years experience
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(status)}
              <Select
                value={status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="w-[140px] bg-gray-800 border-gray-700 text-white">
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
            </div>
          </div>

          {/* Contact Information */}
          <div className="rounded-lg border border-gray-800 p-4">
            <h3 className="mb-3 text-lg font-medium text-white">Contact Information</h3>
            <div className="grid gap-3">
              <a
                href={`mailto:${application.email}`}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4" />
                {application.email}
              </a>
              <div className="flex items-center gap-2 text-gray-400">
                <Phone className="h-4 w-4" />
                {application.phone}
              </div>
              {application.linkedin && (
                <a
                  href={application.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn Profile
                </a>
              )}
              {application.github && (
                <a
                  href={application.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Github className="h-4 w-4" />
                  GitHub Profile
                </a>
              )}
              {application.portfolio && (
                <a
                  href={application.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Globe className="h-4 w-4" />
                  Portfolio Website
                </a>
              )}
            </div>
          </div>

          {/* Additional Details */}
          {application.notes && (
            <div className="rounded-lg border border-gray-800 p-4">
              <h3 className="mb-3 text-lg font-medium text-white">Additional Information</h3>
              <p className="text-gray-300">
                {application.notes}
              </p>
            </div>
          )}

          {/* Experience */}
          <div className="rounded-lg border border-gray-800 p-4">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-medium text-white">
              <Briefcase className="h-5 w-5" />
              Experience
            </h3>
            <p className="text-gray-300 whitespace-pre-wrap">
              {application.experience}
            </p>
          </div>

          {/* Cover Letter */}
          <div className="rounded-lg border border-gray-800 p-4">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-medium text-white">
              <FileText className="h-5 w-5 flex-shrink-0" />
              Cover Letter
            </h3>
            <p className="text-gray-300 whitespace-pre-wrap break-words">
              {application.cover_letter}
            </p>
          </div>

          {/* Resume */}
          {application.resume_url && (
            <div className="rounded-lg border border-gray-800 p-4">
              <h3 className="mb-3 text-lg font-medium text-white">Resume</h3>
              <Button
                variant="outline"
                className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Resume
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              variant="purple"
              className="flex-1"
              onClick={() => {
                toast({
                  title: "Email Sent",
                  description: "Interview invitation has been sent to the applicant",
                });
              }}
            >
              <Mail className="mr-2 h-4 w-4" />
              Send Interview Invite
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}