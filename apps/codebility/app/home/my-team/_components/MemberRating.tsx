// apps/codebility/app/home/my-team/_components/MemberRating.tsx
"use client";

import { useState, useEffect } from "react";
import { Star, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClientClientComponent } from "@/utils/supabase/client";
import toast from "react-hot-toast";

// Define the 5 performance criteria with icons
const PERFORMANCE_CRITERIA = [
  { key: "punctuality", label: "Punctuality", icon: "⏰" },
  { key: "accountability", label: "Accountability", icon: "🎯" },
  { key: "responsiveness", label: "Responsiveness", icon: "⚡" },
  { key: "initiative", label: "Initiative", icon: "🚀" },
  { key: "reliability", label: "Reliability", icon: "✅" },
] as const;

type CriteriaKey = typeof PERFORMANCE_CRITERIA[number]['key'];

// Rating data structure matching database schema
interface MemberRating {
  id?: string;
  member_id: string;
  project_id: string;
  rated_by: string;
  punctuality: number;
  accountability: number;
  responsiveness: number;
  initiative: number;
  reliability: number;
  feedback?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface MemberRatingProps {
  memberId: string;
  projectId: string;
}

const MemberRating = ({ memberId, projectId }: MemberRatingProps) => {
  // Supabase client and user state
  const [supabase, setSupabase] = useState<any>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isTeamLead, setIsTeamLead] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Rating state - default to 0 for all criteria
  const [ratings, setRatings] = useState<Record<CriteriaKey, number>>({
    punctuality: 0,
    accountability: 0,
    responsiveness: 0,
    initiative: 0,
    reliability: 0,
  });
  
  const [feedback, setFeedback] = useState("");
  const [existingRatingId, setExistingRatingId] = useState<string | null>(null);

  // Initialize Supabase client and get current user
  useEffect(() => {
    const client = createClientClientComponent();
    setSupabase(client);
    
    if (client) {
      // Get current user session
      client.auth.getSession().then(({ data: { session } }) => {
        if (session?.user?.id) {
          setCurrentUserId(session.user.id);
        }
      });
    }
  }, []);

  // Check if current user is team lead and load existing ratings
  useEffect(() => {
    if (!supabase || !currentUserId || !projectId) return;

    const checkPermissionsAndLoadRatings = async () => {
      setIsLoading(true);
      
      try {
        // Check if current user is team lead for this project
        const { data: projectMember } = await supabase
          .from("project_members")
          .select("role")
          .eq("project_id", projectId)
          .eq("codev_id", currentUserId)
          .single();

        const isLead = projectMember?.role === "team_leader";
        setIsTeamLead(isLead);

        // Load existing ratings (for both team leads and regular members to view)
        const { data: existingRating } = await supabase
          .from("member_ratings")
          .select("*")
          .eq("member_id", memberId)
          .eq("project_id", projectId)
          .single();

        if (existingRating) {
          // Load existing ratings into state
          setRatings({
            punctuality: existingRating.punctuality || 0,
            accountability: existingRating.accountability || 0,
            responsiveness: existingRating.responsiveness || 0,
            initiative: existingRating.initiative || 0,
            reliability: existingRating.reliability || 0,
          });
          setFeedback(existingRating.feedback || "");
          setExistingRatingId(existingRating.id);
        }
      } catch (error) {
        console.error("Error checking permissions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkPermissionsAndLoadRatings();
  }, [supabase, currentUserId, projectId, memberId]);

  // Calculate overall performance (average of all criteria)
  const calculateOverall = (): number => {
    const values = Object.values(ratings);
    const sum = values.reduce((acc, val) => acc + val, 0);
    return values.length > 0 ? Number((sum / values.length).toFixed(1)) : 0;
  };

  // Handle star click for a specific criterion
  const handleStarClick = (criterion: CriteriaKey, value: number) => {
    // Show toast if not team lead
    if (!isTeamLead) {
      toast.error("Only team leads can rate team members", {
        icon: "🔒",
      });
      return;
    }
    
    setRatings(prev => ({
      ...prev,
      [criterion]: value
    }));
  };

  // Render stars for a criterion (10-star system)
  const renderStars = (criterion: CriteriaKey, currentValue: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((starValue) => (
          <button
            key={starValue}
            type="button"
            onClick={() => handleStarClick(criterion, starValue)}
            disabled={!isTeamLead}
            className={`transition-all duration-200 ${
              isTeamLead 
                ? 'cursor-pointer hover:scale-110' 
                : 'cursor-not-allowed opacity-60'
            }`}
            title={!isTeamLead ? "Only team leads can rate" : undefined}
          >
            <Star
              className={`h-5 w-5 ${
                starValue <= currentValue
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 dark:text-gray-600"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  // Save or update rating in database
  const handleSaveRating = async () => {
    if (!supabase || !currentUserId || !isTeamLead) {
      toast.error("You don't have permission to rate this member");
      return;
    }

    // Validate that at least one rating is provided
    const hasRating = Object.values(ratings).some(val => val > 0);
    if (!hasRating) {
      toast.error("Please provide at least one rating");
      return;
    }

    setIsSaving(true);

    try {
      const ratingData: Partial<MemberRating> = {
        member_id: memberId,
        project_id: projectId,
        rated_by: currentUserId,
        punctuality: ratings.punctuality,
        accountability: ratings.accountability,
        responsiveness: ratings.responsiveness,
        initiative: ratings.initiative,
        reliability: ratings.reliability,
        feedback: feedback.trim() || null,
        updated_at: new Date().toISOString(),
      };

      let result;
      
      if (existingRatingId) {
        // Update existing rating
        result = await supabase
          .from("member_ratings")
          .update(ratingData)
          .eq("id", existingRatingId)
          .select()
          .single();
      } else {
        // Insert new rating
        ratingData.created_at = new Date().toISOString();
        result = await supabase
          .from("member_ratings")
          .insert(ratingData)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      if (result.data) {
        setExistingRatingId(result.data.id);
        toast.success(existingRatingId ? "Rating updated successfully" : "Rating saved successfully");
      }
    } catch (error) {
      console.error("Error saving rating:", error);
      toast.error("Failed to save rating");
    } finally {
      setIsSaving(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const overallScore = calculateOverall();
  const hasAnyRating = Object.values(ratings).some(val => val > 0);

  return (
    <div className="space-y-6">
      {/* Permission Warning Banner - Only show if not team lead */}
      {!isTeamLead && (
        <div className="rounded-lg border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 p-4">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                View-Only Mode
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                Only team leads can rate team members. You can view existing ratings below.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Overall Performance Section */}
      <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              🎯 OVERALL PERFORMANCE
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {hasAnyRating ? "Average across all criteria" : "No ratings yet"}
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              {hasAnyRating ? `${overallScore}/10` : "—"}
            </div>
            {hasAnyRating && (
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(overallScore / 2)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Criteria Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            ── 10-STAR RATING SECTION ──
          </h3>
          {!isTeamLead && hasAnyRating && (
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Read-only
            </span>
          )}
        </div>
        
        {PERFORMANCE_CRITERIA.map((criterion) => {
          const currentRating = ratings[criterion.key];
          const percentage = (currentRating / 10) * 100;
          
          return (
            <div key={criterion.key} className="space-y-2">
              {/* Criterion Header with Icon and Score */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{criterion.icon}</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {criterion.label}
                  </span>
                </div>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {currentRating > 0 ? `${currentRating}/10` : "—"}
                </span>
              </div>

              {/* 10-Star Rating Input */}
              <div className="flex items-center gap-2">
                {renderStars(criterion.key, currentRating)}
              </div>

              {/* Progress Bar Visualization */}
              <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Feedback Section */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-900 dark:text-white">
          💬 RECENT FEEDBACK
        </label>
        {isTeamLead ? (
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Add any additional comments or feedback..."
            rows={4}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        ) : (
          <div className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 px-4 py-3 text-gray-600 dark:text-gray-400 min-h-[100px]">
            {feedback || "No feedback provided yet."}
          </div>
        )}
      </div>

      {/* Action Buttons - Only show for team leads */}
      {isTeamLead && (
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={handleSaveRating}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                {existingRatingId ? "Update Rating" : "Save Rating"}
              </>
            )}
          </Button>
        </div>
      )}

      {/* Last Updated Timestamp */}
      {existingRatingId && (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

export default MemberRating;