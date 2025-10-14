"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";

interface RatingData {
  overallRating: number;
  technicalSkills: number;
  communication: number;
  teamwork: number;
  punctuality: number;
  feedback: string;
  lastUpdated: string;
}

interface MemberRatingProps {
  memberId: string;
  projectId: string;
}

const MemberRating = ({ memberId, projectId }: MemberRatingProps) => {
  const [ratingData, setRatingData] = useState<RatingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRatingData();
  }, [memberId, projectId]);

  const loadRatingData = async () => {
    if (!memberId || !projectId) return;
    
    setIsLoading(true);
    try {
      // Mock data for now - in real implementation, this would fetch from API
      // You can replace this with actual API call: const response = await fetch(`/api/projects/${projectId}/members/${memberId}/rating`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setRatingData({
        overallRating: 4.2,
        technicalSkills: 4.5,
        communication: 4.0,
        teamwork: 4.3,
        punctuality: 3.8,
        feedback: "Excellent technical skills and great team player. Shows initiative and delivers quality work consistently.",
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error loading rating data:", error);
      setRatingData(null);
    } finally {
      setIsLoading(false);
    }
  };
  const renderStarRating = (rating: number, size: "sm" | "md" = "sm") => {
    const stars: React.ReactElement[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className={`${iconSize} fill-yellow-400 text-yellow-400`} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star className={`${iconSize} text-gray-300`} />
            <Star className={`${iconSize} fill-yellow-400 text-yellow-400 absolute inset-0`} style={{ clipPath: "inset(0 50% 0 0)" }} />
          </div>
        );
      } else {
        stars.push(<Star key={i} className={`${iconSize} text-gray-300`} />);
      }
    }
    return <div className="flex items-center gap-0.5">{stars}</div>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading rating data...</p>
        </div>
      </div>
    );
  }

  if (!ratingData) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">No rating data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Rating */}
      <Section title="Overall Performance">
        <div className="flex items-center gap-4 p-4 rounded-lg bg-white/20 backdrop-blur-sm dark:bg-white/10 border border-white/30 dark:border-white/20">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {ratingData.overallRating}
            </div>
            <div className="text-sm text-gray-500">Overall</div>
          </div>
          <div className="flex-1">
            {renderStarRating(ratingData.overallRating, "md")}
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Last updated: {new Date(ratingData.lastUpdated).toLocaleDateString()}
            </p>
          </div>
        </div>
      </Section>

      {/* Detailed Ratings */}
      <Section title="Performance Breakdown">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RatingItem 
            label="Technical Skills" 
            rating={ratingData.technicalSkills} 
          />
          <RatingItem 
            label="Communication" 
            rating={ratingData.communication} 
          />
          <RatingItem 
            label="Teamwork" 
            rating={ratingData.teamwork} 
          />
          <RatingItem 
            label="Punctuality" 
            rating={ratingData.punctuality} 
          />
        </div>
      </Section>

      {/* Feedback */}
      <Section title="Recent Feedback">
        <div className="p-4 rounded-lg bg-white/20 backdrop-blur-sm dark:bg-white/10 border border-white/30 dark:border-white/20">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {ratingData.feedback}
          </p>
        </div>
      </Section>
    </div>
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

const RatingItem = ({ label, rating }: { label: string; rating: number }) => (
  <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      <span className="text-sm font-bold text-gray-900 dark:text-white">{rating}</span>
    </div>
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${
            i < Math.floor(rating) 
              ? 'fill-yellow-400 text-yellow-400' 
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  </div>
);

export default MemberRating;