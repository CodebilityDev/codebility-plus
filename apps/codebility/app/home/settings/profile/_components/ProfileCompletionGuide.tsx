"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Minimize2, Maximize2, NotebookTabs, CheckCircle2, Circle, TrendingUp, Award } from "lucide-react";
import { Box } from "@/components/shared/dashboard";
import { createClientClientComponent } from "@/utils/supabase/client";

// Types for profile points data
interface ProfilePointsData {
  totalPoints: number;
  maxPossiblePoints: number;
  completionPercentage: number;
  completionDetails: Record<string, {
    completed: boolean;
    points: number;
    maxPoints: number;
    description?: string;
    itemCount?: number;
    maxItems?: number;
  }>;
  summary: {
    profileSections: {
      basicInfo: { points: number; maxPoints: number; completed: boolean };
      socialLinks: { points: number; maxPoints: number; completed: boolean };
      professionalInfo: { points: number; maxPoints: number; completed: boolean };
    };
    datacounts: {
      workExperiences: number;
      educationEntries: number;
      techSkills: number;
      positions: number;
    };
  };
}

const Badge = ({
  children,
  variant,
  className,
}: {
  children?: React.ReactNode;
  variant?: "secondary" | "outline" | "success" | "warning";
  className?: string;
}) => {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";
  const variants: Record<string, string> = {
    secondary: "bg-gray-700 text-gray-200",
    outline: "border border-gray-600 text-gray-300",
    success: "bg-green-500/20 text-green-400 border border-green-500/30",
    warning: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  };
  const variantClass = variant ? variants[variant] ?? "" : "";
  return (
    <span className={`${base} ${variantClass} ${className ?? ""}`.trim()}>
      {children}
    </span>
  );
};

// Modern Progress Bar Component
const ProgressBar = ({ 
  percentage, 
  className = "",
  showLabel = true,
  size = "default"
}: { 
  percentage: number; 
  className?: string;
  showLabel?: boolean;
  size?: "small" | "default" | "large";
}) => {
  const heights = {
    small: "h-2",
    default: "h-3",
    large: "h-4"
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={`bg-gray-700 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-400">Profile Completion</span>
          <span className="text-xs font-medium text-white">{percentage}%</span>
        </div>
      )}
    </div>
  );
};

// Section Progress Component
const SectionProgress = ({ 
  title, 
  points, 
  maxPoints, 
  icon: Icon,
  completed 
}: { 
  title: string; 
  points: number; 
  maxPoints: number; 
  icon: any;
  completed: boolean;
}) => {
  const percentage = maxPoints > 0 ? Math.round((points / maxPoints) * 100) : 0;
  
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/30 border border-gray-700">
      <div className={`p-2 rounded-lg ${completed ? 'bg-green-500/20' : 'bg-gray-700/50'}`}>
        <Icon className={`w-4 h-4 ${completed ? 'text-green-400' : 'text-gray-400'}`} />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-200">{title}</span>
          <span className="text-xs text-gray-400">{points}/{maxPoints} pts</span>
        </div>
        <ProgressBar percentage={percentage} showLabel={false} size="small" />
      </div>
    </div>
  );
};

export default function ProfileCompletionGuide() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfilePointsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

  // Enhanced task definitions that map to actual profile points categories
  const getTasksFromProfileData = (data: ProfilePointsData) => [
    {
      id: "image_url",
      category: "basicInfo",
      title: "Upload Your Profile Photo",
      description: "Upload your profile photo to help others recognize you and stand out in the community.",
      completed: data.completionDetails.image_url?.completed || false,
      points: data.completionDetails.image_url?.points || 0,
      maxPoints: data.completionDetails.image_url?.maxPoints || 5,
      icon: Circle,
    },
    {
      id: "about",
      category: "basicInfo", 
      title: "Write About Yourself",
      description: "Tell others about yourself, your interests, hobbies and what you're looking to achieve. (Minimum 50 characters)",
      completed: data.completionDetails.about?.completed || false,
      points: data.completionDetails.about?.points || 0,
      maxPoints: data.completionDetails.about?.maxPoints || 3,
      icon: Circle,
    },
    {
      id: "contact_info",
      category: "basicInfo",
      title: "Add Contact Information",
      description: "Add your phone number and address to complete your contact details.",
      completed: (data.completionDetails.phone_number?.completed || false) && (data.completionDetails.address?.completed || false),
      points: (data.completionDetails.phone_number?.points || 0) + (data.completionDetails.address?.points || 0),
      maxPoints: 4, // phone_number: 2 + address: 2
      icon: Circle,
    },
    {
      id: "social_links",
      category: "socialLinks",
      title: "Connect Your Social Profiles",
      description: "Link your professional profiles (GitHub, LinkedIn) and portfolio website to expand your network.",
      completed: data.completionDetails.github?.completed || data.completionDetails.linkedin?.completed || data.completionDetails.portfolio_website?.completed,
      points: (data.completionDetails.github?.points || 0) + (data.completionDetails.linkedin?.points || 0) + (data.completionDetails.portfolio_website?.points || 0) + (data.completionDetails.facebook?.points || 0) + (data.completionDetails.discord?.points || 0),
      maxPoints: 11, // github: 2 + linkedin: 2 + portfolio: 5 + facebook: 1 + discord: 1
      icon: Circle,
    },
    {
      id: "tech_stacks",
      category: "professionalInfo",
      title: "Add Your Technical Skills",
      description: `List your technical skills and expertise. (${data.completionDetails.tech_stacks?.itemCount || 0}/${data.completionDetails.tech_stacks?.maxItems || 10} skills added)`,
      completed: data.completionDetails.tech_stacks?.completed || false,
      points: data.completionDetails.tech_stacks?.points || 0,
      maxPoints: data.completionDetails.tech_stacks?.maxPoints || 20,
      icon: Circle,
    },
    {
      id: "work_experience",
      category: "professionalInfo",
      title: "Add Work Experience",
      description: `Include your past job experiences, internships, and relevant projects. (${data.summary.datacounts.workExperiences}/${data.completionDetails.work_experience?.maxItems || 5} experiences added)`,
      completed: data.completionDetails.work_experience?.completed || false,
      points: data.completionDetails.work_experience?.points || 0,
      maxPoints: data.completionDetails.work_experience?.maxPoints || 40,
      icon: Circle,
    },
    {
      id: "education",
      category: "professionalInfo",
      title: "Add Education Background",
      description: `Add your educational background and certifications. (${data.summary.datacounts.educationEntries}/${data.completionDetails.education?.maxItems || 4} entries added)`,
      completed: data.completionDetails.education?.completed || false,
      points: data.completionDetails.education?.points || 0,
      maxPoints: data.completionDetails.education?.maxPoints || 24,
      icon: Circle,
    },
    {
      id: "positions",
      category: "professionalInfo",
      title: "Define Your Positions",
      description: `Specify your job positions and roles. (${data.summary.datacounts.positions}/${data.completionDetails.positions?.maxItems || 5} positions added)`,
      completed: data.completionDetails.positions?.completed || false,
      points: data.completionDetails.positions?.points || 0,
      maxPoints: data.completionDetails.positions?.maxPoints || 15,
      icon: Circle,
    },
  ];

  useEffect(() => {
    fetchProfilePoints();
  }, []);

  const fetchProfilePoints = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const supabase = createClientClientComponent();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError("Please log in to view profile completion");
        return;
      }

      const response = await fetch(`/api/profile-points/${user.id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch profile points: ${response.statusText}`);
      }
      
      const data = await response.json();
      setProfileData(data);
    } catch (err) {
      console.error("Error fetching profile points:", err);
      setError(err instanceof Error ? err.message : "Failed to load profile completion data");
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = (taskId: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  if (loading) {
    return (
      <Box className="flex w-full flex-1 flex-col relative overflow-hidden">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-7 w-56 bg-gray-700/50 rounded animate-pulse"></div>
            <div className="w-5 h-5 bg-gray-700/50 rounded animate-pulse"></div>
          </div>
          <div className="h-4 bg-gray-700/50 rounded animate-pulse"></div>
          <div className="h-20 bg-gray-700/50 rounded animate-pulse"></div>
        </div>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex w-full flex-1 flex-col relative overflow-hidden">
        <div className="text-center py-8">
          <p className="text-red-400 mb-2">Failed to load profile completion data</p>
          <p className="text-gray-400 text-sm">{error}</p>
          <button 
            onClick={fetchProfilePoints}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </Box>
    );
  }

  if (!profileData) return null;

  const tasks = getTasksFromProfileData(profileData);
  const completedTasks = tasks.filter(task => task.completed).length;

  return (
    <Box className="flex w-full flex-1 flex-col relative overflow-hidden transition-all duration-500 ease-in-out">
      <div className={`transition-all duration-500 ease-in-out ${isExpanded ? "space-y-6" : "space-y-4"}`}>
        {/* Header with modern progress display */}
        <div className="space-y-4">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-400" />
              Profile Completion
              <Badge variant="secondary" className="ml-2">
                {profileData.totalPoints}/{profileData.maxPossiblePoints} pts
              </Badge>
            </h2>
            {isExpanded ? (
              <Minimize2 className="w-5 h-5 text-gray-400 transition-transform duration-300" />
            ) : (
              <Maximize2 className="w-5 h-5 text-gray-400 transition-transform duration-300" />
            )}
          </div>

          {/* Main Progress Bar */}
          <div className="space-y-3">
            <ProgressBar 
              percentage={profileData.completionPercentage} 
              size="large"
              className="mb-3"
            />
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">
                {completedTasks} of {tasks.length} sections completed
              </span>
              <span className="text-purple-400 font-medium flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {profileData.completionPercentage}% Complete
              </span>
            </div>
          </div>

          {/* Section Overview */}
          {!isExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <SectionProgress
                title="Basic Info"
                points={profileData.summary.profileSections.basicInfo.points}
                maxPoints={profileData.summary.profileSections.basicInfo.maxPoints}
                completed={profileData.summary.profileSections.basicInfo.completed}
                icon={CheckCircle2}
              />
              <SectionProgress
                title="Social Links"
                points={profileData.summary.profileSections.socialLinks.points}
                maxPoints={profileData.summary.profileSections.socialLinks.maxPoints}
                completed={profileData.summary.profileSections.socialLinks.completed}
                icon={CheckCircle2}
              />
              <SectionProgress
                title="Professional"
                points={profileData.summary.profileSections.professionalInfo.points}
                maxPoints={profileData.summary.profileSections.professionalInfo.maxPoints}
                completed={profileData.summary.profileSections.professionalInfo.completed}
                icon={CheckCircle2}
              />
            </div>
          )}
        </div>

        {/* Detailed Tasks (Expandable) */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-white mb-4">Profile Completion Tasks</h3>
            {tasks.map((task) => (
              <div
                key={task.id}
                className="rounded-lg border border-gray-700 bg-gray-800/50 overflow-hidden"
              >
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-700/50 transition-colors"
                  onClick={() => toggleDropdown(task.id)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                    
                    <div className="flex-1">
                      <span className={`font-medium ${task.completed ? 'text-green-400' : 'text-gray-200'}`}>
                        {task.title}
                      </span>
                      {task.points > 0 && (
                        <Badge 
                          variant={task.completed ? "success" : "outline"} 
                          className="ml-2"
                        >
                          {task.points}/{task.maxPoints} pts
                        </Badge>
                      )}
                      {!task.completed && task.maxPoints > 0 && (
                        <Badge variant="warning" className="ml-2">
                          +{task.maxPoints - task.points} available
                        </Badge>
                      )}
                    </div>
                  </div>

                  {openDropdowns[task.id] ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>

                {openDropdowns[task.id] && (
                  <div className="px-4 pb-4 pt-2 bg-gray-900/30 border-t border-gray-700 animate-in fade-in slide-in-from-top-1 duration-200">
                    <p className="text-sm text-gray-400 mb-3">{task.description}</p>
                    {task.maxPoints > 0 && (
                      <ProgressBar 
                        percentage={Math.round((task.points / task.maxPoints) * 100)} 
                        showLabel={false}
                        size="small"
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Box>
  );
}