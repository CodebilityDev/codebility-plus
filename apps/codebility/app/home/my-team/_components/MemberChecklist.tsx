"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Calendar } from "lucide-react";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string;
  priority: "low" | "medium" | "high";
}

interface MemberChecklistProps {
  memberId: string;
  projectId: string;
}

const MemberChecklist = ({ memberId, projectId }: MemberChecklistProps) => {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadChecklistItems();
  }, [memberId, projectId]);

  const loadChecklistItems = async () => {
    if (!memberId || !projectId) return;
    
    setIsLoading(true);
    try {
      // Mock data for now - in real implementation, this would fetch from API
      // You can replace this with actual API call: const response = await fetch(`/api/projects/${projectId}/members/${memberId}/checklist`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setChecklistItems([
        {
          id: "1",
          title: "Complete onboarding documentation",
          description: "Fill out all required forms and complete the onboarding checklist",
          completed: true,
          priority: "high"
        },
        {
          id: "2",
          title: "Set up development environment",
          description: "Install required tools and configure local development setup",
          completed: true,
          priority: "high"
        },
        {
          id: "3",
          title: "Review project documentation",
          description: "Go through the project README, API docs, and architecture overview",
          completed: true,
          priority: "medium"
        },
        {
          id: "4",
          title: "Implement user authentication feature",
          description: "Create login/logout functionality with proper validation",
          completed: false,
          dueDate: "2025-10-20",
          priority: "high"
        },
        {
          id: "5",
          title: "Write unit tests for API endpoints",
          description: "Add comprehensive test coverage for all authentication endpoints",
          completed: false,
          dueDate: "2025-10-25",
          priority: "medium"
        },
        {
          id: "6",
          title: "Code review training session",
          description: "Attend the team code review best practices workshop",
          completed: false,
          dueDate: "2025-10-30",
          priority: "low"
        }
      ]);
    } catch (error) {
      console.error("Error loading checklist items:", error);
      setChecklistItems([]);
    } finally {
      setIsLoading(false);
    }
  };
  const completedTasks = checklistItems.filter(item => item.completed).length;
  const totalTasks = checklistItems.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-100 border-red-200";
      case "medium": return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "low": return "text-green-600 bg-green-100 border-green-200";
      default: return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading checklist...</p>
        </div>
      </div>
    );
  }

  if (checklistItems.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <CheckCircle2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">No checklist items available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Section title="Progress Overview">
        <div className="flex items-center gap-4 p-4 rounded-lg bg-white/20 backdrop-blur-sm dark:bg-white/10 border border-white/30 dark:border-white/20">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {completionPercentage}%
            </div>
            <div className="text-sm text-gray-500">Complete</div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>{completedTasks} of {totalTasks} tasks completed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </Section>

      {/* Task List */}
      <Section title="Task List">
        <div className="space-y-3">
          {checklistItems.map((item) => (
            <div 
              key={item.id} 
              className={`p-4 rounded-lg border transition-all duration-200 ${
                item.completed 
                  ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' 
                  : 'bg-white/20 backdrop-blur-sm dark:bg-white/10 border-white/30 dark:border-white/20'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {item.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={`font-medium ${
                      item.completed 
                        ? 'text-green-800 dark:text-green-200 line-through' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {item.title}
                    </h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${
                    item.completed 
                      ? 'text-green-700 dark:text-green-300' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {item.description}
                  </p>
                  {item.dueDate && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Due: {new Date(item.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

// Helper Component
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

export default MemberChecklist;