"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@codevs/ui/input";
import { Label } from "@codevs/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@codevs/ui/select";
import { Textarea } from "@codevs/ui/textarea";
import { Calendar, Clock, MapPin, Users, Video } from "lucide-react";
import { createNotification } from "@/lib/actions/notification.actions";

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
    date: "",
    time: "",
    duration: "60",
    type: "online",
    location: "",
    isRecurring: false,
    recurringFrequency: "weekly"
  });

  const handleSubmit = async () => {
    if (!meetingData.title || !meetingData.date || !meetingData.time) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create notifications for all team members
      const allMembers = teamLead ? [teamLead, ...teamMembers] : teamMembers;
      const meetingDateTime = new Date(`${meetingData.date}T${meetingData.time}`);
      
      const notificationPromises = allMembers.map(member => 
        createNotification({
          recipientId: member.id,
          title: `Meeting Scheduled: ${meetingData.title}`,
          message: `A meeting has been scheduled for ${meetingDateTime.toLocaleDateString()} at ${meetingData.time}. ${meetingData.description ? `Details: ${meetingData.description}` : ''}`,
          type: 'event',
          priority: 'high',
          actionUrl: `/home/my-team/${projectId}`,
          metadata: {
            meetingData,
            projectId,
            projectName
          }
        })
      );

      await Promise.all(notificationPromises);
      
      toast.success("Meeting scheduled and team members notified!");
      onClose();
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      toast.error("Failed to schedule meeting");
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
            Schedule Team Meeting
          </DialogTitle>
          <DialogDescription>
            Schedule a meeting for {projectName} team. All team members will be notified.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Meeting Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Sprint Planning Meeting"
              value={meetingData.title}
              onChange={(e) => setMeetingData({ ...meetingData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Meeting agenda and details..."
              value={meetingData.description}
              onChange={(e) => setMeetingData({ ...meetingData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={meetingData.date}
                onChange={(e) => setMeetingData({ ...meetingData, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={meetingData.time}
                onChange={(e) => setMeetingData({ ...meetingData, time: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
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
                      Online
                    </div>
                  </SelectItem>
                  <SelectItem value="in-person">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      In-Person
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                placeholder="Conference Room A"
                value={meetingData.location}
                onChange={(e) => setMeetingData({ ...meetingData, location: e.target.value })}
              />
            </div>
          )}

          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-3">
            <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
              <Users className="h-4 w-4" />
              <span>{teamMembers.length + (teamLead ? 1 : 0)} team members will be notified</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Scheduling..." : "Schedule Meeting"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleMeetingModal;