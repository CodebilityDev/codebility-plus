"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@codevs/ui/input";
import { Label } from "@codevs/ui/label";
import { Calendar, Clock, Users, AlertCircle } from "lucide-react";
import { createNotificationAction } from "@/lib/actions/notification.actions";
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
  } | null;
}

const ScheduleMeetingModal = ({ isOpen, onClose, projectId, projectName, teamMembers, teamLead, currentSchedule }: ScheduleMeetingModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [meetingData, setMeetingData] = useState({
    time: "00:00",
    selectedDays: [] as string[],
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

  // Load existing schedule when modal opens
  useEffect(() => {
    if (isOpen) {
      if (currentSchedule) {
        setMeetingData({
          time: currentSchedule.time || "00:00",
          selectedDays: currentSchedule.selectedDays || [],
        });
      } else {
        // Set defaults if no schedule exists
        setMeetingData({
          time: "00:00",
          selectedDays: [],
        });
      }
    }
  }, [isOpen, currentSchedule]);

  const toggleDay = (day: string) => {
    setMeetingData(prev => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter(d => d !== day)
        : [...prev.selectedDays, day]
    }));
  };

  const handleSubmit = async () => {
    if (!meetingData.time || meetingData.selectedDays.length === 0) {
      toast.error("Please select meeting days and time");
      return;
    }

    setIsSubmitting(true);
    try {
      // Check if schedule has changed
      const hasExistingSchedule = currentSchedule && 
        currentSchedule.selectedDays.length > 0 && 
        currentSchedule.time;
      
      const scheduleChanged = hasExistingSchedule && (
        JSON.stringify(currentSchedule.selectedDays.sort()) !== JSON.stringify(meetingData.selectedDays.sort()) ||
        currentSchedule.time !== meetingData.time
      );
      
      // Create a recurring meeting schedule
      const allMembers = teamLead ? [teamLead, ...teamMembers] : teamMembers;
      
      // Format selected days for display
      const selectedDaysDisplay = meetingData.selectedDays
        .map(day => weekDays.find(d => d.value === day)?.short)
        .join(", ");
      
      const notificationTitle = scheduleChanged ? "Meeting Schedule Changed" : "Meeting Schedule Set";
      const scheduleMessage = `Team meetings scheduled every ${selectedDaysDisplay} at ${meetingData.time} @ Discord`;
      
      // Send notifications to all team members
      const notificationPromises = allMembers.map(member => 
        createNotificationAction({
          recipientId: member.id,
          title: notificationTitle,
          message: scheduleMessage,
          type: 'event',
          priority: 'high',
          actionUrl: `/home/my-team/${projectId}`,
          metadata: {
            meetingData: {
              time: meetingData.time,
              selectedDays: meetingData.selectedDays,
              platform: 'Discord',
              recurring: true,
              schedule: selectedDaysDisplay,
              changed: scheduleChanged
            },
            projectId,
            projectName
          }
        })
      );

      await Promise.all(notificationPromises);
      
      // Save the meeting schedule
      await saveMeetingSchedule(projectId, {
        selectedDays: meetingData.selectedDays,
        time: meetingData.time
      });
      
      toast.success(scheduleChanged ? "Meeting schedule updated!" : "Meeting schedule set!");
      
      onClose();
    } catch (error) {
      console.error("Error setting meeting schedule:", error);
      toast.error("Failed to set meeting schedule");
    } finally {
      setIsSubmitting(false);
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
            Set your team's regular meeting schedule @ Discord
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Select Days *</Label>
            <div className="grid grid-cols-4 gap-2">
              {weekDays.map(day => (
                <div
                  key={day.value}
                  className={`
                    flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all
                    ${meetingData.selectedDays.includes(day.value)
                      ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
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
              onChange={(e) => setMeetingData({ ...meetingData, time: e.target.value })}
              className="w-full"
            />
          </div>

          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-3 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  All meetings will be held on Discord
                </p>
                <p className="text-xs text-blue-500 dark:text-blue-300">
                  {teamMembers.length + 1} team members will be notified
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Setting..." : "Set Schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleMeetingModal;