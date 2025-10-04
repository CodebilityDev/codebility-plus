"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Minimize2, Maximize2, NotebookTabs } from "lucide-react";
import { Box } from "@/components/shared/dashboard";

const Badge = ({
  children,
  variant,
  className,
}: {
  children?: React.ReactNode;
  variant?: "secondary" | "outline";
  className?: string;
}) => {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";
  const variants: Record<string, string> = {
    secondary: "bg-gray-700 text-gray-200",
    outline: "border border-gray-600 text-gray-300",
  };
  const variantClass = variant ? variants[variant] ?? "" : "";
  return (
    <span className={`${base} ${variantClass} ${className ?? ""}`.trim()}>
      {children}
    </span>
  );
};

export default function ProfileCompletionGuide() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState({
    profilePhoto: false,
    skillsList: false,
    aboutUser: false,
    contactInfo: false,
    portfolioWorks: false,
    workExperience: false,
  });

  const tasks = [
    {
      id: "profilePhoto",
      title: "Upload Your Profile Photo",
      description:
        "Upload your profile photo to help others recognize you and stand out in the community.",
      points: 5,
    },
    {
      id: "skillsList",
      title: "Add Your Technical Skills",
      description:
        "List your skills and areas of expertise to attract relevant opportunities.",
      points: "1",
    },
    {
      id: "aboutUser",
      title: "Write Something About Yourself",
      description:
        "Tell others about yourself, your interests, hobbies and what you're looking to achieve.",
      points: 3,
    },
    {
      id: "contactInfo",
      title: "Add Your Contact Info & Social Links",
      description:
        "Add your most active contact information and link your social media accounts (LinkedIn, Twitter, GitHub) to expand your network.",
      points: "2",
    },
    {
      id: "portfolioWorks",
      title: "Add Your Portfolio Website Link",
      description:
        "Add your personal website, portfolio, and any other relevant links to showcase your work.",
      points: 5,
    },
    {
      id: "workExperience",
      title: "Add Your Work Experience",
      description:
        "Include your past job experiences, internships, and relevant projects.",
      points: "5",
    },
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const toggleDropdown = (taskId: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  if (loading) {
    return (
      <Box className="flex w-full flex-1 flex-col relative overflow-hidden">
        <div>
          <div className="flex items-center justify-between">
            <div className="h-7 w-56 bg-gray-700/50 rounded animate-pulse"></div>
            <div className="w-5 h-5 bg-gray-700/50 rounded animate-pulse"></div>
          </div>
        </div>
      </Box>
    );
  }

  return (
    <Box className="flex w-full flex-1 flex-col relative overflow-hidden transition-all duration-500 ease-in-out">
      <div className={`transition-all duration-500 ease-in-out ${isExpanded ? "space-y-4" : ""}`}>
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
            <NotebookTabs className="w-5 h-5" />
            Profile Completion Guide
          </h2>
          {isExpanded ? (
            <Minimize2 className="w-5 h-5 text-gray-400 transition-transform duration-300" />
          ) : (
            <Maximize2 className="w-5 h-5 text-gray-400 transition-transform duration-300" />
          )}
        </div>

        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-3">
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
                    <span className="font-medium text-gray-200">
                      {task.title}
                    </span>

                    <Badge variant="outline" className="ml-auto mr-2">
                      +{task.points} pts
                    </Badge>
                  </div>

                  {openDropdowns[task.id] ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>

                {openDropdowns[task.id] && (
                  <div className="px-4 pb-4 pt-2 bg-gray-900/30 border-t border-gray-700 animate-in fade-in slide-in-from-top-1 duration-200">
                    <p className="text-sm text-gray-400">{task.description}</p>
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