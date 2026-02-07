"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createNotificationAction } from "@/lib/actions/notification.actions";
import {
  AlertCircle,
  Calendar,
  Clock,
  Link as LinkIcon,
  Users,
} from "lucide-react";
import { toast } from "react-hot-toast";

import { Input } from "@codevs/ui/input";
import { Label } from "@codevs/ui/label";

import { saveMeetingSchedule } from "../actions";

interface ScheduleMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  teamMembers: any[];
  teamLead: any;
  currentSchedule?: {
    selectedDays: string[];
    time: string;
    meetingLink?: string;
  } | null;
}

const ScheduleMeetingModal = ({
  isOpen,
  onClose,
  projectId,
  projectName,
  teamMembers,
  teamLead,
  currentSchedule,
}: ScheduleMeetingModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [meetingData, setMeetingData] = useState({
    time: "00:00",
    selectedDays: [] as string[],
    meetingLink: "",
  });

  const weekDays = [
    { value: "monday", label: "Monday", short: "Mon" },
    { value: "tuesday", label: "Tuesday", short: "Tue" },
    { value: "wednesday", label: "Wednesday", short: "Wed" },
    { value: "thursday", label: "Thursday", short: "Thu" },
    { value: "friday", label: "Friday", short: "Fri" },
    { value: "saturday", label: "Saturday", short: "Sat" },
    { value: "sunday", label: "Sunday", short: "Sun" },
  ];

  // Create a stable key for currentSchedule to prevent infinite loops
  const scheduleKey = useMemo(() => {
    if (!currentSchedule) return null;
    return JSON.stringify({
      time: currentSchedule.time,
      selectedDays: currentSchedule.selectedDays,
      meetingLink: currentSchedule.meetingLink,
    });
  }, [
    currentSchedule?.time,
    currentSchedule?.selectedDays,
    currentSchedule?.meetingLink,
  ]);

  // Load existing schedule when modal opens
  useEffect(() => {
    if (isOpen) {
      if (currentSchedule) {
        setMeetingData({
          time: currentSchedule.time || "00:00",
          selectedDays: currentSchedule.selectedDays || [],
          meetingLink: currentSchedule.meetingLink || "",
        });
      } else {
        // Set defaults if no schedule exists
        setMeetingData({
          time: "00:00",
          selectedDays: [],
          meetingLink: "",
        });
      }
    }
  }, [isOpen, scheduleKey]); // ✅ Use stable scheduleKey instead of currentSchedule object

  const toggleDay = (day: string) => {
    setMeetingData((prev) => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter((d) => d !== day)
        : [...prev.selectedDays, day],
    }));
  };

  const handleClearSchedule = async () => {
    setIsSubmitting(true);
    try {
      // Clear the meeting schedule
      await saveMeetingSchedule(projectId, {
        selectedDays: [],
        time: "00:00",
        meetingLink: "",
      });

      // Notify all team members about schedule removal
      const allMembers = teamLead ? [teamLead, ...teamMembers] : teamMembers;
      const notificationPromises = allMembers.map((member) =>
        createNotificationAction({
          recipientId: member.id,
          title: "Meeting Schedule Removed",
          message: `The meeting schedule for ${projectName} has been removed.`,
          type: "event",
          priority: "medium",
          actionUrl: `/home/my-team/${projectId}`,
          metadata: {
            projectId,
            projectName,
            scheduleRemoved: true,
          },
        }),
      );

      await Promise.all(notificationPromises);

      toast.success("Meeting schedule removed!");
      onClose();
    } catch (error) {
      console.error("Error clearing meeting schedule:", error);
      toast.error("Failed to clear meeting schedule");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!meetingData.time || meetingData.selectedDays.length === 0) {
      toast.error("Please select meeting days and time");
      return;
    }

    // Validate meeting link if provided
    if (meetingData.meetingLink && !isValidUrl(meetingData.meetingLink)) {
      toast.error("Please enter a valid meeting link URL");
      return;
    }

    setIsSubmitting(true);
    try {
      // Check if schedule has changed
      const hasExistingSchedule =
        currentSchedule &&
        currentSchedule.selectedDays.length > 0 &&
        currentSchedule.time;

      const scheduleChanged =
        hasExistingSchedule &&
        (JSON.stringify(currentSchedule.selectedDays.sort()) !==
          JSON.stringify(meetingData.selectedDays.sort()) ||
          currentSchedule.time !== meetingData.time ||
          currentSchedule.meetingLink !== meetingData.meetingLink);

      // Create a recurring meeting schedule
      const allMembers = teamLead ? [teamLead, ...teamMembers] : teamMembers;

      // Format selected days for display
      const selectedDaysDisplay = meetingData.selectedDays
        .map((day) => weekDays.find((d) => d.value === day)?.short)
        .join(", ");

      const notificationTitle = scheduleChanged
        ? "Meeting Schedule Changed"
        : "Meeting Schedule Set";

      // Build schedule message with platform info (don't display full URL)
      let scheduleMessage = `New Meeting Schedule: ${selectedDaysDisplay} at ${meetingData.time}`;
      if (meetingData.meetingLink) {
        scheduleMessage += `\nwith new meeting link provided.`;
      } else {
        scheduleMessage += `\nPlatform: Discord`;
      }

      // Send notifications to all team members
      const notificationPromises = allMembers.map((member) =>
        createNotificationAction({
          recipientId: member.id,
          title: notificationTitle,
          message: scheduleMessage,
          type: "event",
          priority: "high",
          actionUrl: `/home/my-team/${projectId}`,
          metadata: {
            meetingData: {
              time: meetingData.time,
              selectedDays: meetingData.selectedDays,
              meetingLink: meetingData.meetingLink || null,
              platform: meetingData.meetingLink ? "Custom" : "Discord",
              recurring: true,
              schedule: selectedDaysDisplay,
              changed: scheduleChanged,
            },
            projectId,
            projectName,
          },
        }),
      );

      await Promise.all(notificationPromises);

      // Save the meeting schedule
      await saveMeetingSchedule(projectId, {
        selectedDays: meetingData.selectedDays,
        time: meetingData.time,
        meetingLink: meetingData.meetingLink,
      });

      toast.success(
        scheduleChanged ? "Meeting schedule updated!" : "Meeting schedule set!",
      );

      onClose();
    } catch (error) {
      console.error("Error setting meeting schedule:", error);
      toast.error("Failed to set meeting schedule");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simple URL validation helper
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Set Meeting Schedule
          </DialogTitle>
          <DialogDescription>
            Set your team's regular meeting schedule
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Select Days *</Label>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {weekDays.map((day) => (
                <div
                  key={day.value}
                  className={`
                    flex cursor-pointer items-center justify-center rounded-lg border p-3 transition-all
                    ${
                      meetingData.selectedDays.includes(day.value)
                        ? "border-blue-500 bg-blue-500 text-white shadow-sm"
                        : "border-gray-300 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
                    }
                  `}
                  onClick={() => toggleDay(day.value)}
                >
                  <span className="text-sm font-medium">{day.short}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Meeting Time *</Label>
            <Input
              id="time"
              type="time"
              value={meetingData.time}
              onChange={(e) =>
                setMeetingData({ ...meetingData, time: e.target.value })
              }
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="meetingLink"
              className="mt-6 flex items-center gap-2"
            >
              <LinkIcon className="h-4 w-4" />
              Meeting Link (Optional)
            </Label>
            <Input
              id="meetingLink"
              type="url"
              value={meetingData.meetingLink}
              onChange={(e) =>
                setMeetingData({ ...meetingData, meetingLink: e.target.value })
              }
              placeholder="https://meet.google.com/... or https://discord.gg/..."
              className="w-full"
            />
            <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
              Add a Google Meet, Zoom, Discord, or any other meeting link
            </p>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-400" />
              <div className="space-y-1">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  {meetingData.meetingLink
                    ? "All meetings will use the provided link."
                    : "Use the voice channel link from Discord."}
                </p>
                <p className="text-xs text-blue-500 dark:text-blue-300">
                  {teamMembers.length + 1} team members will be notified
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 flex-col gap-2 border-t pt-4">
          {currentSchedule && currentSchedule.selectedDays.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearSchedule}
              disabled={isSubmitting}
              className="w-full border-red-300 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20"
            >
              Clear Schedule
            </Button>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Setting..." : "Set Schedule"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleMeetingModal;
