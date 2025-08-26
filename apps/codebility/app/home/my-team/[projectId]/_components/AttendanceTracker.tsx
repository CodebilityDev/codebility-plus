"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle, XCircle, Coffee, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@codevs/ui/select";
import { SimpleMemberData } from "@/app/home/projects/actions";
import { toast } from "react-hot-toast";

type AttendanceStatus = "present" | "absent" | "late" | "break" | "off";

interface AttendanceRecord {
  memberId: string;
  date: string;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  notes?: string;
}

interface AttendanceTrackerProps {
  teamMembers: SimpleMemberData[];
  teamLead: SimpleMemberData | null;
  projectId: string;
}

const AttendanceTracker = ({ teamMembers, teamLead, projectId }: AttendanceTrackerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, AttendanceRecord>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Combine team lead and members
  const allMembers = teamLead ? [teamLead, ...teamMembers] : teamMembers;

  // Load attendance for selected date
  useEffect(() => {
    if (isOpen) {
      loadAttendanceForDate(selectedDate);
    }
  }, [selectedDate, isOpen]);

  const loadAttendanceForDate = async (date: string) => {
    // In a real app, this would load from database
    // For now, using local state
    const mockData: Record<string, AttendanceRecord> = {};
    allMembers.forEach(member => {
      if (!attendanceRecords[`${member.id}-${date}`]) {
        mockData[`${member.id}-${date}`] = {
          memberId: member.id,
          date: date,
          status: "present",
          checkIn: "09:00",
          checkOut: "18:00"
        };
      }
    });
    setAttendanceRecords(prev => ({ ...prev, ...mockData }));
  };

  const updateAttendance = (memberId: string, status: AttendanceStatus) => {
    const key = `${memberId}-${selectedDate}`;
    setAttendanceRecords(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        memberId,
        date: selectedDate,
        status,
        checkIn: status === "present" || status === "late" ? (prev[key]?.checkIn || "09:00") : undefined,
        checkOut: status === "present" || status === "late" ? (prev[key]?.checkOut || "18:00") : undefined,
      }
    }));
  };

  const saveAttendance = async () => {
    setIsLoading(true);
    try {
      // In a real app, save to database
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Attendance saved successfully");
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to save attendance");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "absent":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "late":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "break":
        return <Coffee className="h-4 w-4 text-blue-500" />;
      case "off":
        return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "absent":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "late":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "break":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "off":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  // Calculate today's attendance summary
  const todaysSummary = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = Object.values(attendanceRecords).filter(r => r.date === today);
    
    return {
      present: todayRecords.filter(r => r.status === "present").length,
      absent: todayRecords.filter(r => r.status === "absent").length,
      late: todayRecords.filter(r => r.status === "late").length,
      total: allMembers.length
    };
  };

  const summary = todaysSummary();

  return (
    <>
      {/* Summary Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Today's Attendance
            </h3>
            <div className="mt-2 flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  {summary.present} Present
                </span>
              </span>
              <span className="flex items-center gap-1">
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  {summary.absent} Absent
                </span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  {summary.late} Late
                </span>
              </span>
            </div>
          </div>
          <Button
            onClick={() => setIsOpen(true)}
            size="sm"
            variant="outline"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Manage Attendance
          </Button>
        </div>
      </div>

      {/* Attendance Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Team Attendance</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Date Selector */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
              />
            </div>

            {/* Member List */}
            <div className="space-y-2">
              {allMembers.map((member) => {
                const key = `${member.id}-${selectedDate}`;
                const record = attendanceRecords[key];
                const isLead = teamLead?.id === member.id;

                return (
                  <div
                    key={member.id}
                    className="flex items-center gap-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {member.first_name} {member.last_name}
                        </span>
                        {isLead && (
                          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                            Team Lead
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {member.display_position || "Team Member"}
                      </span>
                    </div>

                    <Select
                      value={record?.status || "present"}
                      onValueChange={(value: AttendanceStatus) => updateAttendance(member.id, value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="present">
                          <span className="flex items-center gap-2">
                            {getStatusIcon("present")} Present
                          </span>
                        </SelectItem>
                        <SelectItem value="absent">
                          <span className="flex items-center gap-2">
                            {getStatusIcon("absent")} Absent
                          </span>
                        </SelectItem>
                        <SelectItem value="late">
                          <span className="flex items-center gap-2">
                            {getStatusIcon("late")} Late
                          </span>
                        </SelectItem>
                        <SelectItem value="break">
                          <span className="flex items-center gap-2">
                            {getStatusIcon("break")} Break
                          </span>
                        </SelectItem>
                        <SelectItem value="off">
                          <span className="flex items-center gap-2">
                            {getStatusIcon("off")} Day Off
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={saveAttendance}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Attendance"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AttendanceTracker;