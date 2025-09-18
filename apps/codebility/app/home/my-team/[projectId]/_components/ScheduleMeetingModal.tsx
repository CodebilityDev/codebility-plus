"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@codevs/ui/input";
import { Label } from "@codevs/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@codevs/ui/select";
import { Textarea } from "@codevs/ui/textarea";
import { Calendar, Clock, Users, Video, MapPin, AlertCircle } from "lucide-react";
import { createNotificationAction } from "@/lib/actions/notification.actions";
import { Checkbox } from "@/components/ui/checkbox";

interface ScheduleMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  teamMembers: any[];
  teamLead: any;
}

const ScheduleMeetingModal = ({ isOpen, onClose, projectId, projectName, teamMembers, teamLead }: ScheduleMeetingModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [meetingData, setMeetingData] = useState({
    title: "",
    description: "",
    time: "",
    duration: "60",
    type: "online",
    location: "",
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

  const toggleDay = (day: string) => {
    setMeetingData(prev => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter(d => d !== day)
        : [...prev.selectedDays, day]
    }));
  };

  const handleSubmit = async () => {
    if (!meetingData.title || !meetingData.time || meetingData.selectedDays.length === 0) {
      toast.error("Please fill in all required fields and select at least one day");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create a recurring meeting schedule
      const allMembers = teamLead ? [teamLead, ...teamMembers] : teamMembers;
      
      // Format selected days for display
      const selectedDaysDisplay = meetingData.selectedDays
        .map(day => weekDays.find(d => d.value === day)?.short)
        .join(", ");
      
      const scheduleMessage = `Weekly ${meetingData.title} scheduled every ${selectedDaysDisplay} at ${meetingData.time}`;
      
      // Send notifications to all team members
      const notificationPromises = allMembers.map(member => 
        createNotificationAction({
          recipientId: member.id,
          title: `Recurring Meeting Schedule Set`,
          message: `${scheduleMessage}. ${meetingData.description ? `Details: ${meetingData.description}` : ''} Location: ${meetingData.type === 'online' ? meetingData.location || 'Meeting link will be shared' : meetingData.location || 'TBD'}`,
          type: 'event',
          priority: 'high',
          actionUrl: `/home/my-team/${projectId}`,
          metadata: {
            meetingData: {
              ...meetingData,
              recurring: true,
              schedule: selectedDaysDisplay
            },
            projectId,
            projectName
          }
        })
      );

      await Promise.all(notificationPromises);
      
      // Save the meeting schedule (you can implement backend storage later)
      toast.success("Fixed weekly schedule set and team notified!");
      
      // Reset form
      setMeetingData({
        title: "",
        description: "",
        time: "",
        duration: "60",
        type: "online",
        location: "",
        selectedDays: [],
      });
      
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Set Fixed Weekly Meeting Schedule
          </DialogTitle>
          <DialogDescription>
            As team lead, set a fixed weekly meeting schedule for {projectName}. This will be the regular meeting time for your team.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-3 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <p className="text-sm text-blue-600 dark:text-blue-400">
                This will set a recurring weekly schedule. Team members will be notified of the fixed meeting times.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Meeting Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Team Standup, Sprint Planning"
              value={meetingData.title}
              onChange={(e) => setMeetingData({ ...meetingData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Regular meeting agenda, topics to discuss..."
              value={meetingData.description}
              onChange={(e) => setMeetingData({ ...meetingData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Select Days *</Label>
            <div className="grid grid-cols-4 gap-2">
              {weekDays.map(day => (
                <div
                  key={day.value}
                  className={`
                    flex items-center justify-center p-2 rounded-lg border cursor-pointer transition-colors
                    ${meetingData.selectedDays.includes(day.value)
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }
                  `}
                  onClick={() => toggleDay(day.value)}
                >
                  <span className="text-sm font-medium">{day.short}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500">Click to select meeting days (e.g., MWF for Mon/Wed/Fri)</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="time">Meeting Time *</Label>
              <Input
                id="time"
                type="time"
                value={meetingData.time}
                onChange={(e) => setMeetingData({ ...meetingData, time: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select
                value={meetingData.duration}
                onValueChange={(value) => setMeetingData({ ...meetingData, duration: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Meeting Type</Label>
            <Select
              value={meetingData.type}
              onValueChange={(value) => setMeetingData({ ...meetingData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Online Meeting
                  </div>
                </SelectItem>
                <SelectItem value="in-person">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    In-Person Meeting
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {meetingData.type === "online" ? (
            <div className="space-y-2">
              <Label htmlFor="location">Meeting Link</Label>
              <Input
                id="location"
                placeholder="https://meet.google.com/abc-defg-hij"
                value={meetingData.location}
                onChange={(e) => setMeetingData({ ...meetingData, location: e.target.value })}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Conference Room A, Office Address"
                value={meetingData.location}
                onChange={(e) => setMeetingData({ ...meetingData, location: e.target.value })}
              />
            </div>
          )}

          <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-3">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Users className="h-4 w-4" />
              <span>{teamMembers.length + (teamLead ? 1 : 0)} team members will be notified of this fixed schedule</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Setting Schedule..." : "Set Weekly Schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleMeetingModal;