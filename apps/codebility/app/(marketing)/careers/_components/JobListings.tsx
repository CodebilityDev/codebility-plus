"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MapPin, Clock, Briefcase, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@codevs/ui/badge";
import { JobListing } from "../_types/job-listings";
import JobApplicationModal from "./JobApplicationModal";
import { createClientClientComponent } from "@/utils/supabase/client";
import { Skeleton } from "@/components/ui/skeleton/skeleton";

export default function JobListings() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const itemsPerPage = 4;
  const totalPages = Math.ceil(jobListings.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = jobListings.slice(startIndex, endIndex);

  useEffect(() => {
    fetchJobListings();
  }, []);

  const fetchJobListings = async () => {
    try {
      setLoading(true);
      const supabase = createClientClientComponent();
      
      const { data, error } = await supabase
        .from('job_listings')
        .select('*')
        .eq('status', 'active')
        .order('posted_date', { ascending: false });

      if (error) {
        console.error('Error fetching job listings:', error);
        setError('Failed to load job listings');
        return;
      }

      setJobListings(data || []);
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred while loading job listings');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (job: JobListing) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
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
    <section className="relative py-20 border-y border-gray-800">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-light tracking-tight text-white">
            Open Positions
          </h2>
          <p className="text-lg text-gray-400">
            Join our team and help shape the future of technology
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
                <Skeleton className="mb-3 h-6 w-3/4" />
                <Skeleton className="mb-2 h-4 w-1/2" />
                <Skeleton className="mb-4 h-16 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400">{error}</p>
          </div>
        ) : jobListings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No open positions at the moment. Please check back later.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6">
              {currentJobs.map((job) => (
            <div
              key={job.id}
              className="group relative overflow-hidden rounded-lg border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm transition-all hover:border-customViolet-100/50 hover:bg-gray-900/70"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-customViolet-100/5 to-customBlue-100/5 opacity-0 transition-opacity group-hover:opacity-100" />
              
              <div className="relative">
                <div className="mb-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {job.title}
                      </h3>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          <span>{job.department}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        {job.salary_range && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            <span>{job.salary_range}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      variant="purple"
                      size="sm"
                      className="h-8 w-full max-w-[80px] px-3 text-xs sm:mt-0 sm:w-auto"
                      onClick={() => handleApply(job)}
                    >
                      Apply
                    </Button>
                  </div>
                </div>

                <p className="mb-4 text-sm text-gray-300 line-clamp-2">{job.description}</p>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={getLevelColor(job.level)}>
                    {job.level}
                  </Badge>
                  <Badge variant="outline" className={getTypeColor(job.type)}>
                    {job.type}
                  </Badge>
                  {job.remote && (
                    <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                      Remote
                    </Badge>
                  )}
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-500">
                    Posted {new Date(job.posted_date).toLocaleDateString()}
                  </span>
                </div>

                <div className="mt-4 border-t border-gray-800 pt-4">
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.map((req, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-gray-800/50 px-2.5 py-1 text-xs text-gray-400"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
              ))}
            </div>

            {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center">
            <div className="flex items-center gap-1 rounded-lg border border-gray-800 bg-gray-900/30 p-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded text-gray-400 transition-colors hover:bg-gray-800 hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              
              <div className="flex gap-1 px-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-8 w-8 rounded text-sm font-medium transition-colors ${
                      currentPage === page 
                        ? "bg-customViolet-100 text-white" 
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded text-gray-400 transition-colors hover:bg-gray-800 hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
            )}
          </>
        )}
      </div>

      {/* Job Application Modal */}
      <JobApplicationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        job={selectedJob}
      />
    </section>
  );
}