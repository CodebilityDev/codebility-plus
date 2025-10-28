"use client";

import { useState, FormEvent } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SimpleMemberData } from "@/app/home/projects/actions";
import { createChecklistItem } from "../actions";
import toast from "react-hot-toast";
import Image from "next/image";
import DefaultAvatar from "@/components/DefaultAvatar";

// ✅ CORRECTED IMPORTS - Using existing project components
// Input component from forms directory
import  Input  from "@/components/ui/forms/input";

// Textarea component - using textarea-home.tsx
import { Textarea } from "@/components/ui/textarea-home";

// Label component - creating inline since it doesn't exist
const Label = ({ 
  children, 
  htmlFor, 
  className = "" 
}: { 
  children: React.ReactNode; 
  htmlFor?: string; 
  className?: string;
}) => (
  <label 
    htmlFor={htmlFor} 
    className={`block text-sm font-medium text-gray-900 dark:text-white ${className}`}
  >
    {children}
  </label>
);

interface ChecklistCreateModalProps {
  isOpen: boolean;
  projectId: string;
  projectName: string;
  teamMembers: SimpleMemberData[];
  onClose: () => void;
  onSuccess: () => void;
}

const PRIORITY_LEVELS = ["low", "medium", "high"] as const;

const ChecklistCreateModal = ({
  isOpen,
  projectId,
  projectName,
  teamMembers,
  onClose,
  onSuccess
}: ChecklistCreateModalProps) => {
  const [formData, setFormData] = useState({
    memberId: "",
    title: "",
    description: "",
    priority: "medium" as typeof PRIORITY_LEVELS[number],
    due_date: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  // Format member name for display
  const formatName = (firstName: string, lastName: string): string => 
    `${firstName.charAt(0).toUpperCase()}${firstName.slice(1).toLowerCase()} ${lastName.charAt(0).toUpperCase()}${lastName.slice(1).toLowerCase()}`;

  // Get selected member details
  const selectedMember = teamMembers.find(m => m.id === formData.memberId);

  // Reset form when modal opens/closes
  const handleClose = () => {
    setFormData({
      memberId: "",
      title: "",
      description: "",
      priority: "medium",
      due_date: ""
    });
    onClose();
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validation
    if (!formData.memberId) {
      toast.error("Please select a team member");
      return;
    }
    
    if (!formData.title.trim()) {
      toast.error("Please enter a task title");
      return;
    }

    setIsLoading(true);

    try {
      // Create FormData object for server action
      const submitData = new FormData();
      submitData.append("member_id", formData.memberId);
      submitData.append("project_id", projectId);
      submitData.append("title", formData.title.trim());
      submitData.append("description", formData.description.trim());
      submitData.append("priority", formData.priority);
      if (formData.due_date) {
        submitData.append("due_date", formData.due_date);
      }

      // Call server action
      const result = await createChecklistItem(submitData);

      if (result.success) {
        toast.success(`Task created for ${selectedMember ? formatName(selectedMember.first_name, selectedMember.last_name) : 'team member'}!`);
        onSuccess();
        handleClose();
      } else {
        toast.error(result.error || "Failed to create task");
      }
    } catch (error) {
      console.error("Error creating checklist item:", error);
      toast.error("Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
              ✨ Create Task for Team Member
            </DialogTitle>
          </DialogHeader>

          {/* Project Info Banner */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <span className="font-semibold">Project:</span> {projectName}
            </p>
          </div>

          <div className="space-y-4">
            {/* Member Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Assign To <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.memberId}
                onValueChange={(value) => setFormData({ ...formData, memberId: value })}
                disabled={isLoading}
              >
                <SelectTrigger className="bg-light-900 dark:bg-dark-200 border border-gray-300 focus:border-blue-500">
                  <SelectValue placeholder="Select team member..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        <div className="flex items-center gap-3 py-1">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                            {member.image_url ? (
                              <Image
                                src={member.image_url}
                                alt={formatName(member.first_name, member.last_name)}
                                width={32}
                                height={32}
                                className="rounded-full object-cover"
                              />
                            ) : (
                              <DefaultAvatar size={32} />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {formatName(member.first_name, member.last_name)}
                            </span>
                            {member.display_position && (
                              <span className="text-xs text-gray-500">
                                {member.display_position}
                              </span>
                            )}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              
              {/* Selected Member Preview */}
              {selectedMember && (
                <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      {selectedMember.image_url ? (
                        <Image
                          src={selectedMember.image_url}
                          alt={formatName(selectedMember.first_name, selectedMember.last_name)}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <DefaultAvatar size={40} />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-green-800 dark:text-green-200">
                        Creating task for: {formatName(selectedMember.first_name, selectedMember.last_name)}
                      </p>
                      {selectedMember.display_position && (
                        <p className="text-xs text-green-700 dark:text-green-300">
                          {selectedMember.display_position}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Task Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Task Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Complete onboarding documentation"
                className="w-full bg-light-900 dark:bg-dark-200 dark:text-light-900 border border-gray-300 focus:border-blue-500 rounded-lg px-3 py-2"
                required
                disabled={isLoading}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description <span className="text-gray-400 text-xs">(optional)</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add details about this task..."
                rows={4}
                className="w-full bg-light-900 dark:bg-dark-200 dark:text-light-900 border border-gray-300 focus:border-blue-500 resize-none rounded-lg px-3 py-2"
                disabled={isLoading}
              />
            </div>

            {/* Priority and Due Date Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Priority */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Priority <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => 
                    setFormData({ ...formData, priority: value as typeof PRIORITY_LEVELS[number] })
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger className="bg-light-900 dark:bg-dark-200 border border-gray-300 focus:border-blue-500">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="low">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          Low
                        </span>
                      </SelectItem>
                      <SelectItem value="medium">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                          Medium
                        </span>
                      </SelectItem>
                      <SelectItem value="high">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                          High
                        </span>
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <Label htmlFor="due_date" className="text-sm font-medium">
                  Due Date <span className="text-gray-400 text-xs">(optional)</span>
                </Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full bg-light-900 dark:bg-dark-200 dark:text-light-900 border border-gray-300 focus:border-blue-500 rounded-lg px-3 py-2"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.title.trim() || !formData.memberId}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChecklistCreateModal;