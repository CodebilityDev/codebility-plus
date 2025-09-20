"use client";

import { useState } from "react";
import { Calendar, Clock, Users, Video, Plus } from "lucide-react";
import { Button } from "@codevs/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@codevs/ui/dialog";
import { Input } from "@codevs/ui/input";
import { Label } from "@codevs/ui/label";
import { Textarea } from "@codevs/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@codevs/ui/select";
import { Checkbox } from "@codevs/ui/checkbox";
import { toast } from "react-hot-toast";
import { createMeeting } from "../actions";

interface MeetingSchedulerProps {
  projectId: string;
  teamLeadId: string;
}

const MeetingScheduler = ({ projectId, teamLeadId }: MeetingSchedulerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    meetingType: "standup",
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: "10:00",
    durationMinutes: 30,
    meetingLink: "",
    isRecurring: false,
    recurrencePattern: "daily",
    recurrenceEndDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await createMeeting({
        ...formData,
        projectId,
        scheduledBy: teamLeadId,
        durationMinutes: Number(formData.durationMinutes),
        recurrenceEndDate: formData.recurrenceEndDate || undefined,
      });

      if (result.success) {
        toast.success("Meeting scheduled successfully!");
        setIsOpen(false);
        resetForm();
      } else {
        toast.error(result.error || "Failed to schedule meeting");
      }
    } catch (error) {
      toast.error("An error occurred while scheduling the meeting");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      meetingType: "standup",
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: "10:00",
      durationMinutes: 30,
      meetingLink: "",
      isRecurring: false,
      recurrencePattern: "daily",
      recurrenceEndDate: "",
    });
  };

  const meetingTypes = [
    { value: "standup", label: "Daily Standup", icon: "☀️" },
    { value: "weekly", label: "Weekly Sync", icon: "📅" },
    { value: "sprint", label: "Sprint Planning", icon: "🏃" },
    { value: "review", label: "Code Review", icon: "👁️" },
    { value: "other", label: "Other", icon: "📌" },
  ];

  const recurrencePatterns = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "biweekly", label: "Bi-weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="gap-2"
      >
        <Plus className="h-4 w-4" />
        Schedule Meeting
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule Team Meeting</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Meeting Type */}
            <div className="space-y-2">
              <Label>Meeting Type</Label>
              <Select
                value={formData.meetingType}
                onValueChange={(value) => 
                  setFormData({ ...formData, meetingType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {meetingTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <span className="flex items-center gap-2">
                        <span>{type.icon}</span>
                        <span>{type.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Meeting Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => 
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder={
                  formData.meetingType === "standup" 
                    ? "Daily Standup" 
                    : "Enter meeting title"
                }
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => 
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Meeting agenda, topics to discuss..."
                rows={3}
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => 
                    setFormData({ ...formData, scheduledDate: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) => 
                    setFormData({ ...formData, scheduledTime: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Duration and Meeting Link */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="15"
                  max="180"
                  value={formData.durationMinutes}
                  onChange={(e) => 
                    setFormData({ ...formData, durationMinutes: Number(e.target.value) })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link">Meeting Link (Optional)</Label>
                <Input
                  id="link"
                  type="url"
                  value={formData.meetingLink}
                  onChange={(e) => 
                    setFormData({ ...formData, meetingLink: e.target.value })
                  }
                  placeholder="https://meet.google.com/..."
                />
              </div>
            </div>

            {/* Recurring Meeting */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="recurring"
                  checked={formData.isRecurring}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, isRecurring: !!checked })
                  }
                />
                <Label htmlFor="recurring" className="font-normal">
                  This is a recurring meeting
                </Label>
              </div>

              {formData.isRecurring && (
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <div className="space-y-2">
                    <Label>Recurrence Pattern</Label>
                    <Select
                      value={formData.recurrencePattern}
                      onValueChange={(value) => 
                        setFormData({ ...formData, recurrencePattern: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {recurrencePatterns.map((pattern) => (
                          <SelectItem key={pattern.value} value={pattern.value}>
                            {pattern.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.recurrenceEndDate}
                      onChange={(e) => 
                        setFormData({ ...formData, recurrenceEndDate: e.target.value })
                      }
                      min={formData.scheduledDate}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Scheduling..." : "Schedule Meeting"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MeetingScheduler;